/**
 * SV Portfolio - News Module
 * Frontend integration for financial news
 */

import { apiRequest } from './auth.js';

/**
 * Fetch news for a specific symbol
 */
export async function getSymbolNews(symbol, options = {}) {
    const { limit = 20, sources = 'yahoo,finnhub,sec' } = options;
    
    try {
        const response = await apiRequest(
            `/api/news/${symbol}?limit=${limit}&sources=${sources}`
        );
        
        return response?.news || [];
    } catch (error) {
        console.error(`Error fetching news for ${symbol}:`, error);
        return [];
    }
}

/**
 * Fetch news for multiple symbols
 */
export async function getBatchNews(symbols, limit = 10) {
    try {
        const response = await apiRequest('/api/news/batch', {
            method: 'POST',
            body: JSON.stringify({ symbols, limit })
        });
        
        return response?.results || {};
    } catch (error) {
        console.error('Error fetching batch news:', error);
        return {};
    }
}

/**
 * Fetch news for entire portfolio
 */
export async function getPortfolioNews(portfolioId, limit = 5) {
    try {
        const response = await apiRequest(
            `/api/news/portfolio/${portfolioId}?limit=${limit}`
        );
        
        return response?.news || [];
    } catch (error) {
        console.error('Error fetching portfolio news:', error);
        return [];
    }
}

/**
 * Render news article card
 */
export function renderNewsCard(article) {
    const publishedDate = new Date(article.publishedAt);
    const timeAgo = getTimeAgo(publishedDate);
    
    const sentimentBadge = article.sentiment ? 
        `<span class="px-2 py-1 rounded-full text-xs font-bold ${getSentimentClass(article.sentiment)}">
            ${article.sentiment === 'positive' ? '📈' : article.sentiment === 'negative' ? '📉' : '➖'} 
            ${article.sentiment}
        </span>` : '';
    
    const thumbnail = article.thumbnail ? 
        `<img src="${article.thumbnail}" alt="${article.title}" class="w-full h-32 object-cover rounded-t-xl">` : '';
    
    return `
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 overflow-hidden">
            ${thumbnail}
            <div class="p-4">
                <div class="flex items-start justify-between gap-2 mb-2">
                    <h3 class="font-bold text-sm text-slate-800 line-clamp-2 flex-1">
                        ${article.title}
                    </h3>
                    ${sentimentBadge}
                </div>
                
                ${article.summary ? `
                    <p class="text-xs text-slate-600 mb-3 line-clamp-2">${article.summary}</p>
                ` : ''}
                
                <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2 text-slate-500">
                        <span class="font-semibold">${article.publisher}</span>
                        <span>•</span>
                        <span>${timeAgo}</span>
                    </div>
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer" 
                       class="text-indigo-600 hover:text-indigo-700 font-bold">
                        Leer →
                    </a>
                </div>
                
                <div class="mt-2 pt-2 border-t border-slate-100">
                    <span class="text-[10px] text-slate-400 uppercase font-bold">
                        ${getSourceIcon(article.source)} ${article.source}
                    </span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render news section for a symbol
 */
export async function renderSymbolNews(symbol, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="flex items-center justify-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    `;
    
    const news = await getSymbolNews(symbol, { limit: 10 });
    
    if (news.length === 0) {
        container.innerHTML = `
            <div class="text-center p-8 text-slate-500">
                <i class="fa-solid fa-newspaper text-4xl mb-3 opacity-50"></i>
                <p class="font-bold">No hay noticias disponibles</p>
                <p class="text-sm">Intenta con otro símbolo</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${news.map(article => renderNewsCard(article)).join('')}
        </div>
    `;
}

/**
 * Render portfolio news feed
 */
export async function renderPortfolioNewsFeed(portfolioId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="flex items-center justify-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    `;
    
    const news = await getPortfolioNews(portfolioId, 5);
    
    if (news.length === 0) {
        container.innerHTML = `
            <div class="text-center p-8 text-slate-500">
                <i class="fa-solid fa-newspaper text-4xl mb-3 opacity-50"></i>
                <p class="font-bold">No hay noticias disponibles</p>
                <p class="text-sm">Agrega posiciones a tu portafolio</p>
            </div>
        `;
        return;
    }
    
    // Group news by symbol
    const newsBySymbol = {};
    news.forEach(article => {
        if (!newsBySymbol[article.symbol]) {
            newsBySymbol[article.symbol] = [];
        }
        newsBySymbol[article.symbol].push(article);
    });
    
    const sections = Object.entries(newsBySymbol).map(([symbol, articles]) => `
        <div class="mb-6">
            <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg">${symbol}</span>
                <span class="text-sm text-slate-500">${articles.length} artículos</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${articles.map(article => renderNewsCard(article)).join('')}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = sections;
}

/**
 * Helper: Get time ago string
 */
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        año: 31536000,
        mes: 2592000,
        semana: 604800,
        día: 86400,
        hora: 3600,
        minuto: 60
    };
    
    for (const [name, secondsInInterval] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInInterval);
        if (interval >= 1) {
            return `hace ${interval} ${name}${interval > 1 ? 's' : ''}`;
        }
    }
    
    return 'hace un momento';
}

/**
 * Helper: Get sentiment class
 */
function getSentimentClass(sentiment) {
    const classes = {
        positive: 'bg-emerald-100 text-emerald-700',
        negative: 'bg-rose-100 text-rose-700',
        neutral: 'bg-slate-100 text-slate-600'
    };
    return classes[sentiment] || classes.neutral;
}

/**
 * Helper: Get source icon
 */
function getSourceIcon(source) {
    const icons = {
        yahoo: '📊',
        finnhub: '📈',
        sec: '🏛️',
        cryptopanic: '₿',
        default: '📰'
    };
    return icons[source] || icons.default;
}

// Make functions globally available
window.getSymbolNews = getSymbolNews;
window.renderSymbolNews = renderSymbolNews;
window.renderPortfolioNewsFeed = renderPortfolioNewsFeed;
