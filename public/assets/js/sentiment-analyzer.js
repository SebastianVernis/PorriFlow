/**
 * SV Portfolio - Sentiment Analyzer Frontend Module
 * Visualización y análisis de sentimiento de noticias
 */

import { apiRequest } from './auth.js';

/**
 * Obtener análisis de sentimiento para un símbolo
 */
export async function getSymbolSentiment(symbol) {
    try {
        const response = await apiRequest(`/api/news/${symbol}?limit=20`);
        
        if (!response || !response.news) {
            return null;
        }

        // Calcular estadísticas de sentimiento
        const articles = response.news;
        const stats = calculateSentimentStats(articles);
        
        return {
            symbol,
            stats,
            articles
        };
    } catch (error) {
        console.error(`Error fetching sentiment for ${symbol}:`, error);
        return null;
    }
}

/**
 * Obtener análisis de sentimiento para múltiples símbolos
 */
export async function getBatchSentiment(symbols) {
    try {
        const response = await apiRequest('/api/news/batch', {
            method: 'POST',
            body: JSON.stringify({ symbols, limit: 10 })
        });
        
        if (!response || !response.results) {
            return {};
        }

        const sentiments = {};
        
        for (const [symbol, articles] of Object.entries(response.results)) {
            sentiments[symbol] = calculateSentimentStats(articles);
        }
        
        return sentiments;
    } catch (error) {
        console.error('Error fetching batch sentiment:', error);
        return {};
    }
}

/**
 * Calcular estadísticas de sentimiento de artículos
 */
function calculateSentimentStats(articles) {
    if (!Array.isArray(articles) || articles.length === 0) {
        return {
            overall: 'neutral',
            positive: 0,
            negative: 0,
            neutral: 0,
            total: 0,
            avgScore: 0,
            confidence: 0
        };
    }

    let positive = 0;
    let negative = 0;
    let neutral = 0;
    let totalScore = 0;
    let totalConfidence = 0;
    let articlesWithSentiment = 0;

    articles.forEach(article => {
        if (article.sentiment) {
            articlesWithSentiment++;
            
            if (article.sentiment === 'positive') positive++;
            else if (article.sentiment === 'negative') negative++;
            else neutral++;
            
            if (article.sentimentScore !== undefined) {
                totalScore += article.sentimentScore;
            }
            
            if (article.sentimentConfidence !== undefined) {
                totalConfidence += article.sentimentConfidence;
            }
        }
    });

    const avgScore = articlesWithSentiment > 0 ? totalScore / articlesWithSentiment : 0;
    const avgConfidence = articlesWithSentiment > 0 ? totalConfidence / articlesWithSentiment : 0;

    // Determinar sentimiento general
    let overall = 'neutral';
    if (avgScore > 15) overall = 'positive';
    else if (avgScore < -15) overall = 'negative';

    return {
        overall,
        positive,
        negative,
        neutral,
        total: articles.length,
        avgScore: Math.round(avgScore),
        confidence: Math.round(avgConfidence)
    };
}

/**
 * Renderizar badge de sentimiento
 */
export function renderSentimentBadge(sentiment, size = 'normal') {
    const sizeClasses = {
        small: 'text-[10px] px-2 py-0.5',
        normal: 'text-xs px-2 py-1',
        large: 'text-sm px-3 py-2'
    };

    const sentimentConfig = {
        positive: {
            icon: '📈',
            label: 'Positivo',
            class: 'bg-emerald-100 text-emerald-700 border-emerald-300'
        },
        negative: {
            icon: '📉',
            label: 'Negativo',
            class: 'bg-rose-100 text-rose-700 border-rose-300'
        },
        neutral: {
            icon: '➖',
            label: 'Neutral',
            class: 'bg-slate-100 text-slate-600 border-slate-300'
        }
    };

    const config = sentimentConfig[sentiment] || sentimentConfig.neutral;
    const sizeClass = sizeClasses[size] || sizeClasses.normal;

    return `
        <span class="${config.class} ${sizeClass} rounded-full font-bold border inline-flex items-center gap-1">
            <span>${config.icon}</span>
            <span>${config.label}</span>
        </span>
    `;
}

/**
 * Renderizar card de análisis de sentimiento
 */
