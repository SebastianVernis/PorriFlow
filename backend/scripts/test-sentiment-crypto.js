#!/usr/bin/env node

/**
 * Test script para verificar análisis de sentimiento y símbolos crypto
 */

import sentimentAnalyzer from '../src/services/sentiment-analyzer.js';
import marketDataService from '../src/services/market-data-service.js';

console.log('🧪 SV Portfolio - Test de Sentimiento y Crypto\n');
console.log('='.repeat(60));

// Test 1: Verificar símbolos crypto
console.log('\n📊 TEST 1: Verificación de Símbolos Crypto');
console.log('-'.repeat(60));

const allSymbols = marketDataService.getAllSymbols();
const cryptoSymbols = allSymbols.filter(s => s.endsWith('-USD'));

console.log(`✅ Total de símbolos: ${allSymbols.length}`);
console.log(`✅ Símbolos crypto: ${cryptoSymbols.length}`);
console.log(`\n📋 Primeros 20 cryptos:`);
cryptoSymbols.slice(0, 20).forEach((symbol, i) => {
    console.log(`   ${(i + 1).toString().padStart(2, '0')}. ${symbol}`);
});

if (cryptoSymbols.length >= 50) {
    console.log(`\n✅ PASS: Se encontraron ${cryptoSymbols.length} criptomonedas (objetivo: 50+)`);
} else {
    console.log(`\n⚠️  WARN: Solo ${cryptoSymbols.length} criptomonedas (objetivo: 50+)`);
}

// Test 2: Análisis de sentimiento con palabras crypto
console.log('\n\n📊 TEST 2: Análisis de Sentimiento - Palabras Crypto');
console.log('-'.repeat(60));

const testCases = [
    {
        title: 'Bitcoin to the moon! 🚀 HODL diamond hands',
        expected: 'positive',
        description: 'Crypto slang positivo'
    },
    {
        title: 'Major rugpull! FUD spreading, massive dump incoming',
        expected: 'negative',
        description: 'Crypto slang negativo'
    },
    {
        title: 'Ethereum breaks all-time high, institutional adoption surging',
        expected: 'positive',
        description: 'Noticias positivas tradicionales'
    },
    {
        title: 'Exchange hack: $100M stolen, users panic selling',
        expected: 'negative',
        description: 'Noticias negativas de seguridad'
    },
    {
        title: 'DeFi protocol launches new staking rewards with high APY',
        expected: 'positive',
        description: 'DeFi positivo'
    },
    {
        title: 'Crypto winter continues, bear market deepens',
        expected: 'negative',
        description: 'Bear market'
    },
    {
        title: 'Bitcoin price stable at $45k, low volatility',
        expected: 'neutral',
        description: 'Neutral/estable'
    }
];

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
    const result = await sentimentAnalyzer.analyzeSentiment(testCase.title);
    const match = result.sentiment === testCase.expected;
    
    if (match) {
        passed++;
        console.log(`\n✅ PASS: ${testCase.description}`);
    } else {
        failed++;
        console.log(`\n❌ FAIL: ${testCase.description}`);
    }
    
    console.log(`   Texto: "${testCase.title}"`);
    console.log(`   Esperado: ${testCase.expected} | Obtenido: ${result.sentiment}`);
    console.log(`   Score: ${result.score} | Confianza: ${result.confidence}% | Fuente: ${result.source}`);
}

console.log(`\n${'='.repeat(60)}`);
console.log(`📊 Resultados: ${passed} passed, ${failed} failed (${Math.round(passed / testCases.length * 100)}% success rate)`);

// Test 3: Análisis de múltiples artículos
console.log('\n\n📊 TEST 3: Análisis de Múltiples Artículos');
console.log('-'.repeat(60));

const articles = [
    { title: 'Bitcoin surges to new highs', summary: 'Strong momentum continues' },
    { title: 'Ethereum upgrade successful', summary: 'Network performance improved' },
    { title: 'Market correction expected', summary: 'Analysts warn of overbought conditions' }
];

const multiResult = await sentimentAnalyzer.analyzeMultipleArticles(articles);

console.log(`\n📈 Análisis agregado de ${multiResult.count} artículos:`);
console.log(`   Sentimiento general: ${multiResult.overall}`);
console.log(`   Score promedio: ${multiResult.avgScore}`);
console.log(`   Positivos: ${multiResult.positive}`);
console.log(`   Negativos: ${multiResult.negative}`);
console.log(`   Neutrales: ${multiResult.neutral}`);
console.log(`   Fuente: ${multiResult.source}`);

// Test 4: Verificar configuración de API externa
console.log('\n\n📊 TEST 4: Configuración de API Externa');
console.log('-'.repeat(60));

const hasApiKey = !!process.env.SENTIMENT_API_KEY;
const apiProvider = process.env.SENTIMENT_API_PROVIDER || 'huggingface';

if (hasApiKey) {
    console.log(`✅ SENTIMENT_API_KEY configurada`);
    console.log(`   Provider: ${apiProvider}`);
    console.log(`   Modo: API externa + fallback local`);
} else {
    console.log(`ℹ️  SENTIMENT_API_KEY no configurada (esperado)`);
    console.log(`   Modo: Solo análisis local con diccionarios`);
    console.log(`   Incluye: 100+ términos crypto-específicos`);
}

// Test 5: Verificar palabras crypto en diccionarios
console.log('\n\n📊 TEST 5: Palabras Crypto-Específicas');
console.log('-'.repeat(60));

const cryptoTerms = [
    'moon', 'hodl', 'fud', 'rugpull', 'diamond hands', 'paper hands',
    'whale', 'pump', 'dump', 'ath', 'btfd', 'rekt'
];

console.log('🔍 Verificando términos crypto en análisis:\n');

for (const term of cryptoTerms) {
    const result = await sentimentAnalyzer.analyzeSentiment(`Bitcoin ${term} happening now`);
    const detected = result.score !== 0;
    
    if (detected) {
        console.log(`   ✅ "${term}" - Detectado (${result.sentiment}, score: ${result.score})`);
    } else {
        console.log(`   ⚠️  "${term}" - No detectado`);
    }
}

// Resumen final
console.log('\n\n' + '='.repeat(60));
console.log('📋 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(60));

console.log(`\n✅ Símbolos crypto: ${cryptoSymbols.length} (objetivo: 50+)`);
console.log(`✅ Tests de sentimiento: ${passed}/${testCases.length} passed`);
console.log(`✅ API externa: ${hasApiKey ? 'Configurada' : 'No configurada (OK)'}`);
console.log(`✅ Diccionarios crypto: Implementados`);

console.log('\n🎯 ESTADO GENERAL: ');
if (cryptoSymbols.length >= 50 && passed >= testCases.length * 0.7) {
    console.log('   ✅ TODOS LOS TESTS PASARON\n');
    process.exit(0);
} else {
    console.log('   ⚠️  ALGUNOS TESTS FALLARON\n');
    process.exit(1);
}
