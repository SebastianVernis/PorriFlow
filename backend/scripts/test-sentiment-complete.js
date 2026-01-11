/**
 * Test completo del Sentiment Analyzer
 * Prueba todas las funciones con API Ninjas y fallback local
 */

import { analyzeSentiment, analyzeArticle, analyzeMultipleArticles } from '../src/services/sentiment-analyzer.js';

console.log('='.repeat(80));
console.log('TEST COMPLETO - SENTIMENT ANALYZER');
console.log('='.repeat(80));
console.log();

// Test 1: Análisis de texto simple con API
async function testSimpleSentiment() {
    console.log('📝 TEST 1: Análisis de texto simple con API Ninjas');
    console.log('-'.repeat(80));
    
    const texts = [
        { text: 'Bitcoin is surging to new all-time highs! Great investment opportunity.', expected: 'positive' },
        { text: 'Market crash! Bitcoin plummets, investors panic selling.', expected: 'negative' },
        { text: 'Bitcoin price remains stable at current levels.', expected: 'neutral' },
        { text: 'Ethereum is mooning! 🚀 HODL diamond hands!', expected: 'positive' },
        { text: 'Rugpull detected! Massive dump, everyone getting rekt!', expected: 'negative' }
    ];
    
    for (const { text, expected } of texts) {
        console.log(`\nTexto: "${text}"`);
        console.log(`Esperado: ${expected}`);
        
        const result = await analyzeSentiment(text, { useExternalAPI: true });
        console.log(`Resultado: ${result.sentiment} (score: ${result.score}, confidence: ${result.confidence}%)`);
        console.log(`Source: ${result.source}`);
        
        const match = result.sentiment === expected ? '✅' : '⚠️';
        console.log(`${match} ${result.sentiment === expected ? 'CORRECTO' : 'DIFERENTE'}`);
    }
    
    console.log();
}

// Test 2: Análisis con fallback local (sin API)
async function testLocalFallback() {
    console.log('📝 TEST 2: Análisis con diccionario local (sin API)');
    console.log('-'.repeat(80));
    
    const texts = [
        'Bitcoin gains momentum with strong bullish rally',
        'Crypto winter continues, bearish sentiment dominates',
        'Price consolidation in neutral territory'
    ];
    
    for (const text of texts) {
        console.log(`\nTexto: "${text}"`);
        
        const result = await analyzeSentiment(text, { useExternalAPI: false });
        console.log(`Resultado: ${result.sentiment} (score: ${result.score}, confidence: ${result.confidence}%)`);
        console.log(`Source: ${result.source}`);
    }
    
    console.log();
}

// Test 3: Análisis de artículos completos
async function testArticleAnalysis() {
    console.log('📝 TEST 3: Análisis de artículos completos (título + resumen)');
    console.log('-'.repeat(80));
    
    const articles = [
        {
            title: 'Bitcoin Breaks Records',
            summary: 'Bitcoin surged past $60,000 today, reaching new all-time highs. Institutional investors show strong bullish sentiment.',
            expected: 'positive'
        },
        {
            title: 'Crypto Market Faces Major Correction',
            summary: 'Cryptocurrency prices plummeted today amid regulatory concerns. Panic selling dominated the market with significant losses.',
            expected: 'negative'
        },
        {
            title: 'Bitcoin Price Stabilizes',
            summary: 'After recent volatility, Bitcoin trading remains stable around current levels. Market participants await next catalyst.',
            expected: 'neutral'
        }
    ];
    
    for (const article of articles) {
        console.log(`\nTítulo: "${article.title}"`);
        console.log(`Resumen: "${article.summary}"`);
        console.log(`Esperado: ${article.expected}`);
        
        const result = await analyzeArticle(article, { useExternalAPI: true });
        console.log(`Resultado: ${result.sentiment} (score: ${result.score}, confidence: ${result.confidence}%)`);
        console.log(`Source: ${result.source}`);
        
        const match = result.sentiment === article.expected ? '✅' : '⚠️';
        console.log(`${match} ${result.sentiment === article.expected ? 'CORRECTO' : 'DIFERENTE'}`);
    }
    
    console.log();
}

// Test 4: Análisis de múltiples artículos
async function testMultipleArticles() {
    console.log('📝 TEST 4: Análisis agregado de múltiples artículos');
    console.log('-'.repeat(80));
    
    const articles = [
        {
            title: 'Bitcoin Rally Continues',
            summary: 'Strong gains across crypto markets with bullish momentum.'
        },
        {
            title: 'Ethereum Upgrade Success',
            summary: 'Successful network upgrade brings positive developments.'
        },
        {
            title: 'Minor Correction Expected',
            summary: 'Analysts predict slight pullback after recent surge.'
        },
        {
            title: 'Institutional Adoption Growing',
            summary: 'Major companies announce crypto treasury strategies.'
        },
        {
            title: 'Regulatory Concerns Emerge',
            summary: 'New regulations may impact market sentiment negatively.'
        }
    ];
    
    console.log(`\nAnalizando ${articles.length} artículos...\n`);
    
    const result = await analyzeMultipleArticles(articles, { useExternalAPI: true });
    
    console.log(`Sentimiento General: ${result.overall}`);
    console.log(`Score Promedio: ${result.avgScore}`);
    console.log(`Distribución:`);
    console.log(`  - Positivos: ${result.positive} (${Math.round(result.positive/result.count*100)}%)`);
    console.log(`  - Negativos: ${result.negative} (${Math.round(result.negative/result.count*100)}%)`);
    console.log(`  - Neutrales: ${result.neutral} (${Math.round(result.neutral/result.count*100)}%)`);
    console.log(`Total artículos: ${result.count}`);
    console.log(`Source: ${result.source}`);
    
    console.log();
}

