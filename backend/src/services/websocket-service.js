/**
 * SV Portfolio - WebSocket Service
 * Real-time push notifications for news and updates
 */

import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

class WebSocketService {
    constructor() {
        this.wss = null;
        this.clients = new Map(); // userId -> Set of WebSocket connections
    }

    /**
     * Initialize WebSocket server
     */
    initialize(server) {
        this.wss = new WebSocketServer({ 
            server,
            path: '/ws'
        });

        this.wss.on('connection', (ws, req) => {
            this.handleConnection(ws, req);
        });

        console.log('📡 WebSocket server initialized on /ws');
    }

    /**
     * Handle new WebSocket connection
     */
    handleConnection(ws, req) {
        let userId = null;

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message.toString());

                // Handle authentication
                if (data.type === 'auth') {
                    const token = data.token;
                    
                    try {
                        const decoded = jwt.verify(token, process.env.JWT_SECRET);
                        userId = decoded.userId;

                        // Add to clients map
                        if (!this.clients.has(userId)) {
                            this.clients.set(userId, new Set());
                        }
                        this.clients.get(userId).add(ws);

                        // Send auth success
                        ws.send(JSON.stringify({
                            type: 'auth_success',
                            userId
                        }));

                        console.log(`✅ WebSocket client authenticated: ${userId}`);

                    } catch (error) {
                        ws.send(JSON.stringify({
                            type: 'auth_error',
                            error: 'Invalid token'
                        }));
                        ws.close();
                    }
                }

                // Handle ping
                if (data.type === 'ping') {
                    ws.send(JSON.stringify({ type: 'pong' }));
                }

            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        });

        ws.on('close', () => {
            if (userId && this.clients.has(userId)) {
                this.clients.get(userId).delete(ws);
                
                // Clean up empty sets
                if (this.clients.get(userId).size === 0) {
                    this.clients.delete(userId);
                }
                
                console.log(`🔌 WebSocket client disconnected: ${userId}`);
            }
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    /**
     * Send news notification to specific user
     */
    sendNewsToUser(userId, news) {
        const connections = this.clients.get(userId);
        
        if (!connections || connections.size === 0) {
            return false;
        }

        const message = JSON.stringify({
            type: 'news',
            data: news
        });

        let sent = 0;
        connections.forEach(ws => {
            if (ws.readyState === ws.OPEN) {
                ws.send(message);
                sent++;
            }
        });

        return sent > 0;
    }

    /**
     * Broadcast news to multiple users
     */
    broadcastNews(userIds, news) {
        let totalSent = 0;

        userIds.forEach(userId => {
            if (this.sendNewsToUser(userId, news)) {
                totalSent++;
            }
        });

        return totalSent;
    }

    /**
     * Send price update to user
     */
    sendPriceUpdate(userId, priceData) {
        const connections = this.clients.get(userId);
        
        if (!connections || connections.size === 0) {
            return false;
        }

        const message = JSON.stringify({
            type: 'price_update',
            data: priceData
        });

        connections.forEach(ws => {
            if (ws.readyState === ws.OPEN) {
                ws.send(message);
            }
        });

        return true;
    }

    /**
     * Send custom notification to user
     */
    sendNotification(userId, notification) {
        const connections = this.clients.get(userId);
        
        if (!connections || connections.size === 0) {
            return false;
        }

        const message = JSON.stringify({
            type: 'notification',
            data: notification
        });

        connections.forEach(ws => {
            if (ws.readyState === ws.OPEN) {
                ws.send(message);
            }
        });

        return true;
    }

    /**
     * Get connected clients count
     */
    getConnectedCount() {
        return this.clients.size;
    }

    /**
     * Get all connected user IDs
     */
    getConnectedUsers() {
        return Array.from(this.clients.keys());
    }

    /**
     * Check if user is connected
     */
    isUserConnected(userId) {
        return this.clients.has(userId) && this.clients.get(userId).size > 0;
    }
}

// Singleton instance
const wsService = new WebSocketService();

export default wsService;
export { WebSocketService };
