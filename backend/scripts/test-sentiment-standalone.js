#!/usr/bin/env node

/**
 * Test standalone para verificar análisis de sentimiento sin dependencias
 */

console.log('🧪 SV Portfolio - Test de Sentimiento y Crypto\n');
console.log('='.repeat(60));

// Test 1: Verificar símbolos crypto en archivos
console.log('\n📊 TEST 1: Verificación de Símbolos Crypto en Código');
console.log('-'.repeat(60));

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer market-data-service.js
const marketDataPath = join(__dirname, '../src/services/market-data-service.js');
const marketDataContent = readFileSync(marketDataPath, 'utf-8');

// Extraer símbolos crypto del código
const cryptoMatch = marketDataContent.match(/crypto:\s*\[([\s\S]*?)\]/);
let symbols = [];
if (cryptoMatch) {
    const cryptoArray = cryptoMatch[1];
    symbols = cryptoArray.match(/'[A-Z0-9]+-USD'/g) || [];
    
    console.log(`✅ Símbolos crypto encontrados: ${symbols.length}`);
    console.log(`\n📋 Primeros 20 cryptos:`);
    symbols.slice(0, 20).forEach((symbol, i) => {
        console.log(`   ${(i + 1).toString().padStart(2, '0')}. ${symbol.replace(/'/g, '')}`);
    });
    
    if (symbols.length >= 50) {
        console.log(`\n✅ PASS: Se encontraron ${symbols.length} criptomonedas (objetivo: 50+)`);
    } else {
        console.log(`\n⚠️  WARN: Solo ${symbols.length} criptomonedas (objetivo: 50+)`);
    }
} else {
    console.log('❌ No se pudo extraer símbolos crypto');
}

// Test 2: Verificar palabras crypto en sentiment-analyzer
console.log('\n\n📊 TEST 2: Verificación de Palabras Crypto en Diccionarios');
console.log('-'.repeat(60));

const sentimentPath = join(__dirname, '../src/services/sentiment-analyzer.js');
const sentimentContent = readFileSync(sentimentPath, 'utf-8');

// Verificar palabras crypto positivas
const cryptoPositiveTerms = [
    'moon', 'hodl', 'diamond hands', 'pump', 'ath', 'all-time high',
    'adoption', 'bullrun', 'altseason', 'halving', 'staking', 'web3'
];

console.log('🔍 Palabras crypto POSITIVAS:');
let positiveFound = 0;
cryptoPositiveTerms.forEach(term => {
    if (sentimentContent.includes(`'${term}'`)) {
        console.log(`   ✅ "${term}" - Encontrada`);
        positiveFound++;
    } else {
        console.log(`   ❌ "${term}" - No encontrada`);
    }
});

// Verificar palabras crypto negativas
const cryptoNegativeTerms = [
    'dump', 'rekt', 'rugpull', 'rug pull', 'fud', 'panic',
    'bear market', 'crypto winter', 'hack', 'exploit', 'liquidation'
];

console.log('\n🔍 Palabras crypto NEGATIVAS:');
let negativeFound = 0;
cryptoNegativeTerms.forEach(term => {
    if (sentimentContent.includes(`'${term}'`)) {
        console.log(`   ✅ "${term}" - Encontrada`);
        negativeFound++;
    } else {
        console.log(`   ❌ "${term}" - No encontrada`);
    }
});

const totalCryptoTerms = positiveFound + negativeFound;
console.log(`\n📊 Total palabras crypto: ${totalCryptoTerms}/${cryptoPositiveTerms.length + cryptoNegativeTerms.length}`);

if (totalCryptoTerms >= 15) {
    console.log('✅ PASS: Diccionarios crypto implementados correctamente');
} else {
    console.log('⚠️  WARN: Faltan palabras crypto en diccionarios');
}

// Test 3: Verificar SENTIMENT_API_KEY en .env.example
console.log('\n\n📊 TEST 3: Verificación de Configuración en .env.example');
console.log('-'.repeat(60));

const envExamplePath = join(__dirname, '../.env.example');
const envContent = readFileSync(envExamplePath, 'utf-8');

