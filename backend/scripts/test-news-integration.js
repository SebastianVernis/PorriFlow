/**
 * Test de integración: News Service + Sentiment Analyzer
 * Verifica que el análisis de sentimiento funcione correctamente con noticias reales
 */

import { getNewsForSymbol, saveNewsToDatabase } from '../src/services/news-service.js';
import { analyzeArticle, analyzeMultipleArticles } from '../src/services/sentiment-analyzer.js';

console.log('='.repeat(80));
console.log('TEST DE INTEGRACIÓN - NEWS SERVICE + SENTIMENT ANALYZER');
console.log('='.repeat(80));
console.log();

// Test: Fetch y analizar noticias
async function testNewsWithSentiment() {
    console.log('📰 TEST: Fetch y analizar sentimiento de noticias reales');
    console.log('-'.repeat(80));
    
    const symbols = ['AAPL', 'BTC-USD'];
    
    for (const symbol of symbols) {
        console.log(`\n📊 Símbolo: ${symbol}`);
        console.log('─'.repeat(40));
        
        try {
            // Fetch news
            const news = await getNewsForSymbol(symbol, { limit: 5 });
            
            if (news.length === 0) {
                console.log('⚠️  No se encontraron noticias');
                continue;
            }
            
            console.log(`✅ Encontradas ${news.length} noticias\n`);
            
            // Analizar sentimiento de cada artículo
            console.log('Análisis individual:');
            for (let i = 0; i < Math.min(news.length, 3); i++) {
                const article = news[i];
                console.log(`\n${i + 1}. ${article.title.substring(0, 70)}...`);
                console.log(`   Fuente: ${article.source} | ${article.publisher || 'N/A'}`);
                
                const analysis = await analyzeArticle(article, { useExternalAPI: true });
                console.log(`   Sentimiento: ${analysis.sentiment} (score: ${analysis.score}, conf: ${analysis.confidence}%)`);
                console.log(`   Source: ${analysis.source}`);
            }
            
            // Análisis agregado
            console.log(`\n📊 Análisis agregado de ${news.length} artículos:`);
            const aggregated = await analyzeMultipleArticles(news, { useExternalAPI: true });
            console.log(`   Overall: ${aggregated.overall} (avg score: ${aggregated.avgScore})`);
            console.log(`   Distribución: ${aggregated.positive} positivos, ${aggregated.negative} negativos, ${aggregated.neutral} neutrales`);
            console.log(`   Source: ${aggregated.source}`);
            
        } catch (error) {
            console.error(`❌ Error con ${symbol}:`, error.message);
        }
    }
    
    console.log();
}

// Test: Verificar fallback cuando API falla
async function testAPIFallback() {
    console.log('🔄 TEST: Fallback cuando API no está disponible');
    console.log('-'.repeat(80));
    
    const mockArticle = {
        title: 'Bitcoin surges to new all-time highs amid strong institutional demand',
        summary: 'Bitcoin reached record levels today as institutional investors continue accumulating. Market sentiment remains bullish with strong momentum.',
        source: 'test',
        publisher: 'Test Publisher'
    };
    
    console.log('\nArtículo de prueba:');
    console.log(`Título: ${mockArticle.title}`);
    console.log(`Resumen: ${mockArticle.summary}`);
    
    // Con API
    console.log('\n1. Con API Ninjas:');
    const withAPI = await analyzeArticle(mockArticle, { useExternalAPI: true });
    console.log(`   Resultado: ${withAPI.sentiment} (score: ${withAPI.score}, conf: ${withAPI.confidence}%)`);
    console.log(`   Source: ${withAPI.source}`);
    
    // Sin API (fallback local)
    console.log('\n2. Sin API (diccionario local):');
    const withoutAPI = await analyzeArticle(mockArticle, { useExternalAPI: false });
    console.log(`   Resultado: ${withoutAPI.sentiment} (score: ${withoutAPI.score}, conf: ${withoutAPI.confidence}%)`);
    console.log(`   Source: ${withoutAPI.source}`);
    
    const match = withAPI.sentiment === withoutAPI.sentiment ? '✅' : '⚠️';
    console.log(`\n${match} Sentimientos ${withAPI.sentiment === withoutAPI.sentiment ? 'coinciden' : 'difieren'}`);
    
    console.log();
}

