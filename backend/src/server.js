import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolios.js';
import settingsRoutes from './routes/settings.js';
import newsRoutes from './routes/news.js';
import { authMiddleware } from './middleware/auth.js';
import scheduler from './services/background-scheduler.js';
import newsService from './services/news-service.js';

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

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SV Portfolio API v3.0`);
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Ready to accept connections\n`);
    
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
            await newsService.updateNewsForSymbols(popularSymbols, { limit: 10 });
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
    
    // Job 3: Price cache cleanup (every 24 hours)
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
