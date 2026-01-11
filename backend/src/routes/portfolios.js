import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validatePortfolioOwnership, validatePositionOwnership } from '../middleware/multitenancy.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all portfolios for user
router.get('/', async (req, res) => {
    try {
        const portfolios = await prisma.portfolio.findMany({
            where: { userId: req.userId },
            include: {
                positions: true
            },
            orderBy: { createdAt: 'asc' }
        });

        res.json(portfolios);
    } catch (error) {
        console.error('Get portfolios error:', error);
        res.status(500).json({ error: 'Failed to fetch portfolios' });
    }
});

// Create portfolio
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Portfolio name is required' });
        }

        const portfolio = await prisma.portfolio.create({
            data: {
                userId: req.userId,
                name,
                description,
                isDefault: false
            }
        });

        res.status(201).json({ portfolio });
    } catch (error) {
        console.error('Create portfolio error:', error);
        res.status(500).json({ error: 'Failed to create portfolio' });
    }
});

// Get single portfolio
router.get('/:id', validatePortfolioOwnership, async (req, res) => {
    try {
        const portfolio = await prisma.portfolio.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId
            },
            include: {
                positions: true
            }
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        res.json({ portfolio });
    } catch (error) {
        console.error('Get portfolio error:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});

// Update portfolio
router.put('/:id', validatePortfolioOwnership, async (req, res) => {
    try {
        const { name, description } = req.body;

        const portfolio = await prisma.portfolio.updateMany({
            where: {
                id: req.params.id,
                userId: req.userId
            },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description })
            }
        });

        if (portfolio.count === 0) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        res.json({ message: 'Portfolio updated' });
    } catch (error) {
        console.error('Update portfolio error:', error);
        res.status(500).json({ error: 'Failed to update portfolio' });
    }
});

// Delete portfolio
router.delete('/:id', validatePortfolioOwnership, async (req, res) => {
    try {
        const portfolio = await prisma.portfolio.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        if (portfolio.isDefault) {
            return res.status(400).json({ error: 'Cannot delete default portfolio' });
        }

        await prisma.portfolio.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Portfolio deleted' });
    } catch (error) {
        console.error('Delete portfolio error:', error);
        res.status(500).json({ error: 'Failed to delete portfolio' });
    }
});

// Add position
router.post('/:id/positions', validatePortfolioOwnership, async (req, res) => {
    try {
        const { ticker, shares, avgCost, currentPrice, beta, dgr, dividendYield, sector, name, isCrypto } = req.body;

        if (!ticker || shares === undefined || avgCost === undefined) {
            return res.status(400).json({ error: 'Ticker, shares, and avgCost are required' });
        }

        // Portfolio already validated by middleware
        const position = await prisma.position.create({
            data: {
                portfolioId: req.params.id,
                ticker: ticker.toUpperCase(),
                shares,
                avgCost,
                currentPrice: currentPrice || avgCost,
                beta: beta || 1.0,
                dgr: dgr || 0.0,
                dividendYield: dividendYield || 0.0,
                sector: sector || 'Other',
                name: name || ticker,
                isCrypto: isCrypto || false
            }
        });

        res.status(201).json({ position });
    } catch (error) {
        console.error('Add position error:', error);
        res.status(500).json({ error: 'Failed to add position' });
    }
});

// Update position
router.put('/:portfolioId/positions/:positionId', validatePositionOwnership, async (req, res) => {
    try {
        const { shares, avgCost, currentPrice } = req.body;

        // Ownership already validated by middleware
        const position = await prisma.position.updateMany({
            where: {
                id: req.params.positionId,
                portfolioId: req.params.portfolioId
            },
            data: {
                ...(shares !== undefined && { shares }),
                ...(avgCost !== undefined && { avgCost }),
                ...(currentPrice !== undefined && { currentPrice })
            }
        });

        if (position.count === 0) {
            return res.status(404).json({ error: 'Position not found' });
        }

        res.json({ message: 'Position updated' });
    } catch (error) {
        console.error('Update position error:', error);
        res.status(500).json({ error: 'Failed to update position' });
    }
});

// Delete position
router.delete('/:portfolioId/positions/:positionId', validatePositionOwnership, async (req, res) => {
    try {
        // Ownership already validated by middleware
        await prisma.position.deleteMany({
            where: {
                id: req.params.positionId,
                portfolioId: req.params.portfolioId
            }
        });

        res.json({ message: 'Position deleted' });
    } catch (error) {
        console.error('Delete position error:', error);
        res.status(500).json({ error: 'Failed to delete position' });
    }
});

// Bulk update positions (for price refresh)
router.post('/:id/positions/bulk-update', validatePortfolioOwnership, async (req, res) => {
    try {
        const { updates } = req.body; // Array of { ticker, currentPrice }

        if (!Array.isArray(updates)) {
            return res.status(400).json({ error: 'Updates must be an array' });
        }

        // Ownership already validated by middleware
        // Update each position
        const updatePromises = updates.map(({ ticker, currentPrice }) =>
            prisma.position.updateMany({
                where: {
                    portfolioId: req.params.id,
                    ticker: ticker.toUpperCase()
                },
                data: { currentPrice }
            })
        );

        await Promise.all(updatePromises);

        res.json({ message: `${updates.length} positions updated` });
    } catch (error) {
        console.error('Bulk update error:', error);
        res.status(500).json({ error: 'Failed to update positions' });
    }
});

export default router;
