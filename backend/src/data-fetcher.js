/**
 * SV Portfolio - Data Fetcher
 * Obtiene datos de mercado de fuentes públicas sin consumir APIs
 */

import https from 'https';
import http from 'http';

// Fetch wrapper para URLs
function fetchURL(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        
        client.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Parsear datos de Yahoo Finance (CSV público)
async function getYahooFinanceData(symbol) {
    try {
        // Yahoo Finance tiene endpoints públicos en formato CSV
        const period1 = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60); // 1 año atrás
        const period2 = Math.floor(Date.now() / 1000);
        
        const url = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${period1}&period2=${period2}&interval=1d&events=history`;
        
        const csv = await fetchURL(url);
        const lines = csv.trim().split('\n');
        
        if (lines.length < 2) return null;
        
        // Última línea tiene datos más recientes
        const lastLine = lines[lines.length - 1];
        const [date, open, high, low, close, adjClose, volume] = lastLine.split(',');
        
        return {
            symbol,
            price: parseFloat(close),
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            volume: parseFloat(volume),
            date
        };
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        return null;
    }
}

// Calcular Beta desde datos históricos
function calculateBeta(stockReturns, marketReturns) {
    if (stockReturns.length !== marketReturns.length || stockReturns.length < 2) {
        return 1.0; // Default
    }
    
    const n = stockReturns.length;
    const meanStock = stockReturns.reduce((a, b) => a + b, 0) / n;
    const meanMarket = marketReturns.reduce((a, b) => a + b, 0) / n;
    
    let covariance = 0;
    let variance = 0;
    
    for (let i = 0; i < n; i++) {
        covariance += (stockReturns[i] - meanStock) * (marketReturns[i] - meanMarket);
        variance += Math.pow(marketReturns[i] - meanMarket, 2);
    }
    
    return variance === 0 ? 1.0 : covariance / variance;
}

// Lista completa de símbolos a obtener
export const SYMBOLS = {
    // === ACCIONES USA - TECH ===
    stocks: {
        tech: [
            'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'META', 'NVDA', 'TSLA', 'AMD', 'INTC', 'CSCO',
            'ORCL', 'IBM', 'CRM', 'ADBE', 'AVGO', 'QCOM', 'TXN', 'NFLX', 'PYPL', 'SHOP'
        ],
        healthcare: [
            'JNJ', 'UNH', 'ABBV', 'PFE', 'TMO', 'ABT', 'MRK', 'LLY', 'BMY', 'AMGN',
            'GILD', 'CVS', 'CI', 'HUM', 'ISRG'
        ],
        finance: [
            'JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'BLK', 'SCHW', 'AXP', 'USB',
            'V', 'MA', 'PYPL', 'SQ', 'COIN'
        ],
        consumer: [
            'AMZN', 'WMT', 'HD', 'COST', 'TGT', 'LOW', 'NKE', 'SBUX', 'MCD', 'DIS',
            'PG', 'KO', 'PEP', 'PM', 'CL'
        ],
        energy: [
            'XOM', 'CVX', 'COP', 'SLB', 'EOG', 'MPC', 'PSX', 'VLO', 'OXY', 'HAL'
        ],
        industrial: [
            'BA', 'CAT', 'GE', 'MMM', 'HON', 'UPS', 'LMT', 'RTX', 'DE', 'EMR'
        ],
        utilities: [
            'NEE', 'DUK', 'SO', 'D', 'AEP', 'EXC', 'SRE', 'PEG', 'XEL', 'ED'
        ],
        realestate: [
            'AMT', 'PLD', 'CCI', 'EQIX', 'PSA', 'DLR', 'O', 'SPG', 'WELL', 'AVB'
        ],
        materials: [
            'LIN', 'APD', 'ECL', 'SHW', 'FCX', 'NEM', 'DD', 'DOW', 'NUE', 'VMC'
        ],
        telecom: [
            'T', 'VZ', 'TMUS', 'CHTR', 'CMCSA', 'VOD'
        ]
    },
    
    // === ÍNDICES BURSÁTILES ===
    indices: [
        '^GSPC',   // S&P 500
        '^DJI',    // Dow Jones
        '^IXIC',   // NASDAQ Composite
        '^NYA',    // NYSE Composite
        '^RUT',    // Russell 2000
        '^VIX',    // Volatility Index
        '^FTSE',   // FTSE 100 (UK)
        '^GDAXI',  // DAX (Germany)
        '^N225',   // Nikkei 225 (Japan)
        '^HSI'     // Hang Seng (Hong Kong)
    ],
    
    // === CRIPTOMONEDAS ===
    crypto: [
        'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD',
        'SOL-USD', 'DOT-USD', 'DOGE-USD', 'MATIC-USD', 'AVAX-USD',
        'LINK-USD', 'UNI-USD', 'ATOM-USD', 'LTC-USD', 'BCH-USD',
        'XLM-USD', 'ALGO-USD', 'FTM-USD', 'SAND-USD', 'MANA-USD'
    ],
    
    // === ETFs ===
    etfs: [
        'SPY',   // S&P 500 ETF
        'QQQ',   // NASDAQ-100 ETF
        'DIA',   // Dow Jones ETF
        'IWM',   // Russell 2000 ETF
        'VTI',   // Total Stock Market
        'VOO',   // Vanguard S&P 500
        'VEA',   // Developed Markets
        'VWO',   // Emerging Markets
        'AGG',   // Bond ETF
        'GLD',   // Gold ETF
        'SLV',   // Silver ETF
        'USO',   // Oil ETF
        'TLT',   // 20Y Treasury
        'ARKK',  // ARK Innovation
        'SQQQ'   // NASDAQ Bear 3X
    ],
    
    // === COMMODITIES (Futuros) ===
    commodities: [
        'GC=F',  // Gold Futures
        'SI=F',  // Silver Futures
        'CL=F',  // Crude Oil WTI Futures
        'NG=F',  // Natural Gas Futures
        'HG=F',  // Copper Futures
        'ZC=F',  // Corn Futures
        'ZW=F',  // Wheat Futures
        'ZS=F',  // Soybean Futures
        'KC=F',  // Coffee Futures
        'SB=F'   // Sugar Futures
    ],
    
    // === FOREX ===
    forex: [
        'EURUSD=X', // Euro/USD
        'GBPUSD=X', // Pound/USD
        'JPYUSD=X', // Yen/USD
        'AUDUSD=X', // Aussie/USD
        'CADUSD=X', // Canadian/USD
        'CHFUSD=X', // Swiss/USD
        'NZDUSD=X', // NZ/USD
        'MXNUSD=X'  // Peso/USD
    ]
};

// Obtener todos los símbolos de todas las categorías
export function getAllSymbols() {
    const all = [];
    
    // Acciones por sector
    Object.values(SYMBOLS.stocks).forEach(sector => all.push(...sector));
    
    // Resto de categorías
    all.push(...SYMBOLS.indices);
    all.push(...SYMBOLS.crypto);
    all.push(...SYMBOLS.etfs);
    all.push(...SYMBOLS.commodities);
    all.push(...SYMBOLS.forex);
    
    return [...new Set(all)]; // Remove duplicates
}

// Categorizar símbolo
export function categorizeSymbol(symbol) {
    if (symbol.endsWith('-USD')) return 'Crypto';
    if (symbol.startsWith('^')) return 'Index';
    if (symbol.endsWith('=F')) return 'Futures';
    if (symbol.endsWith('=X')) return 'Forex';
    
    // Buscar en stocks
    for (const [sector, symbols] of Object.entries(SYMBOLS.stocks)) {
        if (symbols.includes(symbol)) {
            return sector.charAt(0).toUpperCase() + sector.slice(1);
        }
    }
    
    // Buscar en ETFs
    if (SYMBOLS.etfs.includes(symbol)) return 'ETF';
    
    return 'Other';
}

// Estimar Beta por categoría (cuando no hay datos históricos)
export function estimateBeta(symbol, category) {
    const betaRanges = {
        'Crypto': [2.5, 3.8],
        'Index': [1.0, 1.0],
        'Futures': [1.5, 2.5],
        'Forex': [0.3, 0.8],
        'ETF': [0.9, 1.1],
        'Tech': [1.2, 2.0],
        'Healthcare': [0.5, 0.8],
        'Finance': [1.0, 1.3],
        'Consumer': [0.5, 0.9],
        'Energy': [1.0, 1.5],
        'Industrial': [1.0, 1.3],
        'Utilities': [0.3, 0.6],
        'Realestate': [0.7, 1.0],
        'Materials': [0.8, 1.2],
        'Telecom': [0.4, 0.7],
        'Other': [1.0, 1.0]
    };
    
    const range = betaRanges[category] || [1.0, 1.0];
    return (range[0] + range[1]) / 2;
}

// Main function para obtener todos los datos
export async function fetchAllMarketData() {
    console.log('🚀 Fetching market data from public sources...');
    
    const allSymbols = getAllSymbols();
    const results = [];
    
    console.log(`📊 Total símbolos: ${allSymbols.length}`);
    
    // Procesar en lotes de 10 (para no saturar)
    const batchSize = 10;
    
    for (let i = 0; i < allSymbols.length; i += batchSize) {
        const batch = allSymbols.slice(i, i + batchSize);
        console.log(`\n📦 Lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(allSymbols.length/batchSize)}: ${batch.join(', ')}`);
        
        const promises = batch.map(symbol => getYahooFinanceData(symbol));
        const batchResults = await Promise.all(promises);
        
        batchResults.forEach((data, idx) => {
            if (data) {
                const symbol = batch[idx];
                const category = categorizeSymbol(symbol);
                const beta = estimateBeta(symbol, category);
                
                results.push({
                    symbol,
                    name: symbol,
                    price: data.price,
                    category,
                    beta,
                    sector: category,
                    yield: 0, // Calcular después si es necesario
                    dgr: 0,
                    lastUpdate: data.date
                });
                
                console.log(`  ✓ ${symbol}: $${data.price.toFixed(2)} (${category})`);
            } else {
                console.log(`  ✗ ${batch[idx]}: Sin datos`);
            }
        });
        
        // Delay entre lotes
        if (i + batchSize < allSymbols.length) {
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    
    console.log(`\n✅ Completado: ${results.length}/${allSymbols.length} símbolos obtenidos`);
    
    return results;
}

// Generar stockRef actualizado
export function generateStockRef(marketData) {
    const stockRef = {};
    
    marketData.forEach(item => {
        stockRef[item.symbol] = {
            beta: item.beta,
            dgr: item.dgr || 0,
            yield: item.yield || 0,
            sector: item.sector,
            name: item.name || item.symbol,
            price: item.price,
            lastUpdate: item.lastUpdate,
            ...(item.category === 'Crypto' && { isCrypto: true }),
            ...(item.category === 'Index' && { isIndex: true }),
            ...(item.category === 'Futures' && { isFutures: true }),
            ...(item.category === 'Forex' && { isForex: true }),
            ...(item.category === 'ETF' && { isETF: true })
        };
    });
    
    return stockRef;
}

// Export para uso en scripts
if (import.meta.url === `file://${process.argv[1]}`) {
    (async () => {
        const data = await fetchAllMarketData();
        const stockRef = generateStockRef(data);
        
        console.log('\n📊 Generando archivo de datos...');
        
        const output = {
            generated: new Date().toISOString(),
            totalSymbols: data.length,
            categories: {
                stocks: data.filter(d => !['Crypto', 'Index', 'Futures', 'Forex', 'ETF'].includes(d.category)).length,
                crypto: data.filter(d => d.category === 'Crypto').length,
                indices: data.filter(d => d.category === 'Index').length,
                etfs: data.filter(d => d.category === 'ETF').length,
                futures: data.filter(d => d.category === 'Futures').length,
                forex: data.filter(d => d.category === 'Forex').length
            },
            data: stockRef
        };
        
        // Guardar a archivo
        const fs = await import('fs');
        fs.writeFileSync(
            './market-data.json',
            JSON.stringify(output, null, 2)
        );
        
        console.log('✅ Archivo generado: market-data.json');
        console.log(`\n📊 Resumen:`);
        console.log(`   Acciones: ${output.categories.stocks}`);
        console.log(`   Crypto: ${output.categories.crypto}`);
        console.log(`   Índices: ${output.categories.indices}`);
        console.log(`   ETFs: ${output.categories.etfs}`);
        console.log(`   Futuros: ${output.categories.futures}`);
        console.log(`   Forex: ${output.categories.forex}`);
        console.log(`   Total: ${output.totalSymbols}`);
        
        process.exit(0);
    })();
}
