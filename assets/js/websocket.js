/**
 * SV Portfolio - WebSocket Client
 * Real-time notifications for news and updates
 */

class WebSocketClient {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.listeners = new Map();
        this.isConnected = false;
    }

    /**
     * Connect to WebSocket server
     */
    connect(token) {
        const apiUrl = localStorage.getItem('sv_api_url') || 'http://localhost:3000';
        const wsUrl = apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
        
        try {
            this.ws = new WebSocket(`${wsUrl}/ws`);
            
            this.ws.onopen = () => {
                console.log('✅ WebSocket connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                
                // Send authentication
                this.send({ type: 'auth', token });
                
                // Start heartbeat
                this.startHeartbeat();
                
                // Emit connected event
                this.emit('connected');
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('WebSocket message parse error:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                this.isConnected = false;
                this.stopHeartbeat();
                
                // Attempt reconnect
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                    
                    setTimeout(() => {
                        this.connect(token);
                    }, this.reconnectDelay);
                } else {
                    console.error('Max reconnect attempts reached');
                    this.emit('disconnected');
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.emit('error', error);
            };
            
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
        }
    }

    /**
     * Disconnect from WebSocket
     */
    disconnect() {
        this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnect
        this.stopHeartbeat();
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        this.isConnected = false;
    }

    /**
     * Send message to server
     */
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    /**
     * Handle incoming message
     */
    handleMessage(data) {
        const { type, ...payload } = data;
        
        switch (type) {
            case 'auth_success':
                console.log('✅ WebSocket authenticated');
                this.emit('authenticated', payload);
                break;
                
            case 'auth_error':
                console.error('❌ WebSocket authentication failed');
                this.emit('auth_error', payload);
                break;
                
            case 'news':
                console.log('📰 New news notification');
                this.emit('news', payload.data);
                break;
                
            case 'price_update':
                console.log('💰 Price update received');
                this.emit('price_update', payload.data);
                break;
                
            case 'notification':
                console.log('🔔 Notification received');
                this.emit('notification', payload.data);
                break;
                
            case 'pong':
                // Heartbeat response
                break;
                
            default:
                console.warn('Unknown message type:', type);
        }
    }

    /**
     * Start heartbeat ping
     */
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.isConnected) {
                this.send({ type: 'ping' });
            }
        }, 30000); // Every 30 seconds
    }

    /**
     * Stop heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Register event listener
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * Remove event listener
     */
    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Emit event to listeners
     */
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} listener:`, error);
                }
            });
        }
    }
}

// Singleton instance
const wsClient = new WebSocketClient();

// Auto-connect if token exists
const token = localStorage.getItem('sv_auth_token');
if (token && window.location.pathname !== '/login.html' && !window.location.pathname.endsWith('login.html')) {
    wsClient.connect(token);
}

// Make globally available
window.wsClient = wsClient;

export default wsClient;