// Test 5: Manejo de casos edge
async function testEdgeCases() {
    console.log('📝 TEST 5: Casos edge y manejo de errores');
    console.log('-'.repeat(80));
    
    const cases = [
        { name: 'Texto vacío', input: '', expected: 'neutral' },
        { name: 'Texto null', input: null, expected: 'neutral' },
        { name: 'Solo espacios', input: '   ', expected: 'neutral' },
        { name: 'Texto muy corto', input: 'ok', expected: 'neutral' },
        { name: 'Texto largo', input: 'Bitcoin '.repeat(100), expected: 'neutral' },
        { name: 'Caracteres especiales', input: '!@#$%^&*()', expected: 'neutral' }
    ];
    
    for (const testCase of cases) {
        console.log(`\n${testCase.name}: "${testCase.input}"`);
        
        try {
            const result = await analyzeSentiment(testCase.input, { useExternalAPI: true });
            console.log(`✅ Resultado: ${result.sentiment} (score: ${result.score})`);
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
    }
    
    console.log();
}

// Test 6: Comparación API vs Local
async function testAPIvsLocal() {
    console.log('📝 TEST 6: Comparación API Ninjas vs Diccionario Local');
    console.log('-'.repeat(80));
    
    const texts = [
        'Bitcoin is pumping hard! Moon mission activated 🚀',
        'Market crash, everyone getting rekt. FUD everywhere!',
        'Sideways trading continues in consolidation phase'
    ];
    
    for (const text of texts) {
        console.log(`\nTexto: "${text}"`);
        
        const apiResult = await analyzeSentiment(text, { useExternalAPI: true });
        const localResult = await analyzeSentiment(text, { useExternalAPI: false });
        
        console.log(`API Ninjas:  ${apiResult.sentiment.padEnd(8)} (score: ${String(apiResult.score).padStart(4)}, conf: ${String(apiResult.confidence).padStart(3)}%)`);
        console.log(`Local Dict:  ${localResult.sentiment.padEnd(8)} (score: ${String(localResult.score).padStart(4)}, conf: ${String(localResult.confidence).padStart(3)}%)`);
        
        const match = apiResult.sentiment === localResult.sentiment ? '✅' : '⚠️';
        console.log(`${match} ${apiResult.sentiment === localResult.sentiment ? 'Coinciden' : 'Difieren'}`);
    }
    
    console.log();
}

// Test 7: Performance
async function testPerformance() {
    console.log('📝 TEST 7: Performance y tiempo de respuesta');
    console.log('-'.repeat(80));
    
    const text = 'Bitcoin shows strong bullish momentum with significant gains across the market.';
    const iterations = 5;
    
    // Test API
    console.log(`\nAPI Ninjas (${iterations} llamadas):`);
    const apiStart = Date.now();
    for (let i = 0; i < iterations; i++) {
        await analyzeSentiment(text, { useExternalAPI: true });
    }
    const apiTime = Date.now() - apiStart;
    console.log(`Tiempo total: ${apiTime}ms`);
    console.log(`Promedio: ${Math.round(apiTime/iterations)}ms por análisis`);
    
    // Test Local
    console.log(`\nDiccionario Local (${iterations} análisis):`);
    const localStart = Date.now();
    for (let i = 0; i < iterations; i++) {
        await analyzeSentiment(text, { useExternalAPI: false });
    }
    const localTime = Date.now() - localStart;
    console.log(`Tiempo total: ${localTime}ms`);
    console.log(`Promedio: ${Math.round(localTime/iterations)}ms por análisis`);
    
    const speedup = Math.round(apiTime / localTime);
    console.log(`\n⚡ Local es ${speedup}x más rápido que API`);
    
    console.log();
}

// Ejecutar todos los tests
async function runAllTests() {
    const startTime = Date.now();
    
    try {
        await testSimpleSentiment();
        await testLocalFallback();
        await testArticleAnalysis();
        await testMultipleArticles();
        await testEdgeCases();
        await testAPIvsLocal();
        await testPerformance();
        
        const totalTime = Date.now() - startTime;
        
        console.log('='.repeat(80));
        console.log('✅ TODOS LOS TESTS COMPLETADOS');
        console.log(`⏱️  Tiempo total: ${(totalTime/1000).toFixed(2)}s`);
        console.log('='.repeat(80));
        
    } catch (error) {
        console.error('\n❌ ERROR EN TESTS:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Ejecutar
runAllTests();
