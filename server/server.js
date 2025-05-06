const http = require('http');
const app = require('./app');
const setupWebSocket = require('./websocket/websocket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Attach WebSocket server
setupWebSocket(server, app);

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