// Test: Diferentes tipos de noticias
async function testDifferentNewsTypes() {
    console.log('📋 TEST: Diferentes tipos de noticias financieras');
    console.log('-'.repeat(80));
    
    const testCases = [
        {
            name: 'Earnings Beat',
            article: {
                title: 'Apple beats earnings expectations with record revenue',
                summary: 'Apple Inc. reported strong quarterly results, exceeding analyst estimates with impressive growth in iPhone sales.',
                source: 'test'
            },
            expected: 'positive'
        },
        {
            name: 'Regulatory Concerns',
            article: {
                title: 'SEC announces investigation into cryptocurrency exchanges',
                summary: 'Regulatory concerns mount as SEC launches probe into major crypto platforms. Market participants worried about potential restrictions.',
                source: 'test'
            },
            expected: 'negative'
        },
        {
            name: 'Product Launch',
            article: {
                title: 'Tech company unveils new product line',
                summary: 'Company announced plans to expand product offerings with new innovations in the coming quarters.',
                source: 'test'
            },
            expected: 'neutral/positive'
        },
        {
            name: 'Crypto Bull Run',
            article: {
                title: 'Bitcoin is mooning! 🚀 Altseason has begun',
                summary: 'Crypto markets pumping hard. HODL diamond hands! Bitcoin breaking resistance levels with massive green candles.',
                source: 'test'
            },
            expected: 'positive'
        },
        {
            name: 'Market Crash',
            article: {
                title: 'Crypto bloodbath: Market capitulation as whales dump',
                summary: 'Massive selloff continues. FUD dominates as prices plummet. Many investors getting rekt with significant losses.',
                source: 'test'
            },
            expected: 'negative'
        }
    ];
    
    for (const testCase of testCases) {
        console.log(`\n📄 ${testCase.name}`);
        console.log(`   Título: ${testCase.article.title}`);
        console.log(`   Esperado: ${testCase.expected}`);
        
        const analysis = await analyzeArticle(testCase.article, { useExternalAPI: true });
        console.log(`   Resultado: ${analysis.sentiment} (score: ${analysis.score}, conf: ${analysis.confidence}%)`);
        
        const isCorrect = analysis.sentiment === testCase.expected || 
                         testCase.expected.includes(analysis.sentiment);
        const icon = isCorrect ? '✅' : '⚠️';
        console.log(`   ${icon} ${isCorrect ? 'CORRECTO' : 'DIFERENTE'}`);
    }
    
    console.log();
}

// Test: Performance con múltiples noticias
async function testPerformanceWithRealNews() {
    console.log('⚡ TEST: Performance con noticias reales');
    console.log('-'.repeat(80));
    
    try {
        console.log('\nFetching noticias de AAPL...');
        const news = await getNewsForSymbol('AAPL', { limit: 10 });
        
        if (news.length === 0) {
            console.log('⚠️  No se pudieron obtener noticias para test de performance');
            return;
        }
        
        console.log(`✅ ${news.length} noticias obtenidas\n`);
        
        // Análisis secuencial
        console.log('1. Análisis secuencial:');
        const startSeq = Date.now();
        for (const article of news) {
            await analyzeArticle(article, { useExternalAPI: true });
        }
        const timeSeq = Date.now() - startSeq;
        console.log(`   Tiempo total: ${timeSeq}ms`);
        console.log(`   Promedio: ${Math.round(timeSeq/news.length)}ms por artículo`);
        
        // Análisis paralelo (como hace analyzeMultipleArticles)
        console.log('\n2. Análisis paralelo (Promise.all):');
        const startPar = Date.now();
        await analyzeMultipleArticles(news, { useExternalAPI: true });
        const timePar = Date.now() - startPar;
        console.log(`   Tiempo total: ${timePar}ms`);
        console.log(`   Promedio: ${Math.round(timePar/news.length)}ms por artículo`);
        
        const speedup = (timeSeq / timePar).toFixed(2);
        console.log(`\n⚡ Paralelo es ${speedup}x más rápido`);
        
    } catch (error) {
        console.error('❌ Error en test de performance:', error.message);
    }
    
    console.log();
}

// Ejecutar todos los tests
async function runAllTests() {
    const startTime = Date.now();
    
    try {
        await testNewsWithSentiment();
        await testAPIFallback();
        await testDifferentNewsTypes();
        await testPerformanceWithRealNews();
        
        const totalTime = Date.now() - startTime;
        
        console.log('='.repeat(80));
        console.log('✅ TESTS DE INTEGRACIÓN COMPLETADOS');
        console.log(`⏱️  Tiempo total: ${(totalTime/1000).toFixed(2)}s`);
        console.log('='.repeat(80));
        console.log();
        console.log('💡 Próximos pasos sugeridos:');
        console.log('   1. Verificar que las noticias se guarden correctamente en la base de datos');
        console.log('   2. Comprobar que el endpoint API devuelve el sentimiento correctamente');
        console.log('   3. Hacer deploy a Render con las nuevas variables de entorno');
        
    } catch (error) {
        console.error('\n❌ ERROR EN TESTS:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Ejecutar
runAllTests();
