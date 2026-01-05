#!/usr/bin/env node

/**
 * Populate database with comprehensive symbol data
 */

import marketDataService from '../src/services/market-data-service.js';

async function main() {
    console.log('🚀 SV Portfolio - Symbol Database Population\n');
    console.log('==========================================\n');
    
    const allSymbols = marketDataService.getAllSymbols();
    console.log(`📊 Total symbols to process: ${allSymbols.length}\n`);
    
    // Download 1 year of historical data for all symbols
    const oneYearAgo = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60);
    const now = Math.floor(Date.now() / 1000);
    
    console.log(`📅 Date range: ${new Date(oneYearAgo * 1000).toISOString().split('T')[0]} to ${new Date(now * 1000).toISOString().split('T')[0]}\n`);
    
    // Process in batches of 20
    const batchSize = 20;
    const batches = [];
    
    for (let i = 0; i < allSymbols.length; i += batchSize) {
        batches.push(allSymbols.slice(i, i + batchSize));
    }
    
    console.log(`📦 Processing ${batches.length} batches of ${batchSize} symbols each\n`);
    
    let totalSuccess = 0;
    let totalFailed = 0;
    let totalDataPoints = 0;
    
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`\n📦 Batch ${i + 1}/${batches.length}:`);
        console.log(`   Symbols: ${batch.join(', ')}\n`);
        
        const result = await marketDataService.batchDownloadHistoricalData(batch, {
            period1: oneYearAgo,
            period2: now,
            interval: '1d'
        });
        
        totalSuccess += result.success;
        totalFailed += result.failed;
        totalDataPoints += result.totalDataPoints;
        
        // Wait between batches
        if (i < batches.length - 1) {
            console.log('\n   ⏳ Waiting 10 seconds before next batch...');
            await new Promise(r => setTimeout(r, 10000));
        }
    }
    
    console.log('\n\n🎉 Population Complete!');
    console.log('==========================================');
    console.log(`✅ Successful: ${totalSuccess} symbols`);
    console.log(`❌ Failed: ${totalFailed} symbols`);
    console.log(`📈 Total data points: ${totalDataPoints.toLocaleString()}`);
    console.log(`💾 Average data points per symbol: ${Math.round(totalDataPoints / totalSuccess)}`);
    
    process.exit(0);
}

main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
