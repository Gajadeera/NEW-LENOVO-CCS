const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function setupWebSocket(server, app) {
    const wss = new WebSocket.Server({ server });

    const activeConnections = new Map();
    const onlineUsers = new Set();

    wss.on('connection', (ws, req) => {
        const token = req.url.split('token=')[1]?.split('&')[0];

        if (!token) {
            ws.close(1008, 'Authentication required');
            return;
        }

        try {
            const decoded = jwt.verify(token, config.jwt.secret);
            const id = decoded.id;

            activeConnections.set(id, ws);
            onlineUsers.add(id);
            console.log(`User ${id} connected`);

            broadcastOnlineUsers();
            broadcastUserStatus(id, true);

            const heartbeatInterval = setInterval(() => {
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({ type: 'heartbeat' }));
                }
            }, 30000);

            ws.on('message', (message) => {
                console.log(`Received message from ${id}: ${message}`);
            });

            ws.on('close', () => {
                clearInterval(heartbeatInterval);
                activeConnections.delete(id);
                onlineUsers.delete(id);
                broadcastOnlineUsers();
                broadcastUserStatus(id, false);
            });

            ws.on('error', (error) => {
                console.error(`WebSocket error for user ${id}:`, error);
                clearInterval(heartbeatInterval);
                activeConnections.delete(id);
                onlineUsers.delete(id);
                broadcastOnlineUsers();
                broadcastUserStatus(id, false);
            });

            ws.send(JSON.stringify({
                type: 'ONLINE_USERS',
                ids: Array.from(onlineUsers)
            }));

        } catch (err) {
            ws.close(1008, 'Invalid token');
        }
    });

    function broadcastOnlineUsers() {
        const message = JSON.stringify({
            type: 'ONLINE_USERS',
            ids: Array.from(onlineUsers)
        });

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    function broadcastUserStatus(id, isOnline) {
        const message = JSON.stringify({
            type: 'USER_STATUS_CHANGE',
            id,
            isOnline,
            timestamp: new Date().toISOString()
        });

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    app.locals.wss = wss;
    app.locals.activeConnections = activeConnections;
}

module.exports = setupWebSocket;
