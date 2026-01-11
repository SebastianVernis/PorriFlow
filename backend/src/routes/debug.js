/**
 * Debug endpoint to verify environment variables and API connectivity
 */
import express from 'express';
import https from 'https';

const router = express.Router();

// Debug endpoint - REMOVE IN PRODUCTION
router.get('/env-check', (req, res) => {
    const finnhubKey = process.env.FINNHUB_API_KEY;
    
    res.json({
        FINNHUB_API_KEY: {
            exists: !!finnhubKey,
            length: finnhubKey ? finnhubKey.length : 0,
            first10: finnhubKey ? finnhubKey.substring(0, 10) + '...' : 'NOT SET',
            last5: finnhubKey ? '...' + finnhubKey.substring(finnhubKey.length - 5) : 'NOT SET'
        },
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT
    });
});

// Test Finnhub connectivity
router.get('/test-finnhub', async (req, res) => {
    const finnhubKey = process.env.FINNHUB_API_KEY;
    
    if (!finnhubKey) {
        return res.status(500).json({
            error: 'FINNHUB_API_KEY not configured',
            details: 'Environment variable is missing'
        });
    }
    
    const testUrl = `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${finnhubKey}`;
    
    return new Promise((resolve, reject) => {
        https.get(testUrl, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                res.json({
                    status: response.statusCode,
                    statusText: response.statusCode === 200 ? 'OK' : 'ERROR',
                    headers: response.headers,
                    body: response.statusCode === 200 ? JSON.parse(data) : data,
                    keyUsed: finnhubKey.substring(0, 10) + '...' + finnhubKey.substring(finnhubKey.length - 5)
                });
            });
        }).on('error', (err) => {
            res.status(500).json({
                error: 'Request failed',
                message: err.message,
                keyUsed: finnhubKey.substring(0, 10) + '...'
            });
        });
    });
});

export default router;
