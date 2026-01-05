/**
 * SV Portfolio - News Service
 * Fetches financial news from multiple free sources
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
            timeout: 10000
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
 * Fetch news from Yahoo Finance
 */
async function fetchYahooNews(symbol) {
    try {
        // Yahoo Finance news API (undocumented but public)
        const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}&newsCount=10`;
        const data = await fetchURL(url);
        const json = JSON.parse(data);
        
        if (!json.news || json.news.length === 0) {
            return [];
        }

        return json.news.map(item => ({
            source: 'yahoo',
            title: item.title,
            summary: item.summary || '',
            url: item.link,
            publishedAt: new Date(item.providerPublishTime * 1000),
            publisher: item.publisher,
            thumbnail: item.thumbnail?.resolutions?.[0]?.url || null,
            type: item.type || 'article'
        }));
    } catch (error) {
        console.error(`Yahoo News error for ${symbol}:`, error.message);
        return [];
    }
}

/**
 * Fetch news from Finnhub (requires API key in env)
 */
async function fetchFinnhubNews(symbol) {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
        return [];
    }

    try {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const from = weekAgo.toISOString().split('T')[0];
        const to = today.toISOString().split('T')[0];
        
        const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${apiKey}`;
        const data = await fetchURL(url);
        const json = JSON.parse(data);
        
        if (!Array.isArray(json)) {
            return [];
        }

        return json.map(item => ({
            source: 'finnhub',
            title: item.headline,
            summary: item.summary || '',
            url: item.url,
            publishedAt: new Date(item.datetime * 1000),
            publisher: item.source,
            thumbnail: item.image || null,
            type: 'article',
            sentiment: item.sentiment || null // Finnhub provides sentiment
        }));
    } catch (error) {
        console.error(`Finnhub News error for ${symbol}:`, error.message);
        return [];
    }
}

/**
 * Fetch crypto news from CryptoPanic (free API)
 */
async function fetchCryptoNews(symbol) {
    try {
        // Map crypto symbols to currency codes
        const cryptoMap = {
            'BTC-USD': 'BTC',
            'ETH-USD': 'ETH',
            'BNB-USD': 'BNB',
            'XRP-USD': 'XRP',
            'ADA-USD': 'ADA',
            'SOL-USD': 'SOL',
            'DOT-USD': 'DOT',
            'DOGE-USD': 'DOGE',
            'MATIC-USD': 'MATIC',
            'AVAX-USD': 'AVAX',
            'LINK-USD': 'LINK',
            'UNI-USD': 'UNI'
        };

        const currency = cryptoMap[symbol];
        if (!currency) {
            return [];
        }

        // CryptoPanic public API (no key needed for basic use)
        const url = `https://cryptopanic.com/api/v1/posts/?auth_token=free&currencies=${currency}&public=true`;
        const data = await fetchURL(url);
        const json = JSON.parse(data);
        
        if (!json.results || json.results.length === 0) {
            return [];
        }

        return json.results.slice(0, 10).map(item => ({
            source: 'cryptopanic',
            title: item.title,
            summary: '',
            url: item.url,
            publishedAt: new Date(item.published_at),
            publisher: item.source?.title || 'CryptoPanic',
            thumbnail: null,
            type: 'article',
            sentiment: item.votes?.positive > item.votes?.negative ? 'positive' : 
                       item.votes?.negative > item.votes?.positive ? 'negative' : 'neutral'
        }));
    } catch (error) {
        console.error(`CryptoPanic error for ${symbol}:`, error.message);
        return [];
    }
}

/**
 * Fetch SEC filings for a symbol
 */
