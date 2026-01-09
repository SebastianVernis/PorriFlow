/**
 * SV Portfolio - Sentiment Analyzer
 * Analiza el sentimiento de noticias financieras sin APIs externas
 */

// Diccionario de palabras positivas (mercado financiero)
const POSITIVE_WORDS = [
    'gain', 'gains', 'profit', 'profits', 'up', 'surge', 'rally', 'bullish', 'bull',
    'rise', 'rising', 'growth', 'grew', 'grow', 'record', 'high', 'highs', 'peak',
    'strong', 'strength', 'outperform', 'beat', 'exceeded', 'exceed', 'success',
    'positive', 'optimistic', 'upgrade', 'upgraded', 'momentum', 'soar', 'soaring',
    'breakthrough', 'innovation', 'expansion', 'expand', 'boost', 'boosted', 
    'recovery', 'recover', 'rebound', 'advance', 'improved', 'improvement',
    'winning', 'winner', 'beat expectations', 'top', 'leading', 'leader'
];

// Diccionario de palabras negativas (mercado financiero)
const NEGATIVE_WORDS = [
    'loss', 'losses', 'down', 'fall', 'falls', 'falling', 'fell', 'drop', 'dropped',
    'decline', 'declining', 'bearish', 'bear', 'crash', 'plunge', 'plunged', 'weak',
    'weakness', 'underperform', 'miss', 'missed', 'below', 'disappointed', 'disappoint',
    'negative', 'pessimistic', 'downgrade', 'downgraded', 'concern', 'concerns', 
    'worried', 'worry', 'risk', 'risks', 'volatile', 'volatility', 'uncertain',
    'uncertainty', 'crisis', 'problem', 'problems', 'bankruptcy', 'bankrupt',
    'layoff', 'layoffs', 'cut', 'cuts', 'cutting', 'struggle', 'struggling',
    'fail', 'failed', 'failure', 'worst', 'poor', 'disappointing'
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
 * Analiza el sentimiento de un texto
 * @param {string} text - Texto a analizar (título + resumen)
 * @returns {object} { score, sentiment, confidence }
 */
export function analyzeSentiment(text) {
    if (!text || typeof text !== 'string') {
        return { score: 0, sentiment: 'neutral', confidence: 0 };
    }

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
        confidence: Math.round(confidence)
    };
}

/**
 * Analiza una noticia completa (título + resumen)
 * @param {object} article - { title, summary }
 * @returns {object} { sentiment, score, confidence }
 */
export function analyzeArticle(article) {
    if (!article) {
        return { sentiment: 'neutral', score: 0, confidence: 0 };
    }

    const title = article.title || '';
    const summary = article.summary || article.description || '';

    // El título tiene más peso (60%) que el resumen (40%)
    const titleAnalysis = analyzeSentiment(title);
    const summaryAnalysis = analyzeSentiment(summary);

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
        confidence: Math.round(combinedConfidence)
    };
}

/**
 * Analiza múltiples noticias y calcula sentimiento agregado
 * @param {array} articles - Array de artículos
 * @returns {object} { overall, positive, negative, neutral, avgScore }
 */
export function analyzeMultipleArticles(articles) {
    if (!Array.isArray(articles) || articles.length === 0) {
        return {
            overall: 'neutral',
            positive: 0,
            negative: 0,
            neutral: 0,
            avgScore: 0,
            count: 0
        };
    }

    let totalScore = 0;
    let positive = 0;
    let negative = 0;
    let neutral = 0;

    articles.forEach(article => {
        const analysis = analyzeArticle(article);
        totalScore += analysis.score;

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
        count: articles.length
    };
}

export default {
    analyzeSentiment,
    analyzeArticle,
    analyzeMultipleArticles
};
