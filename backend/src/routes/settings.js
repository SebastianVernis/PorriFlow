import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get user settings
router.get('/', async (req, res) => {
    try {
        const settings = await prisma.userSettings.findUnique({
            where: { userId: req.userId }
        });

        if (!settings) {
            return res.status(404).json({ error: 'Settings not found' });
        }

        // Don't expose API keys in response (security)
        const { marketstackKey, alphaVantageKey, blackboxKey, marketauxKey, ...safeSettings } = settings;
        
        res.json({ 
            settings: {
                ...safeSettings,
                hasMarketstackKey: !!marketstackKey,
                hasAlphaVantageKey: !!alphaVantageKey,
                hasBlackboxKey: !!blackboxKey,
                hasMarketauxKey: !!marketauxKey
            }
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Update user settings
router.put('/', async (req, res) => {
    try {
        const { riskFreeRate, marketVolatility, annualTarget, refreshInterval, currency } = req.body;

        const settings = await prisma.userSettings.update({
            where: { userId: req.userId },
            data: {
                ...(riskFreeRate !== undefined && { riskFreeRate }),
                ...(marketVolatility !== undefined && { marketVolatility }),
                ...(annualTarget !== undefined && { annualTarget }),
                ...(refreshInterval !== undefined && { refreshInterval }),
                ...(currency && { currency })
            }
        });

        res.json({ message: 'Settings updated', settings });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Update API keys
router.put('/api-keys', async (req, res) => {
    try {
        const { marketstackKey, alphaVantageKey, blackboxKey, marketauxKey } = req.body;

        const settings = await prisma.userSettings.update({
            where: { userId: req.userId },
            data: {
                ...(marketstackKey !== undefined && { marketstackKey }),
                ...(alphaVantageKey !== undefined && { alphaVantageKey }),
                ...(blackboxKey !== undefined && { blackboxKey }),
                ...(marketauxKey !== undefined && { marketauxKey })
            }
        });

        res.json({ message: 'API keys updated' });
    } catch (error) {
        console.error('Update API keys error:', error);
        res.status(500).json({ error: 'Failed to update API keys' });
    }
});

export default router;