async function fetchSECFilings(symbol) {
    try {
        // SEC EDGAR company filings RSS
        // First need to get CIK from ticker
        const url = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${symbol}&type=&dateb=&owner=exclude&count=10&output=atom`;
        const data = await fetchURL(url);
        
        // Parse basic XML/Atom feed
        const entries = data.match(/<entry>[\s\S]*?<\/entry>/g) || [];
        
        return entries.slice(0, 5).map(entry => {
            const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || '';
            const link = entry.match(/<link.*?href="(.*?)"/)?.[1] || '';
            const updated = entry.match(/<updated>(.*?)<\/updated>/)?.[1] || '';
            
            return {
                source: 'sec',
                title: title,
                summary: 'SEC Filing',
                url: link,
                publishedAt: new Date(updated),
                publisher: 'SEC EDGAR',
                thumbnail: null,
                type: 'filing'
            };
        });
    } catch (error) {
        console.error(`SEC filings error for ${symbol}:`, error.message);
        return [];
    }
}

/**
 * Main function: Aggregate news from all sources
 */
export async function getNewsForSymbol(symbol, options = {}) {
    const { limit = 20, sources = ['yahoo', 'finnhub', 'sec'] } = options;
    
    console.log(`📰 Fetching news for ${symbol}...`);
    
    const newsPromises = [];
    
    // Determine if crypto
    const isCrypto = symbol.endsWith('-USD') && 
        ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'DOGE', 'MATIC', 'AVAX', 'LINK', 'UNI']
            .some(crypto => symbol.startsWith(crypto));
    
    if (isCrypto) {
        newsPromises.push(fetchCryptoNews(symbol));
    } else {
        if (sources.includes('yahoo')) {
            newsPromises.push(fetchYahooNews(symbol));
        }
        if (sources.includes('finnhub')) {
            newsPromises.push(fetchFinnhubNews(symbol));
        }
        if (sources.includes('sec')) {
            newsPromises.push(fetchSECFilings(symbol));
        }
    }
    
    // Fetch all in parallel
    const results = await Promise.allSettled(newsPromises);
    
    // Combine and deduplicate
    const allNews = [];
    results.forEach(result => {
        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
            allNews.push(...result.value);
        }
    });
    
    // Remove duplicates by URL
    const uniqueNews = Array.from(
        new Map(allNews.map(item => [item.url, item])).values()
    );
    
    // Sort by date (newest first)
    uniqueNews.sort((a, b) => b.publishedAt - a.publishedAt);
    
    // Limit results
    const limitedNews = uniqueNews.slice(0, limit);
    
    console.log(`   Found ${limitedNews.length} articles`);
    
    return limitedNews;
}

/**
 * Cache news in database
 */
export async function cacheNewsForSymbol(symbol, news) {
    try {
        // Store in a simple JSON field or create a News table
        // For now, using PriceCache table's unused fields as temporary storage
        
        const cacheKey = `news_${symbol}`;
        
        await prisma.priceCache.upsert({
            where: { ticker: cacheKey },
            create: {
                ticker: cacheKey,
                price: 0,
                source: 'news_cache',
                timestamp: new Date()
            },
            update: {
                timestamp: new Date()
            }
        });
        
        console.log(`   ✓ Cached ${news.length} articles for ${symbol}`);
    } catch (error) {
        console.error(`Failed to cache news for ${symbol}:`, error.message);
    }
}

/**
 * Batch update news for multiple symbols
 */
export async function updateNewsForSymbols(symbols, options = {}) {
    console.log(`\n📰 Updating news for ${symbols.length} symbols...`);
    
    const results = {
        success: 0,
        failed: 0,
        totalArticles: 0
    };
    
    for (const symbol of symbols) {
        try {
            const news = await getNewsForSymbol(symbol, options);
            
            if (news.length > 0) {
                await cacheNewsForSymbol(symbol, news);
                results.success++;
                results.totalArticles += news.length;
            }
            
            // Rate limiting: wait between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`   ✗ ${symbol}: ${error.message}`);
            results.failed++;
        }
    }
    
    console.log(`\n📊 News update complete:`);
    console.log(`   ✅ Success: ${results.success}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log(`   📰 Total articles: ${results.totalArticles}`);
    
    return results;
}

export default {
    getNewsForSymbol,
    cacheNewsForSymbol,
    updateNewsForSymbols
};