export function renderSentimentCard(symbol, stats) {
    if (!stats) {
        return `
            <div class="glass-card p-5 rounded-3xl shadow-sm">
                <p class="text-sm text-slate-500 text-center">Sin datos disponibles</p>
            </div>
        `;
    }

    const { overall, positive, negative, neutral, total, avgScore, confidence } = stats;

    // Calcular porcentajes
    const posPercent = total > 0 ? Math.round((positive / total) * 100) : 0;
    const negPercent = total > 0 ? Math.round((negative / total) * 100) : 0;
    const neuPercent = total > 0 ? Math.round((neutral / total) * 100) : 0;

    return `
        <div class="glass-card p-5 rounded-3xl shadow-sm border-b-4 ${getSentimentBorderClass(overall)}">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                        Análisis de Sentimiento
                    </p>
                    <h3 class="text-xl font-black text-slate-800">${symbol}</h3>
                </div>
                ${renderSentimentBadge(overall, 'large')}
            </div>

            <div class="space-y-3 mb-4">
                <div class="flex items-center justify-between text-sm">
                    <span class="text-slate-600">Score Promedio:</span>
                    <span class="font-bold ${getScoreColorClass(avgScore)}">${avgScore > 0 ? '+' : ''}${avgScore}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                    <span class="text-slate-600">Confianza:</span>
                    <span class="font-bold text-slate-800">${confidence}%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                    <span class="text-slate-600">Total Noticias:</span>
                    <span class="font-bold text-slate-800">${total}</span>
                </div>
            </div>

            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <div class="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div class="bg-emerald-500 h-full transition-all" style="width: ${posPercent}%"></div>
                    </div>
                    <span class="text-xs font-bold text-emerald-600 min-w-[50px] text-right">${positive} (${posPercent}%)</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div class="bg-rose-500 h-full transition-all" style="width: ${negPercent}%"></div>
                    </div>
                    <span class="text-xs font-bold text-rose-600 min-w-[50px] text-right">${negative} (${negPercent}%)</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div class="bg-slate-400 h-full transition-all" style="width: ${neuPercent}%"></div>
                    </div>
                    <span class="text-xs font-bold text-slate-600 min-w-[50px] text-right">${neutral} (${neuPercent}%)</span>
                </div>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-200">
                <p class="text-[10px] text-slate-400 text-center">
                    ${getSentimentInterpretation(overall, avgScore)}
                </p>
            </div>
        </div>
    `;
}

/**
 * Renderizar dashboard de sentimiento para múltiples símbolos
 */
export async function renderSentimentDashboard(symbols, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="flex items-center justify-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    `;

    const sentiments = await getBatchSentiment(symbols);

    if (Object.keys(sentiments).length === 0) {
        container.innerHTML = `
            <div class="text-center p-8 text-slate-500">
                <i class="fa-solid fa-chart-simple text-4xl mb-3 opacity-50"></i>
                <p class="font-bold">No hay datos de sentimiento disponibles</p>
            </div>
        `;
        return;
    }

    const cards = symbols.map(symbol => {
        const stats = sentiments[symbol];
        return renderSentimentCard(symbol, stats);
    }).join('');

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${cards}
        </div>
    `;
}

/**
 * Renderizar gráfico de sentimiento (usando Chart.js)
 */
export function renderSentimentChart(symbol, stats, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positivo', 'Negativo', 'Neutral'],
            datasets: [{
                data: [stats.positive, stats.negative, stats.neutral],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(244, 63, 94, 0.8)',
                    'rgba(148, 163, 184, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(244, 63, 94, 1)',
                    'rgba(148, 163, 184, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                title: {
                    display: true,
                    text: `Distribución de Sentimiento - ${symbol}`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

/**
 * Helper: Obtener clase de borde según sentimiento
 */
function getSentimentBorderClass(sentiment) {
    const classes = {
        positive: 'border-emerald-500',
        negative: 'border-rose-500',
        neutral: 'border-slate-400'
    };
    return classes[sentiment] || classes.neutral;
}

/**
 * Helper: Obtener clase de color según score
 */
function getScoreColorClass(score) {
    if (score > 20) return 'text-emerald-600';
    if (score < -20) return 'text-rose-600';
    return 'text-slate-600';
}

/**
 * Helper: Obtener interpretación del sentimiento
 */
function getSentimentInterpretation(sentiment, score) {
    if (sentiment === 'positive' && score > 50) {
        return '🚀 Sentimiento muy optimista en las noticias';
    } else if (sentiment === 'positive') {
        return '📈 Sentimiento positivo en las noticias';
    } else if (sentiment === 'negative' && score < -50) {
        return '⚠️ Sentimiento muy pesimista en las noticias';
    } else if (sentiment === 'negative') {
        return '📉 Sentimiento negativo en las noticias';
    } else {
        return '➖ Sentimiento neutral o mixto en las noticias';
    }
}

// Make functions globally available
window.getSymbolSentiment = getSymbolSentiment;
window.getBatchSentiment = getBatchSentiment;
window.renderSentimentCard = renderSentimentCard;
window.renderSentimentBadge = renderSentimentBadge;
window.renderSentimentDashboard = renderSentimentDashboard;
window.renderSentimentChart = renderSentimentChart;

export default {
    getSymbolSentiment,
    getBatchSentiment,
    renderSentimentCard,
    renderSentimentBadge,
    renderSentimentDashboard,
    renderSentimentChart
};
