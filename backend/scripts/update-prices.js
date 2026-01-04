#!/usr/bin/env node

/**
 * Actualiza precios desde fuentes públicas
 * Usa Yahoo Finance, CoinGecko API (sin key), y otras fuentes
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔄 Actualizador de Precios - SV Portfolio');
console.log('==========================================\n');

// Fetch helper
function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json,text/html,*/*'
            }
        }, (res) => {
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

// Obtener precio de crypto desde CoinGecko (API pública sin key)
async function getCryptoPrice(symbol) {
    try {
        // Mapeo de símbolos a IDs de CoinGecko
        const coinMap = {
            'BTC-USD': 'bitcoin',
            'ETH-USD': 'ethereum',
            'BNB-USD': 'binancecoin',
            'XRP-USD': 'ripple',
            'ADA-USD': 'cardano',
            'SOL-USD': 'solana',
            'DOT-USD': 'polkadot',
            'DOGE-USD': 'dogecoin',
            'MATIC-USD': 'matic-network',
            'AVAX-USD': 'avalanche-2',
            'LINK-USD': 'chainlink',
            'UNI-USD': 'uniswap'
        };
        
        const coinId = coinMap[symbol];
        if (!coinId) return null;
        
        // API pública de CoinGecko (sin key, rate limit: 10-30 req/min)
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
        const data = await fetch(url);
        const json = JSON.parse(data);
        
        if (json[coinId] && json[coinId].usd) {
            return json[coinId].usd;
        }
        
        return null;
    } catch (error) {
        console.error(`  ✗ ${symbol}: ${error.message}`);
        return null;
    }
}

// Obtener datos de Yahoo Finance (scraping alternativo)
async function getYahooQuote(symbol) {
    try {
        // Yahoo Finance API v8 (pública, sin autenticación)
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
        const data = await fetch(url);
        const json = JSON.parse(data);
        
        if (json.chart && json.chart.result && json.chart.result[0]) {
            const result = json.chart.result[0];
            const meta = result.meta;
            const quote = result.indicators.quote[0];
            
            return {
                price: meta.regularMarketPrice || meta.previousClose,
                open: quote.open[quote.open.length - 1],
                high: quote.high[quote.high.length - 1],
                low: quote.low[quote.low.length - 1],
                volume: quote.volume[quote.volume.length - 1]
            };
        }
        
        return null;
    } catch (error) {
        console.error(`  ✗ ${symbol}: ${error.message}`);
        return null;
    }
}

// Actualizar archivo de datos
async function updateMarketData() {
    const dataFile = path.join(__dirname, '..', 'market-data.json');
    
    if (!fs.existsSync(dataFile)) {
        console.error('❌ market-data.json no existe. Ejecuta primero generate-market-data.js');
        process.exit(1);
    }
    
    const currentData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const symbols = Object.keys(currentData.data);
    
    console.log(`📊 Actualizando ${symbols.length} símbolos...\n`);
    
    let updated = 0;
    let failed = 0;
    
    for (const symbol of symbols) {
        const item = currentData.data[symbol];
        
        try {
            let newPrice = null;
            
            // Diferentes estrategias según tipo
            if (item.isCrypto) {
                newPrice = await getCryptoPrice(symbol);
                await new Promise(r => setTimeout(r, 2100)); // CoinGecko: ~30/min
            } else {
                const quote = await getYahooQuote(symbol);
                if (quote) newPrice = quote.price;
                await new Promise(r => setTimeout(r, 500)); // Yahoo: más generoso
            }
            
            if (newPrice && newPrice > 0) {
                currentData.data[symbol].price = newPrice;
                currentData.data[symbol].lastUpdate = new Date().toISOString();
                updated++;
                console.log(`  ✓ ${symbol.padEnd(12)} $${newPrice.toFixed(newPrice < 10 ? 4 : 2).padStart(10)} ${item.isCrypto ? '(CoinGecko)' : '(Yahoo)'}`);
            } else {
                failed++;
                console.log(`  ⚠ ${symbol.padEnd(12)} Sin datos (usando cache)`);
            }
            
        } catch (error) {
            failed++;
            console.error(`  ✗ ${symbol}: ${error.message}`);
        }
    }
    
    // Actualizar metadata
    currentData.metadata.generated = new Date().toISOString();
    currentData.metadata.lastPriceUpdate = new Date().toISOString();
    currentData.metadata.updatedSymbols = updated;
    
    // Guardar
    fs.writeFileSync(dataFile, JSON.stringify(currentData, null, 2));
    
    // Regenerar archivo JS
    const jsContent = `// Auto-generated market data - ${new Date().toISOString()}
// Updated: ${updated}/${symbols.length} symbols

export const MARKET_DATA = ${JSON.stringify(currentData.data, null, 2)};

export const METADATA = ${JSON.stringify(currentData.metadata, null, 2)};
`;
    
    const jsPath = path.join(__dirname, '../../assets/js/market-data.js');
    fs.writeFileSync(jsPath, jsContent);
    
    console.log(`\n📊 Resultados:`);
    console.log(`   ✅ Actualizados: ${updated}`);
    console.log(`   ⚠️  Sin datos: ${failed}`);
    console.log(`   📈 Tasa éxito: ${((updated/symbols.length)*100).toFixed(1)}%\n`);
    
    console.log('✅ Actualización completa');
    console.log(`   JSON: ${dataFile}`);
    console.log(`   JS: ${jsPath}\n`);
    
    console.log('💡 Uso en dashboard:');
    console.log('   Reemplaza stockRef con MARKET_DATA');
    console.log('   import { MARKET_DATA } from "./assets/js/market-data.js";\n');
}

updateMarketData().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
