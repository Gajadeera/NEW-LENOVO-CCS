import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext'; // Import the auth context

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [ws, setWs] = useState(null);
    const [connectionAttempts, setConnectionAttempts] = useState(0);
    const { user } = useAuth(); // Get user from AuthContext

    useEffect(() => {
        // Only attempt connection if user is authenticated
        if (!user?.token) {
            console.log('No user token available, skipping WebSocket connection');
            return;
        }

        const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL;
        if (!baseUrl) {
            console.error('WebSocket base URL not configured');
            return;
        }

        const wsUrl = baseUrl
            .replace('http://', 'ws://')
            .replace('https://', 'wss://')
            + `?token=${user.token}`; // Use token from user object

        const websocket = new WebSocket(wsUrl);

        websocket.onopen = () => {
            console.log('WebSocket connected');
            setWs(websocket);
            setConnectionAttempts(0);
        };

        websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'ONLINE_USERS') {
                    setOnlineUsers(new Set(data.ids));
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }

        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        websocket.onclose = (event) => {
            console.log('WebSocket closed:', event.code, event.reason);
            if (user?.token && connectionAttempts < 5) { // Only reconnect if still authenticated
                const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000);
                console.log(`Reconnecting in ${delay}ms...`);
                setTimeout(() => setConnectionAttempts(prev => prev + 1), delay);
            }
        };

        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close(1000, 'Component unmounted');
            }
        };
    }, [user?.token, connectionAttempts]); // Reconnect when token or attempts change

    return (
        <WebSocketContext.Provider value={{ onlineUsers, ws }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);