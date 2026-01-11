/**
 * SV Portfolio - Sentiment Analyzer
 * Analiza el sentimiento de noticias financieras con soporte para APIs externas opcionales
 */

import https from 'https';
import http from 'http';

// Diccionario de palabras positivas (mercado financiero + crypto)
const POSITIVE_WORDS = [
    // Mercado tradicional
    'gain', 'gains', 'profit', 'profits', 'up', 'surge', 'rally', 'bullish', 'bull',
    'rise', 'rising', 'growth', 'grew', 'grow', 'record', 'high', 'highs', 'peak',
    'strong', 'strength', 'outperform', 'beat', 'exceeded', 'exceed', 'success',
    'positive', 'optimistic', 'upgrade', 'upgraded', 'momentum', 'soar', 'soaring',
    'breakthrough', 'innovation', 'expansion', 'expand', 'boost', 'boosted', 
    'recovery', 'recover', 'rebound', 'advance', 'improved', 'improvement',
    'winning', 'winner', 'beat expectations', 'top', 'leading', 'leader',
    
    // Crypto-specific
    'moon', 'mooning', 'lambo', 'hodl', 'diamond hands', 'pump', 'pumping',
    'breakout', 'ath', 'all-time high', 'adoption', 'mainstream', 'institutional',
    'accumulation', 'accumulate', 'buy the dip', 'btfd', 'bullrun', 'altseason',
    'green', 'gains', 'rocket', 'launch', 'partnership', 'integration', 'upgrade',
    'halving', 'staking', 'yield', 'apy', 'defi summer', 'web3', 'metaverse',
    'nft boom', 'whale accumulation', 'golden cross', 'oversold', 'undervalued'
];

// Diccionario de palabras negativas (mercado financiero + crypto)
const NEGATIVE_WORDS = [
    // Mercado tradicional
    'loss', 'losses', 'down', 'fall', 'falls', 'falling', 'fell', 'drop', 'dropped',
    'decline', 'declining', 'bearish', 'bear', 'crash', 'plunge', 'plunged', 'weak',
    'weakness', 'underperform', 'miss', 'missed', 'below', 'disappointed', 'disappoint',
    'negative', 'pessimistic', 'downgrade', 'downgraded', 'concern', 'concerns', 
    'worried', 'worry', 'risk', 'risks', 'volatile', 'volatility', 'uncertain',
    'uncertainty', 'crisis', 'problem', 'problems', 'bankruptcy', 'bankrupt',
    'layoff', 'layoffs', 'cut', 'cuts', 'cutting', 'struggle', 'struggling',
    'fail', 'failed', 'failure', 'worst', 'poor', 'disappointing',
    
    // Crypto-specific
    'dump', 'dumping', 'rekt', 'rugpull', 'rug pull', 'scam', 'ponzi', 'fud',
    'fear', 'panic', 'sell-off', 'selloff', 'capitulation', 'death cross',
    'bear market', 'crypto winter', 'hack', 'hacked', 'exploit', 'exploited',
    'vulnerability', 'vulnerable', 'regulation', 'ban', 'banned', 'crackdown',
    'delisting', 'delisted', 'liquidation', 'liquidated', 'margin call',
    'paper hands', 'whale dump', 'red', 'bleeding', 'bloodbath', 'massacre',
    'collapse', 'collapsed', 'insolvent', 'insolvency', 'frozen', 'suspended',
    'overbought', 'overvalued', 'bubble', 'correction'
];

// Intensificadores (aumentan el peso del sentimiento)
const INTENSIFIERS = [
    'very', 'extremely', 'highly', 'significantly', 'substantially', 'dramatically',
    'massively', 'sharply', 'strongly', 'major', 'huge', 'massive'
];

// Negadores (invierten el sentimiento)
const NEGATORS = [
    'not', 'no', 'never', 'neither', 'nor', 'none', 'nobody', 'nothing', 'nowhere',
    'hardly', 'scarcely', 'barely'
];

/**
 * Limpia y tokeniza el texto
 */
function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Remover puntuación
        .split(/\s+/) // Dividir por espacios
        .filter(word => word.length > 0);
}

/**
 * Fetch sentiment from external API (if SENTIMENT_API_KEY is configured)
 * Supports multiple providers: TextBlob, VADER, Hugging Face, etc.
 */
async function fetchExternalSentiment(text) {
    const apiKey = process.env.SENTIMENT_API_KEY;
    const apiProvider = process.env.SENTIMENT_API_PROVIDER || 'huggingface';
    
    if (!apiKey) {
        return null; // Fall back to local analysis
    }
    
    try {
        let url, options;
        
        switch (apiProvider.toLowerCase()) {
            case 'huggingface':
                // Hugging Face Inference API
                url = 'https://api-inference.huggingface.co/models/ProsusAI/finbert';
                options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ inputs: text })
                };
                break;
                
            case 'textblob':
            case 'vader':
                // Custom API endpoint (user-hosted)
                url = process.env.SENTIMENT_API_URL || 'http://localhost:5000/analyze';
                options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text })
                };
                break;
                
            default:
                console.warn(`Unknown sentiment API provider: ${apiProvider}`);
                return null;
        }
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Parse response based on provider
        if (apiProvider === 'huggingface') {
            // FinBERT returns array of labels with scores
            const result = data[0];
            const positive = result.find(r => r.label === 'positive')?.score || 0;
            const negative = result.find(r => r.label === 'negative')?.score || 0;
            const neutral = result.find(r => r.label === 'neutral')?.score || 0;
            
            const score = (positive - negative) * 100;
            const sentiment = positive > negative && positive > neutral ? 'positive' :
                            negative > positive && negative > neutral ? 'negative' : 'neutral';
            
            return {
                score: Math.round(score),
                sentiment,
                confidence: Math.round(Math.max(positive, negative, neutral) * 100),
                source: 'huggingface-finbert'
            };
        } else {
            // Generic format
            return {
                score: Math.round(data.score || 0),
                sentiment: data.sentiment || 'neutral',
                confidence: Math.round(data.confidence || 0),
                source: apiProvider
            };
        }
        
    } catch (error) {
        console.error('External sentiment API error:', error.message);
        return null; // Fall back to local analysis
    }
}

