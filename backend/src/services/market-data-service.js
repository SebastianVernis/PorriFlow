/**
 * SV Portfolio - Market Data Service
 * Enhanced symbol data fetching and historical data management
 */

import https from 'https';
import http from 'http';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to fetch URLs
function fetchURL(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json,text/html,*/*'
            },
            timeout: 15000
        };
        
        client.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
        }).on('error', reject);
    });
}

/**
 * Comprehensive symbol list (300+ symbols)
 */
export const SYMBOL_DATABASE = {
    // Top Tech Companies
    tech: [
        'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'META', 'NVDA', 'TSLA', 'AMD', 'INTC', 'CSCO',
        'ORCL', 'IBM', 'CRM', 'ADBE', 'AVGO', 'QCOM', 'TXN', 'NFLX', 'PYPL', 'SHOP',
        'SQ', 'SNAP', 'TWTR', 'UBER', 'LYFT', 'DOCU', 'ZM', 'TEAM', 'NOW', 'SNOW',
        'PLTR', 'RBLX', 'U', 'DDOG', 'CRWD', 'NET', 'MDB', 'OKTA', 'ZS', 'FTNT'
    ],
    
    // Healthcare & Biotech
    healthcare: [
        'JNJ', 'UNH', 'ABBV', 'PFE', 'TMO', 'ABT', 'MRK', 'LLY', 'BMY', 'AMGN',
        'GILD', 'CVS', 'CI', 'HUM', 'ISRG', 'REGN', 'VRTX', 'BIIB', 'ILMN', 'MDT',
        'DHR', 'SYK', 'BSX', 'EW', 'ALGN', 'ZBH', 'BAX', 'BDX', 'IDXX', 'A'
    ],
    
    // Finance & Banking
    finance: [
        'JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'BLK', 'SCHW', 'AXP', 'USB',
        'V', 'MA', 'PYPL', 'SQ', 'COIN', 'PNC', 'TFC', 'COF', 'BK', 'STT',
        'SPGI', 'MCO', 'AON', 'MMC', 'AJG', 'BRO', 'TROW', 'IVZ', 'BEN', 'AMG'
    ],
    
    // Consumer & Retail
    consumer: [
        'AMZN', 'WMT', 'HD', 'COST', 'TGT', 'LOW', 'NKE', 'SBUX', 'MCD', 'DIS',
        'PG', 'KO', 'PEP', 'PM', 'CL', 'EL', 'ULTA', 'LULU', 'ROST', 'TJX',
        'DG', 'DLTR', 'BBY', 'EBAY', 'ETSY', 'W', 'CHWY', 'PTON', 'NKE', 'FL'
    ],
    
    // Energy & Utilities
    energy: [
        'XOM', 'CVX', 'COP', 'SLB', 'EOG', 'MPC', 'PSX', 'VLO', 'OXY', 'HAL',
        'KMI', 'WMB', 'OKE', 'LNG', 'FANG', 'DVN', 'HES', 'MRO', 'APA', 'NOV',
        'NEE', 'DUK', 'SO', 'D', 'AEP', 'EXC', 'SRE', 'PEG', 'XEL', 'ED'
    ],
    
    // Industrial & Manufacturing
    industrial: [
        'BA', 'CAT', 'GE', 'MMM', 'HON', 'UPS', 'LMT', 'RTX', 'DE', 'EMR',
        'ITW', 'ETN', 'PH', 'ROK', 'CMI', 'FDX', 'NSC', 'UNP', 'CSX', 'DAL',
        'UAL', 'LUV', 'AAL', 'ALK', 'JBLU', 'SAVE', 'HA', 'SKYW', 'MESA', 'ALGT'
    ],
    
    // Real Estate
    realestate: [
        'AMT', 'PLD', 'CCI', 'EQIX', 'PSA', 'DLR', 'O', 'SPG', 'WELL', 'AVB',
        'EQR', 'VTR', 'ARE', 'MAA', 'ESS', 'UDR', 'CPT', 'KIM', 'REG', 'FRT'
    ],
    
    // Materials & Chemicals
    materials: [
        'LIN', 'APD', 'ECL', 'SHW', 'FCX', 'NEM', 'DD', 'DOW', 'NUE', 'VMC',
        'MLM', 'PPG', 'RPM', 'FMC', 'EMN', 'CF', 'MOS', 'ALB', 'CE', 'IP'
    ],
    
    // Telecommunications
    telecom: [
        'T', 'VZ', 'TMUS', 'CHTR', 'CMCSA', 'VOD', 'AMX', 'TEF', 'TU', 'CHL'
    ],
    
    // Crypto (50+ major cryptocurrencies)
    crypto: [
        // Top 10 by Market Cap
        'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'SOL-USD',
        'DOT-USD', 'DOGE-USD', 'MATIC-USD', 'AVAX-USD',
        
        // DeFi & Smart Contracts
        'LINK-USD', 'UNI-USD', 'AAVE-USD', 'MKR-USD', 'COMP-USD', 'SUSHI-USD',
        'CRV-USD', 'SNX-USD', 'YFI-USD', '1INCH-USD', 'BAL-USD',
        
        // Layer 1 & Layer 2
        'ATOM-USD', 'NEAR-USD', 'FTM-USD', 'ALGO-USD', 'EGLD-USD', 'HBAR-USD',
        'ICP-USD', 'VET-USD', 'FIL-USD', 'THETA-USD', 'EOS-USD', 'XTZ-USD',
        
        // Metaverse & Gaming
        'SAND-USD', 'MANA-USD', 'AXS-USD', 'ENJ-USD', 'GALA-USD', 'IMX-USD',
        'APE-USD', 'GMT-USD',
        
        // Stablecoins & Wrapped Assets
        'USDT-USD', 'USDC-USD', 'DAI-USD', 'BUSD-USD', 'WBTC-USD',
        
        // Other Major Coins
        'LTC-USD', 'BCH-USD', 'XLM-USD', 'TRX-USD', 'ETC-USD', 'XMR-USD',
        'ZEC-USD', 'DASH-USD', 'NEO-USD', 'WAVES-USD', 'QTUM-USD',
        
        // Emerging & Popular
        'OP-USD', 'ARB-USD', 'LDO-USD', 'RPL-USD', 'RNDR-USD', 'GRT-USD',
        'CHZ-USD', 'FLOW-USD', 'KAVA-USD', 'CELO-USD'
    ],
    
    // Major Indices
    indices: [
        '^GSPC', '^DJI', '^IXIC', '^NYA', '^RUT', '^VIX',
        '^FTSE', '^GDAXI', '^N225', '^HSI'
    ],
    
    // Popular ETFs
    etfs: [
        'SPY', 'QQQ', 'DIA', 'IWM', 'VTI', 'VOO', 'VEA', 'VWO',
        'AGG', 'BND', 'GLD', 'SLV', 'USO', 'TLT', 'ARKK', 'SQQQ',
        'TQQQ', 'UPRO', 'SPXL', 'TECL', 'SOXL', 'FAS', 'TNA', 'LABU'
    ],
    
    // Commodities Futures
    commodities: [
        'GC=F', 'SI=F', 'CL=F', 'NG=F', 'HG=F',
        'ZC=F', 'ZW=F', 'ZS=F', 'KC=F', 'SB=F'
    ]
};

/**
 * Get all symbols as flat array
 */
export function getAllSymbols() {
    const symbols = [];
    Object.values(SYMBOL_DATABASE).forEach(category => {
        if (Array.isArray(category)) {
            symbols.push(...category);
        } else {
            Object.values(category).forEach(subcategory => {
                symbols.push(...subcategory);
            });
        }
    });
    return [...new Set(symbols)]; // Deduplicate
}

/**
 * Fetch historical data from Yahoo Finance
 */
export async function fetchHistoricalData(symbol, options = {}) {
    const {
        period1 = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60), // 1 year ago
        period2 = Math.floor(Date.now() / 1000),
        interval = '1d' // 1d, 1wk, 1mo
    } = options;
    
    try {
        const url = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${period1}&period2=${period2}&interval=${interval}&events=history`;
        
        const csv = await fetchURL(url);
        const lines = csv.trim().split('\n');
        
        if (lines.length < 2) {
            return [];
        }
        
        // Parse CSV
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const [date, open, high, low, close, adjClose, volume] = lines[i].split(',');
            
            if (date && open && high && low && close) {
                data.push({
                    date: new Date(date),
                    open: parseFloat(open),
                    high: parseFloat(high),
                    low: parseFloat(low),
                    close: parseFloat(close),
                    volume: volume ? parseFloat(volume) : null
                });
            }
        }
        
        return data;
    } catch (error) {
        console.error(`Error fetching historical data for ${symbol}:`, error.message);
        return [];
    }
}

/**
 * Save historical data to database
 */
export async function saveHistoricalData(symbol, data) {
    if (!Array.isArray(data) || data.length === 0) {
        return { saved: 0, skipped: 0 };
    }
    
    let saved = 0;
    let skipped = 0;
    
    for (const point of data) {
        try {
            await prisma.historicalData.upsert({
                where: {
                    ticker_date: {
                        ticker: symbol,
                        date: point.date
                    }
                },
                create: {
                    ticker: symbol,
                    date: point.date,
                    open: point.open,
                    high: point.high,
                    low: point.low,
                    close: point.close,
                    volume: point.volume
                },
                update: {
                    open: point.open,
                    high: point.high,
                    low: point.low,
                    close: point.close,
                    volume: point.volume
                }
            });
            saved++;
        } catch (error) {
            skipped++;
        }
    }
    
    return { saved, skipped };
}

/**
 * Batch download historical data for multiple symbols
 */
export async function batchDownloadHistoricalData(symbols, options = {}) {
    console.log(`\n📥 Downloading historical data for ${symbols.length} symbols...`);
    
    const results = {
        success: 0,
        failed: 0,
        totalDataPoints: 0
    };
    
    for (const symbol of symbols) {
        try {
            console.log(`   Fetching ${symbol}...`);
            const data = await fetchHistoricalData(symbol, options);
            
            if (data.length > 0) {
                const { saved } = await saveHistoricalData(symbol, data);
                results.success++;
                results.totalDataPoints += saved;
                console.log(`   ✓ ${symbol}: ${saved} data points saved`);
            } else {
                results.failed++;
                console.log(`   ✗ ${symbol}: No data available`);
            }
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            results.failed++;
            console.error(`   ✗ ${symbol}: ${error.message}`);
        }
    }
    
    console.log(`\n📊 Historical data download complete:`);
    console.log(`   ✅ Success: ${results.success}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log(`   📈 Total data points: ${results.totalDataPoints}`);
    
    return results;
}

/**
 * Get historical data from database
 */
export async function getHistoricalData(symbol, options = {}) {
    const {
        startDate,
        endDate,
        limit = 365
    } = options;
    
    const where = { ticker: symbol };
    
    if (startDate) {
        where.date = { ...where.date, gte: new Date(startDate) };
    }
    
    if (endDate) {
        where.date = { ...where.date, lte: new Date(endDate) };
    }
    
    const data = await prisma.historicalData.findMany({
        where,
        orderBy: { date: 'desc' },
        take: limit
    });
    
    return data;
}

/**
 * Update price cache with latest data
 */
export async function updatePriceCache(symbol) {
    try {
        // Get latest historical data
        const recent = await fetchHistoricalData(symbol, {
            period1: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60), // Last 7 days
            period2: Math.floor(Date.now() / 1000)
        });
        
        if (recent.length === 0) {
            return null;
        }
        
        const latest = recent[recent.length - 1];
        
        // Update cache
        await prisma.priceCache.upsert({
            where: { ticker: symbol },
            create: {
                ticker: symbol,
                price: latest.close,
                bid: latest.low,
                ask: latest.high,
                source: 'yahoo',
                timestamp: latest.date
            },
            update: {
                price: latest.close,
                bid: latest.low,
                ask: latest.high,
                timestamp: latest.date
            }
        });
        
        return latest;
    } catch (error) {
        console.error(`Error updating price cache for ${symbol}:`, error.message);
        return null;
    }
}

export default {
    getAllSymbols,
    fetchHistoricalData,
    saveHistoricalData,
    batchDownloadHistoricalData,
    getHistoricalData,
    updatePriceCache
};
