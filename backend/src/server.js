import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolios.js';
import settingsRoutes from './routes/settings.js';
import newsRoutes from './routes/news.js';
import marketDataRoutes from './routes/market-data.js';
import debugRoutes from './routes/debug.js';
import { authMiddleware } from './middleware/auth.js';
import scheduler from './services/background-scheduler.js';
import newsService from './services/news-service.js';
import marketDataService from './services/market-data-service.js';
import wsService from './services/websocket-service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '3.0', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', authMiddleware, portfolioRoutes);
app.use('/api/settings', authMiddleware, settingsRoutes);
app.use('/api/news', authMiddleware, newsRoutes);
app.use('/api/market-data', authMiddleware, marketDataRoutes);
app.use('/api/debug', debugRoutes); // Debug routes (no auth for diagnostics)

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Create HTTP server (needed for WebSocket)
const server = createServer(app);

// Initialize WebSocket
wsService.initialize(server);

// Start server
server.listen(PORT, () => {
    console.log(`🚀 SV Portfolio API v3.0`);
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Ready to accept connections`);
    console.log(`🔌 WebSocket available at ws://localhost:${PORT}/ws\n`);
    
    // Initialize background jobs
    initializeBackgroundJobs();
});

// Background jobs configuration
function initializeBackgroundJobs() {
    const ENABLE_BACKGROUND_JOBS = process.env.ENABLE_BACKGROUND_JOBS === 'true';
    
    if (!ENABLE_BACKGROUND_JOBS) {
        console.log('⏸️  Background jobs disabled (set ENABLE_BACKGROUND_JOBS=true to enable)\n');
        return;
    }
    
    console.log('🔧 Configuring background jobs...\n');
    
    // Job 1: Update news for popular symbols (every 30 minutes)
    scheduler.register(
        'news-update-popular',
        async () => {
            const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'BTC-USD', 'ETH-USD'];
            const results = await newsService.updateNewsForSymbols(popularSymbols, { limit: 10 });
            
            // Notify connected users about new articles
            if (results.totalArticles > 0) {
                const connectedUsers = wsService.getConnectedUsers();
                if (connectedUsers.length > 0) {
                    wsService.broadcastNews(connectedUsers, {
                        message: `${results.totalArticles} nuevas noticias disponibles`,
                        symbols: popularSymbols
                    });
                }
            }
        },
        30 * 60 * 1000, // 30 minutes
        { enabled: true, runOnStart: false }
    );
    
    // Job 2: Update news for all tracked symbols (every 6 hours)
    scheduler.register(
        'news-update-all',
        async () => {
            // Get all unique tickers from database
            const { PrismaClient } = await import('@prisma/client');
            const prisma = new PrismaClient();
            
            const positions = await prisma.position.findMany({
                select: { ticker: true },
                distinct: ['ticker']
            });
            
            const symbols = positions.map(p => p.ticker);
            if (symbols.length > 0) {
                await newsService.updateNewsForSymbols(symbols, { limit: 5 });
            }
            
            await prisma.$disconnect();
        },
        6 * 60 * 60 * 1000, // 6 hours
        { enabled: true, runOnStart: false }
    );
    
    // Job 3: Download historical data for tracked symbols (every 24 hours)
    scheduler.register(
        'historical-data-download',
        async () => {
            const { PrismaClient } = await import('@prisma/client');
            const prisma = new PrismaClient();
            
            // Get all unique tickers from positions
            const positions = await prisma.position.findMany({
                select: { ticker: true },
                distinct: ['ticker']
            });
            
            const symbols = positions.map(p => p.ticker);
            
            if (symbols.length > 0) {
                // Download last 30 days of data
                const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
                const now = Math.floor(Date.now() / 1000);
                
                await marketDataService.batchDownloadHistoricalData(symbols, {
                    period1: thirtyDaysAgo,
                    period2: now,
                    interval: '1d'
                });
            }
            
            await prisma.$disconnect();
        },
        24 * 60 * 60 * 1000, // 24 hours
        { enabled: true, runOnStart: false }
    );
    
    // Job 4: Price cache update (every 5 minutes during market hours)
    scheduler.register(
        'price-cache-update',
        async () => {
            const { PrismaClient } = await import('@prisma/client');
            const prisma = new PrismaClient();
            
            // Get most active positions
            const positions = await prisma.position.findMany({
                select: { ticker: true },
                distinct: ['ticker'],
                take: 50 // Top 50 most used symbols
            });
            
            const symbols = positions.map(p => p.ticker);
            
            for (const symbol of symbols) {
                await marketDataService.updatePriceCache(symbol);
                await new Promise(r => setTimeout(r, 500)); // Rate limit
            }
            
            await prisma.$disconnect();
        },
        5 * 60 * 1000, // 5 minutes
        { enabled: true, runOnStart: false }
    );
    
    // Job 5: Cache cleanup (every 24 hours)
    scheduler.register(
        'cache-cleanup',
        async () => {
            const { PrismaClient } = await import('@prisma/client');
            const prisma = new PrismaClient();
            
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            
            const result = await prisma.priceCache.deleteMany({
                where: {
                    updatedAt: { lt: oneDayAgo }
                }
            });
            
            console.log(`   🗑️  Deleted ${result.count} old cache entries`);
            await prisma.$disconnect();
        },
        24 * 60 * 60 * 1000, // 24 hours
        { enabled: true, runOnStart: false }
    );
    
    // Start scheduler
    scheduler.start();
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM received, shutting down gracefully...');
    scheduler.stop();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT received, shutting down gracefully...');
    scheduler.stop();
    process.exit(0);
});

export default app;