/**
 * Analiza el sentimiento de un texto
 * @param {string} text - Texto a analizar (título + resumen)
 * @param {object} options - { useExternalAPI: boolean }
 * @returns {object} { score, sentiment, confidence, source }
 */
export async function analyzeSentiment(text, options = {}) {
    const { useExternalAPI = true } = options;
    
    if (!text || typeof text !== 'string') {
        return { score: 0, sentiment: 'neutral', confidence: 0, source: 'none' };
    }
    
    // Try external API first if enabled and configured
    if (useExternalAPI && process.env.SENTIMENT_API_KEY) {
        const externalResult = await fetchExternalSentiment(text);
        if (externalResult) {
            return externalResult;
        }
    }
    
    // Fall back to local dictionary-based analysis
    const tokens = tokenize(text);
    let score = 0;
    let matchedWords = 0;
    let intensity = 1;
    let negated = false;

    for (let i = 0; i < tokens.length; i++) {
        const word = tokens[i];
        const prevWord = i > 0 ? tokens[i - 1] : null;

        // Detectar intensificadores
        if (INTENSIFIERS.includes(word)) {
            intensity = 1.5;
            continue;
        }

        // Detectar negadores
        if (NEGATORS.includes(word)) {
            negated = true;
            continue;
        }

        // Calcular puntaje por palabra
        let wordScore = 0;

        if (POSITIVE_WORDS.includes(word)) {
            wordScore = 1 * intensity;
            matchedWords++;
        } else if (NEGATIVE_WORDS.includes(word)) {
            wordScore = -1 * intensity;
            matchedWords++;
        }

        // Aplicar negación si está activa
        if (negated && wordScore !== 0) {
            wordScore *= -1;
            negated = false;
        }

        score += wordScore;

        // Resetear intensidad después de usarla
        if (wordScore !== 0) {
            intensity = 1;
        }
    }

    // Normalizar score (-100 a +100)
    const normalizedScore = matchedWords > 0 ? (score / matchedWords) * 100 : 0;

    // Calcular confianza basado en cantidad de palabras relevantes
    const confidence = Math.min((matchedWords / tokens.length) * 100, 100);

    // Determinar sentimiento categórico
    let sentiment;
    if (normalizedScore > 20) {
        sentiment = 'positive';
    } else if (normalizedScore < -20) {
        sentiment = 'negative';
    } else {
        sentiment = 'neutral';
    }

    return {
        score: Math.round(normalizedScore),
        sentiment,
        confidence: Math.round(confidence),
        source: 'local-dictionary'
    };
}

/**
 * Analiza una noticia completa (título + resumen)
 * @param {object} article - { title, summary }
 * @param {object} options - { useExternalAPI: boolean }
 * @returns {object} { sentiment, score, confidence, source }
 */
export async function analyzeArticle(article, options = {}) {
    if (!article) {
        return { sentiment: 'neutral', score: 0, confidence: 0, source: 'none' };
    }

    const title = article.title || '';
    const summary = article.summary || article.description || '';

    // El título tiene más peso (60%) que el resumen (40%)
    const titleAnalysis = await analyzeSentiment(title, options);
    const summaryAnalysis = await analyzeSentiment(summary, options);

    const combinedScore = (titleAnalysis.score * 0.6) + (summaryAnalysis.score * 0.4);
    const combinedConfidence = (titleAnalysis.confidence * 0.6) + (summaryAnalysis.confidence * 0.4);

    let sentiment;
    if (combinedScore > 20) {
        sentiment = 'positive';
    } else if (combinedScore < -20) {
        sentiment = 'negative';
    } else {
        sentiment = 'neutral';
    }

    return {
        sentiment,
        score: Math.round(combinedScore),
        confidence: Math.round(combinedConfidence),
        source: titleAnalysis.source
    };
}

/**
 * Analiza múltiples noticias y calcula sentimiento agregado
 * @param {array} articles - Array de artículos
 * @param {object} options - { useExternalAPI: boolean }
 * @returns {object} { overall, positive, negative, neutral, avgScore, count, source }
 */
export async function analyzeMultipleArticles(articles, options = {}) {
    if (!Array.isArray(articles) || articles.length === 0) {
        return {
            overall: 'neutral',
            positive: 0,
            negative: 0,
            neutral: 0,
            avgScore: 0,
            count: 0,
            source: 'none'
        };
    }

    let totalScore = 0;
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    let source = 'local-dictionary';

    // Analyze all articles (with Promise.all for parallel processing)
    const analyses = await Promise.all(
        articles.map(article => analyzeArticle(article, options))
    );

    analyses.forEach(analysis => {
        totalScore += analysis.score;
        source = analysis.source; // Use the source from analyses

        if (analysis.sentiment === 'positive') positive++;
        else if (analysis.sentiment === 'negative') negative++;
        else neutral++;
    });

    const avgScore = totalScore / articles.length;

    let overall;
    if (avgScore > 15) {
        overall = 'positive';
    } else if (avgScore < -15) {
        overall = 'negative';
    } else {
        overall = 'neutral';
    }

    return {
        overall,
        positive,
        negative,
        neutral,
        avgScore: Math.round(avgScore),
        count: articles.length,
        source
    };
}

export default {
    analyzeSentiment,
    analyzeArticle,
    analyzeMultipleArticles
};