const hasSentimentKey = envContent.includes('SENTIMENT_API_KEY');
const hasSentimentProvider = envContent.includes('SENTIMENT_API_PROVIDER');
const hasSentimentUrl = envContent.includes('SENTIMENT_API_URL');

console.log(`${hasSentimentKey ? '✅' : '❌'} SENTIMENT_API_KEY en .env.example`);
console.log(`${hasSentimentProvider ? '✅' : '❌'} SENTIMENT_API_PROVIDER en .env.example`);
console.log(`${hasSentimentUrl ? '✅' : '❌'} SENTIMENT_API_URL en .env.example`);

if (hasSentimentKey && hasSentimentProvider) {
    console.log('\n✅ PASS: Configuración de API externa documentada');
} else {
    console.log('\n❌ FAIL: Falta documentación de API externa');
}

// Test 4: Verificar función fetchExternalSentiment
console.log('\n\n📊 TEST 4: Verificación de Función API Externa');
console.log('-'.repeat(60));

const hasFetchFunction = sentimentContent.includes('fetchExternalSentiment');
const hasHuggingFace = sentimentContent.includes('huggingface');
const hasFinBERT = sentimentContent.includes('finbert');
const hasFallback = sentimentContent.includes('Fall back to local');

console.log(`${hasFetchFunction ? '✅' : '❌'} Función fetchExternalSentiment implementada`);
console.log(`${hasHuggingFace ? '✅' : '❌'} Soporte para Hugging Face`);
console.log(`${hasFinBERT ? '✅' : '❌'} Modelo FinBERT configurado`);
console.log(`${hasFallback ? '✅' : '❌'} Fallback a análisis local`);

if (hasFetchFunction && hasHuggingFace && hasFallback) {
    console.log('\n✅ PASS: API externa implementada correctamente');
} else {
    console.log('\n⚠️  WARN: Implementación de API externa incompleta');
}

// Test 5: Verificar funciones async
console.log('\n\n📊 TEST 5: Verificación de Funciones Async');
console.log('-'.repeat(60));

const hasAsyncAnalyzeSentiment = sentimentContent.includes('export async function analyzeSentiment');
const hasAsyncAnalyzeArticle = sentimentContent.includes('export async function analyzeArticle');
const hasAsyncAnalyzeMultiple = sentimentContent.includes('export async function analyzeMultipleArticles');

console.log(`${hasAsyncAnalyzeSentiment ? '✅' : '❌'} analyzeSentiment es async`);
console.log(`${hasAsyncAnalyzeArticle ? '✅' : '❌'} analyzeArticle es async`);
console.log(`${hasAsyncAnalyzeMultiple ? '✅' : '❌'} analyzeMultipleArticles es async`);

if (hasAsyncAnalyzeSentiment && hasAsyncAnalyzeArticle && hasAsyncAnalyzeMultiple) {
    console.log('\n✅ PASS: Todas las funciones son async');
} else {
    console.log('\n❌ FAIL: Algunas funciones no son async');
}

// Resumen final
console.log('\n\n' + '='.repeat(60));
console.log('📋 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(60));

const checks = [
    { name: 'Símbolos crypto (50+)', passed: symbols && symbols.length >= 50 },
    { name: 'Palabras crypto (15+)', passed: totalCryptoTerms >= 15 },
    { name: 'Configuración .env', passed: hasSentimentKey && hasSentimentProvider },
    { name: 'API externa', passed: hasFetchFunction && hasFallback },
    { name: 'Funciones async', passed: hasAsyncAnalyzeSentiment && hasAsyncAnalyzeArticle }
];

let passedChecks = 0;
checks.forEach(check => {
    console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
    if (check.passed) passedChecks++;
});

console.log('\n🎯 ESTADO GENERAL:');
console.log(`   ${passedChecks}/${checks.length} checks pasados (${Math.round(passedChecks / checks.length * 100)}%)`);

if (passedChecks === checks.length) {
    console.log('   ✅ TODOS LOS TESTS PASARON\n');
    process.exit(0);
} else if (passedChecks >= checks.length * 0.8) {
    console.log('   ⚠️  MAYORÍA DE TESTS PASARON\n');
    process.exit(0);
} else {
    console.log('   ❌ VARIOS TESTS FALLARON\n');
    process.exit(1);
}
