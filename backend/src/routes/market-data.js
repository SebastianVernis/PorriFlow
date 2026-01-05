/**
 * SV Portfolio - Market Data Routes
 * API endpoints for symbol and historical data
 */

import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import marketDataService from '../services/market-data-service.js';

const router = express.Router();

/**
 * GET /api/market-data/symbols
 * Get all available symbols
 */
router.get('/symbols', authMiddleware, async (req, res) => {
    try {
        const symbols = marketDataService.getAllSymbols();
        
        res.json({
            count: symbols.length,
            symbols,
            categories: Object.keys(marketDataService.SYMBOL_DATABASE)
        });
    } catch (error) {
        console.error('Error getting symbols:', error);
        res.status(500).json({ error: 'Failed to get symbols' });
    }
});

/**
 * GET /api/market-data/historical/:symbol
 * Get historical data for a symbol
 */
router.get('/historical/:symbol', authMiddleware, async (req, res) => {
    try {
        const { symbol } = req.params;
        const { startDate, endDate, limit = 365 } = req.query;
        
        const data = await marketDataService.getHistoricalData(symbol, {
            startDate,
            endDate,
            limit: parseInt(limit)
        });
        
        res.json({
            symbol,
            count: data.length,
            data
        });
    } catch (error) {
        console.error('Error getting historical data:', error);
        res.status(500).json({ error: 'Failed to get historical data' });
    }
});

/**
 * POST /api/market-data/download
 * Trigger download of historical data for specific symbols
 */
router.post('/download', authMiddleware, async (req, res) => {
    try {
        const { symbols, period1, period2, interval = '1d' } = req.body;
        
        if (!Array.isArray(symbols) || symbols.length === 0) {
            return res.status(400).json({ error: 'Invalid symbols array' });
        }
        
        if (symbols.length > 50) {
            return res.status(400).json({ error: 'Maximum 50 symbols per request' });
        }
        
        // Start download in background (don't wait)
        setImmediate(async () => {
            await marketDataService.batchDownloadHistoricalData(symbols, {
                period1,
                period2,
                interval
            });
        });
        
        res.json({
            message: 'Download started',
            symbols,
            estimatedTime: `${symbols.length * 2} seconds`
        });
    } catch (error) {
        console.error('Error starting download:', error);
        res.status(500).json({ error: 'Failed to start download' });
    }
});

/**
 * GET /api/market-data/price/:symbol
 * Get latest cached price for a symbol
 */
router.get('/price/:symbol', authMiddleware, async (req, res) => {
    try {
        const { symbol } = req.params;
        
        const priceData = await req.prisma.priceCache.findUnique({
            where: { ticker: symbol }
        });
        
        if (!priceData) {
            // Try to fetch fresh data
            const latest = await marketDataService.updatePriceCache(symbol);
            
            if (!latest) {
                return res.status(404).json({ error: 'Price not found' });
            }
            
            return res.json({
                symbol,
                price: latest.close,
                timestamp: latest.date,
                fresh: true
            });
        }
        
        res.json({
            symbol,
            price: priceData.price,
            bid: priceData.bid,
            ask: priceData.ask,
            timestamp: priceData.timestamp,
            fresh: false
        });
    } catch (error) {
        console.error('Error getting price:', error);
        res.status(500).json({ error: 'Failed to get price' });
    }
});

/**
 * POST /api/market-data/prices/batch
 * Get cached prices for multiple symbols
 */
router.post('/prices/batch', authMiddleware, async (req, res) => {
    try {
        const { symbols } = req.body;
        
        if (!Array.isArray(symbols) || symbols.length === 0) {
            return res.status(400).json({ error: 'Invalid symbols array' });
        }
        
        const prices = await req.prisma.priceCache.findMany({
            where: {
                ticker: { in: symbols }
            }
        });
        
        const priceMap = {};
        prices.forEach(p => {
            priceMap[p.ticker] = {
                price: p.price,
                bid: p.bid,
                ask: p.ask,
                timestamp: p.timestamp
            };
        });
        
        res.json({ prices: priceMap });
    } catch (error) {
        console.error('Error getting batch prices:', error);
        res.status(500).json({ error: 'Failed to get prices' });
    }
});

/**
 * GET /api/market-data/stats
 * Get database statistics
 */
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const [symbolCount, historicalCount, priceCount] = await Promise.all([
            req.prisma.position.count({ distinct: ['ticker'] }),
            req.prisma.historicalData.count(),
            req.prisma.priceCache.count()
        ]);
        
        res.json({
            tracked_symbols: symbolCount,
            historical_data_points: historicalCount,
            cached_prices: priceCount
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

export default router;
