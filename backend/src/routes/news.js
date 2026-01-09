/**
 * SV Portfolio - News Routes
 * API endpoints for financial news
 */

import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import newsService from '../services/news-service.js';

const router = express.Router();

/**
 * GET /api/news/:symbol
 * Get news for a specific symbol
 */
router.get('/:symbol', authMiddleware, async (req, res) => {
    try {
        const { symbol } = req.params;
        const { 
            limit = 20, 
            sources,
            type,
            category,
            sentiment,
            useCache = 'true'
        } = req.query;
        
        // Try to get from database first if cache enabled
        if (useCache === 'true') {
            const cachedNews = await newsService.getNewsFromDatabase({
                ticker: symbol,
                type: type || undefined,
                category: category || undefined,
                sentiment: sentiment || undefined,
                limit: parseInt(limit)
            });
            
            if (cachedNews.length > 0) {
                return res.json({
                    symbol,
                    count: cachedNews.length,
                    news: cachedNews,
                    cached: true
                });
            }
        }
        
        // Fetch fresh news
        const options = {
            limit: parseInt(limit),
            sources: sources ? sources.split(',') : ['yahoo', 'finnhub', 'sec']
        };
        
        const news = await newsService.getNewsForSymbol(symbol, options);
        
        // Save to database
        if (news.length > 0) {
            await newsService.saveNewsToDatabase(symbol, news);
        }
        
        res.json({
            symbol,
            count: news.length,
            news,
            cached: false
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

/**
 * POST /api/news/batch
 * Get news for multiple symbols
 */
router.post('/batch', authMiddleware, async (req, res) => {
    try {
        const { symbols, limit = 10 } = req.body;
        
        if (!Array.isArray(symbols) || symbols.length === 0) {
            return res.status(400).json({ error: 'Invalid symbols array' });
        }
        
        if (symbols.length > 20) {
            return res.status(400).json({ error: 'Maximum 20 symbols per request' });
        }
        
        const results = {};
        
        // Fetch news for each symbol
        for (const symbol of symbols) {
            try {
                const news = await newsService.getNewsForSymbol(symbol, { limit });
                results[symbol] = news;
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error fetching news for ${symbol}:`, error);
                results[symbol] = [];
            }
        }
        
        res.json({
            symbols,
            results
        });
    } catch (error) {
        console.error('Error in batch news fetch:', error);
        res.status(500).json({ error: 'Failed to fetch batch news' });
    }
});

/**
 * GET /api/news/portfolio/:portfolioId
 * Get news for all positions in a portfolio
 */
router.get('/portfolio/:portfolioId', authMiddleware, async (req, res) => {
    try {
        const { portfolioId } = req.params;
        const { limit = 5 } = req.query;
        
        // Get portfolio positions - validate ownership
        const portfolio = await req.prisma.portfolio.findFirst({
            where: { 
                id: portfolioId,
                userId: req.userId
            },
            include: {
                positions: {
                    select: { ticker: true }
                }
            }
        });
        
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found or access denied' });
        }
        
        const symbols = [...new Set(portfolio.positions.map(p => p.ticker))];
        
        if (symbols.length === 0) {
            return res.json({ portfolio: portfolioId, news: [] });
        }
        
        // Fetch news for each symbol
        const allNews = [];
        
        for (const symbol of symbols) {
            try {
                const news = await newsService.getNewsForSymbol(symbol, { 
                    limit: parseInt(limit) 
                });
                
                news.forEach(article => {
                    allNews.push({
                        ...article,
                        symbol
                    });
                });
                
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error fetching news for ${symbol}:`, error);
            }
        }
        
        // Sort by date
        allNews.sort((a, b) => b.publishedAt - a.publishedAt);
        
        res.json({
            portfolio: portfolioId,
            symbols,
            count: allNews.length,
            news: allNews.slice(0, 50) // Max 50 total articles
        });
    } catch (error) {
        console.error('Error fetching portfolio news:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio news' });
    }
});

/**
 * GET /api/news/filters/types
 * Get available news types
 */
router.get('/filters/types', authMiddleware, async (req, res) => {
    try {
        const types = ['article', 'filing', 'earnings', 'dividend', 'merger'];
        const categories = ['earnings', 'dividends', 'merger', 'acquisition', 'regulation', 'market'];
        const sentiments = ['positive', 'negative', 'neutral'];
        
        res.json({
            types,
            categories,
            sentiments
        });
    } catch (error) {
        console.error('Error getting filters:', error);
        res.status(500).json({ error: 'Failed to get filters' });
    }
});

/**
 * POST /api/news/preferences
 * Update user news preferences
 */
router.post('/preferences', authMiddleware, async (req, res) => {
    try {
        const { enablePush, minSentiment, categories, tickers } = req.body;
        
        const preferences = await req.prisma.userNewsPreference.upsert({
            where: { userId: req.userId },
            create: {
                userId: req.userId,
                enablePush: enablePush !== undefined ? enablePush : true,
                minSentiment: minSentiment || null,
                categories: categories || [],
                tickers: tickers || []
            },
            update: {
                enablePush: enablePush !== undefined ? enablePush : undefined,
                minSentiment: minSentiment !== undefined ? minSentiment : undefined,
                categories: categories !== undefined ? categories : undefined,
                tickers: tickers !== undefined ? tickers : undefined
            }
        });
        
        res.json({ preferences });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ error: 'Failed to update preferences' });
    }
});

/**
 * GET /api/news/preferences
 * Get user news preferences
 */
router.get('/preferences', authMiddleware, async (req, res) => {
    try {
        const preferences = await req.prisma.userNewsPreference.findUnique({
            where: { userId: req.userId }
        });
        
        res.json({ 
            preferences: preferences || {
                enablePush: true,
                minSentiment: null,
                categories: [],
                tickers: []
            }
        });
    } catch (error) {
        console.error('Error getting preferences:', error);
        res.status(500).json({ error: 'Failed to get preferences' });
    }
});

export default router;
