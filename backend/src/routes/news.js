/**
 * SV Portfolio - News Routes
 * API endpoints for financial news
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import newsService from '../services/news-service.js';

const router = express.Router();

/**
 * GET /api/news/:symbol
 * Get news for a specific symbol
 */
router.get('/:symbol', authenticate, async (req, res) => {
    try {
        const { symbol } = req.params;
        const { limit = 20, sources } = req.query;
        
        const options = {
            limit: parseInt(limit),
            sources: sources ? sources.split(',') : ['yahoo', 'finnhub', 'sec']
        };
        
        const news = await newsService.getNewsForSymbol(symbol, options);
        
        res.json({
            symbol,
            count: news.length,
            news
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
router.post('/batch', authenticate, async (req, res) => {
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
router.get('/portfolio/:portfolioId', authenticate, async (req, res) => {
    try {
        const { portfolioId } = req.params;
        const { limit = 5 } = req.query;
        
        // Get portfolio positions
        const portfolio = await req.prisma.portfolio.findUnique({
            where: { 
                id: portfolioId,
                userId: req.user.userId 
            },
            include: {
                positions: {
                    select: { ticker: true }
                }
            }
        });
        
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
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

export default router;
