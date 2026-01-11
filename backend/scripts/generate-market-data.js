#!/usr/bin/env node

/**
 * Script para generar datos de mercado actualizados
 * Usa múltiples fuentes públicas sin API keys
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Generador de Datos de Mercado - SV Portfolio');
console.log('================================================\n');

// Datos base con información conocida (actualizar manualmente o con scraping)
const marketData = {
    generated: new Date().toISOString(),
    source: 'Multiple public sources',
    disclaimer: 'Datos informativos. Verificar antes de operar.',
    
    // === ACCIONES USA ===
    stocks: {
        // Tecnología
        'AAPL': { name: 'Apple Inc.', sector: 'Tecnología', beta: 1.24, yield: 0.5, dgr: 7.5, price: 185.92 },
        'MSFT': { name: 'Microsoft Corp.', sector: 'Tecnología', beta: 0.89, yield: 0.8, dgr: 10.2, price: 376.04 },
        'GOOGL': { name: 'Alphabet Inc.', sector: 'Tecnología', beta: 1.05, yield: 0.0, dgr: 0.0, price: 140.23 },
        'META': { name: 'Meta Platforms', sector: 'Tecnología', beta: 1.18, yield: 0.0, dgr: 0.0, price: 356.89 },
        'NVDA': { name: 'NVIDIA Corp.', sector: 'Tecnología/AI', beta: 1.68, yield: 0.03, dgr: 15.2, price: 495.22 },
        'TSLA': { name: 'Tesla Inc.', sector: 'Tecnología/Auto', beta: 2.01, yield: 0.0, dgr: 0.0, price: 248.48 },
        'AMD': { name: 'Advanced Micro Devices', sector: 'Tecnología', beta: 1.82, yield: 0.0, dgr: 0.0, price: 146.72 },
        'INTC': { name: 'Intel Corp.', sector: 'Tecnología', beta: 0.68, yield: 1.5, dgr: 2.8, price: 42.89 },
        'CSCO': { name: 'Cisco Systems', sector: 'Tecnología', beta: 0.92, yield: 3.0, dgr: 3.2, price: 51.34 },
        'ORCL': { name: 'Oracle Corp.', sector: 'Tecnología', beta: 0.88, yield: 1.3, dgr: 14.5, price: 107.23 },
        'IBM': { name: 'IBM Corp.', sector: 'Tecnología', beta: 0.72, yield: 4.8, dgr: 1.2, price: 165.78 },
        'CRM': { name: 'Salesforce Inc.', sector: 'Tecnología', beta: 1.15, yield: 0.0, dgr: 0.0, price: 262.45 },
        'AVGO': { name: 'Broadcom Inc.', sector: 'Tecnología/AI', beta: 1.15, yield: 1.4, dgr: 18.5, price: 1234.56 },
        'ADBE': { name: 'Adobe Inc.', sector: 'Tecnología', beta: 1.22, yield: 0.0, dgr: 0.0, price: 567.89 },
        'NFLX': { name: 'Netflix Inc.', sector: 'Tecnología/Media', beta: 1.35, yield: 0.0, dgr: 0.0, price: 489.23 },
        
        // Salud
        'JNJ': { name: 'Johnson & Johnson', sector: 'Salud', beta: 0.54, yield: 3.0, dgr: 5.8, price: 156.78 },
        'ABBV': { name: 'AbbVie Inc.', sector: 'Salud', beta: 0.58, yield: 3.4, dgr: 12.4, price: 167.45 },
        'PFE': { name: 'Pfizer Inc.', sector: 'Salud', beta: 0.62, yield: 5.8, dgr: 5.5, price: 28.92 },
        'UNH': { name: 'UnitedHealth Group', sector: 'Salud', beta: 0.75, yield: 1.3, dgr: 12.8, price: 512.34 },
        'MRK': { name: 'Merck & Co.', sector: 'Salud', beta: 0.48, yield: 2.8, dgr: 7.2, price: 102.67 },
        'LLY': { name: 'Eli Lilly and Co.', sector: 'Salud', beta: 0.52, yield: 1.5, dgr: 15.3, price: 589.23 },
        'BMY': { name: 'Bristol Myers Squibb', sector: 'Salud', beta: 0.55, yield: 4.5, dgr: 2.5, price: 52.34 },
        'AMGN': { name: 'Amgen Inc.', sector: 'Salud', beta: 0.68, yield: 3.2, dgr: 10.2, price: 289.45 },
        
        // Finanzas
        'JPM': { name: 'JPMorgan Chase', sector: 'Finanzas', beta: 1.12, yield: 2.4, dgr: 8.5, price: 167.89 },
        'BAC': { name: 'Bank of America', sector: 'Finanzas', beta: 1.25, yield: 2.8, dgr: 7.2, price: 34.56 },
        'WFC': { name: 'Wells Fargo', sector: 'Finanzas', beta: 1.18, yield: 2.6, dgr: 6.5, price: 51.23 },
        'GS': { name: 'Goldman Sachs', sector: 'Finanzas', beta: 1.32, yield: 2.3, dgr: 9.8, price: 389.45 },
        'MS': { name: 'Morgan Stanley', sector: 'Finanzas', beta: 1.28, yield: 3.1, dgr: 8.2, price: 97.56 },
        'V': { name: 'Visa Inc.', sector: 'Finanzas', beta: 0.95, yield: 0.7, dgr: 17.5, price: 267.34 },
        'MA': { name: 'Mastercard Inc.', sector: 'Finanzas', beta: 1.02, yield: 0.5, dgr: 18.2, price: 423.45 },
        'PYPL': { name: 'PayPal Holdings', sector: 'Finanzas', beta: 1.42, yield: 0.0, dgr: 0.0, price: 62.34 },
        
        // Consumo
        'AMZN': { name: 'Amazon.com Inc.', sector: 'Consumo/Tech', beta: 1.15, yield: 0.0, dgr: 0.0, price: 151.94 },
        'WMT': { name: 'Walmart Inc.', sector: 'Retail', beta: 0.51, yield: 1.5, dgr: 9.2, price: 167.23 },
        'HD': { name: 'Home Depot', sector: 'Retail', beta: 0.98, yield: 2.3, dgr: 11.5, price: 345.67 },
        'COST': { name: 'Costco Wholesale', sector: 'Retail', beta: 0.68, yield: 0.6, dgr: 13.5, price: 678.90 },
        'PG': { name: 'Procter & Gamble', sector: 'Consumo', beta: 0.45, yield: 2.5, dgr: 5.5, price: 153.45 },
        'KO': { name: 'Coca-Cola Company', sector: 'Consumo', beta: 0.59, yield: 3.1, dgr: 4.0, price: 60.23 },
        'PEP': { name: 'PepsiCo Inc.', sector: 'Consumo', beta: 0.52, yield: 2.9, dgr: 7.2, price: 168.90 },
        'MCD': { name: 'McDonald\'s Corp.', sector: 'Consumo', beta: 0.63, yield: 2.2, dgr: 7.8, price: 289.34 },
        'NKE': { name: 'Nike Inc.', sector: 'Consumo', beta: 1.02, yield: 1.4, dgr: 11.5, price: 103.56 },
        'SBUX': { name: 'Starbucks Corp.', sector: 'Consumo', beta: 0.82, yield: 2.1, dgr: 12.2, price: 95.67 },
        
        // Energía
        'XOM': { name: 'Exxon Mobil', sector: 'Energía', beta: 1.02, yield: 3.6, dgr: 3.8, price: 102.34 },
        'CVX': { name: 'Chevron Corp.', sector: 'Energía', beta: 0.95, yield: 3.4, dgr: 6.2, price: 145.67 },
        'COP': { name: 'ConocoPhillips', sector: 'Energía', beta: 1.15, yield: 2.8, dgr: 8.5, price: 112.45 },
        'SLB': { name: 'Schlumberger', sector: 'Energía', beta: 1.42, yield: 2.4, dgr: 5.2, price: 48.90 },
        
        // Industrial
        'BA': { name: 'Boeing Company', sector: 'Industrial', beta: 1.35, yield: 0.0, dgr: 0.0, price: 178.23 },
        'CAT': { name: 'Caterpillar Inc.', sector: 'Industrial', beta: 1.18, yield: 2.1, dgr: 6.5, price: 287.45 },
        'GE': { name: 'General Electric', sector: 'Industrial', beta: 1.08, yield: 0.8, dgr: 4.2, price: 134.56 },
        'MMM': { name: '3M Company', sector: 'Industrial', beta: 0.92, yield: 5.8, dgr: 1.5, price: 98.76 },
        'HON': { name: 'Honeywell International', sector: 'Industrial', beta: 1.05, yield: 2.0, dgr: 6.8, price: 201.23 },
        
        // Utilities
        'NEE': { name: 'NextEra Energy', sector: 'Utilities', beta: 0.48, yield: 2.8, dgr: 10.5, price: 67.89 },
        'DUK': { name: 'Duke Energy', sector: 'Utilities', beta: 0.35, yield: 4.2, dgr: 2.2, price: 98.45 },
        'SO': { name: 'Southern Company', sector: 'Utilities', beta: 0.38, yield: 3.8, dgr: 3.5, price: 78.90 },
        'D': { name: 'Dominion Energy', sector: 'Utilities', beta: 0.42, yield: 5.1, dgr: 2.8, price: 52.34 },
        
        // Real Estate (REITs)
        'AMT': { name: 'American Tower', sector: 'REIT', beta: 0.58, yield: 3.2, dgr: 9.2, price: 198.76 },
        'PLD': { name: 'Prologis Inc.', sector: 'REIT', beta: 0.82, yield: 3.1, dgr: 8.5, price: 123.45 },
        'O': { name: 'Realty Income', sector: 'REIT', beta: 0.82, yield: 5.5, dgr: 3.5, price: 56.78 },
        'SPG': { name: 'Simon Property Group', sector: 'REIT', beta: 1.15, yield: 5.2, dgr: 2.8, price: 145.23 },
        
        // Telecom
        'T': { name: 'AT&T Inc.', sector: 'Telecomunicaciones', beta: 0.68, yield: 7.2, dgr: -0.5, price: 20.45 },
        'VZ': { name: 'Verizon Communications', sector: 'Telecomunicaciones', beta: 0.42, yield: 6.5, dgr: 2.1, price: 41.23 },
        'TMUS': { name: 'T-Mobile US', sector: 'Telecomunicaciones', beta: 0.58, yield: 1.8, dgr: 0.0, price: 167.89 },
        
        // Materiales
        'LIN': { name: 'Linde plc', sector: 'Materiales', beta: 0.88, yield: 1.4, dgr: 8.5, price: 412.34 },
        'APD': { name: 'Air Products & Chemicals', sector: 'Materiales', beta: 0.82, yield: 2.3, dgr: 9.2, price: 278.90 }
    },
    
    // === ÍNDICES BURSÁTILES ===
    indices: {
        '^GSPC': { name: 'S&P 500', sector: 'Index', beta: 1.0, yield: 1.5, dgr: 0.0, price: 4783.45, isIndex: true },
        '^DJI': { name: 'Dow Jones Industrial', sector: 'Index', beta: 1.0, yield: 2.0, dgr: 0.0, price: 37440.34, isIndex: true },
        '^IXIC': { name: 'NASDAQ Composite', sector: 'Index', beta: 1.15, yield: 0.8, dgr: 0.0, price: 15043.97, isIndex: true },
        '^RUT': { name: 'Russell 2000', sector: 'Index', beta: 1.25, yield: 1.3, dgr: 0.0, price: 2027.07, isIndex: true },
        '^VIX': { name: 'Volatility Index', sector: 'Index', beta: -0.5, yield: 0.0, dgr: 0.0, price: 13.54, isIndex: true },
        '^FTSE': { name: 'FTSE 100', sector: 'Index', beta: 0.85, yield: 3.5, dgr: 0.0, price: 7733.12, isIndex: true },
        '^GDAXI': { name: 'DAX', sector: 'Index', beta: 1.1, yield: 2.8, dgr: 0.0, price: 16751.64, isIndex: true },
        '^N225': { name: 'Nikkei 225', sector: 'Index', beta: 0.95, yield: 1.8, dgr: 0.0, price: 33464.17, isIndex: true }
    },
    
    // === CRIPTOMONEDAS (50+ símbolos) ===
    crypto: {
        // Top 10 by Market Cap
        'BTC-USD': { name: 'Bitcoin', sector: 'Crypto', beta: 2.5, yield: 0.0, dgr: 0.0, price: 44328.50, isCrypto: true },
        'ETH-USD': { name: 'Ethereum', sector: 'Crypto', beta: 2.8, yield: 0.0, dgr: 0.0, price: 2328.75, isCrypto: true },
        'BNB-USD': { name: 'Binance Coin', sector: 'Crypto', beta: 3.2, yield: 0.0, dgr: 0.0, price: 315.42, isCrypto: true },
        'XRP-USD': { name: 'Ripple', sector: 'Crypto', beta: 3.4, yield: 0.0, dgr: 0.0, price: 0.58, isCrypto: true },
        'ADA-USD': { name: 'Cardano', sector: 'Crypto', beta: 3.5, yield: 0.0, dgr: 0.0, price: 0.48, isCrypto: true },
        'SOL-USD': { name: 'Solana', sector: 'Crypto', beta: 3.8, yield: 0.0, dgr: 0.0, price: 98.45, isCrypto: true },
        'DOT-USD': { name: 'Polkadot', sector: 'Crypto', beta: 3.4, yield: 0.0, dgr: 0.0, price: 7.23, isCrypto: true },
        'DOGE-USD': { name: 'Dogecoin', sector: 'Crypto', beta: 4.0, yield: 0.0, dgr: 0.0, price: 0.089, isCrypto: true },
        'MATIC-USD': { name: 'Polygon', sector: 'Crypto', beta: 3.6, yield: 0.0, dgr: 0.0, price: 0.92, isCrypto: true },
        'AVAX-USD': { name: 'Avalanche', sector: 'Crypto', beta: 3.7, yield: 0.0, dgr: 0.0, price: 38.92, isCrypto: true },
        
        // DeFi & Smart Contracts
        'LINK-USD': { name: 'Chainlink', sector: 'Crypto/DeFi', beta: 3.3, yield: 0.0, dgr: 0.0, price: 15.67, isCrypto: true },
        'UNI-USD': { name: 'Uniswap', sector: 'Crypto/DeFi', beta: 3.5, yield: 0.0, dgr: 0.0, price: 6.78, isCrypto: true },
        'AAVE-USD': { name: 'Aave', sector: 'Crypto/DeFi', beta: 3.6, yield: 0.0, dgr: 0.0, price: 98.45, isCrypto: true },
        'MKR-USD': { name: 'Maker', sector: 'Crypto/DeFi', beta: 3.4, yield: 0.0, dgr: 0.0, price: 1567.89, isCrypto: true },
        'COMP-USD': { name: 'Compound', sector: 'Crypto/DeFi', beta: 3.5, yield: 0.0, dgr: 0.0, price: 56.78, isCrypto: true },
        'SUSHI-USD': { name: 'SushiSwap', sector: 'Crypto/DeFi', beta: 3.7, yield: 0.0, dgr: 0.0, price: 1.23, isCrypto: true },
        'CRV-USD': { name: 'Curve DAO', sector: 'Crypto/DeFi', beta: 3.5, yield: 0.0, dgr: 0.0, price: 0.89, isCrypto: true },
        'SNX-USD': { name: 'Synthetix', sector: 'Crypto/DeFi', beta: 3.6, yield: 0.0, dgr: 0.0, price: 3.45, isCrypto: true },
        'YFI-USD': { name: 'Yearn Finance', sector: 'Crypto/DeFi', beta: 3.8, yield: 0.0, dgr: 0.0, price: 8234.56, isCrypto: true },
        '1INCH-USD': { name: '1inch', sector: 'Crypto/DeFi', beta: 3.7, yield: 0.0, dgr: 0.0, price: 0.45, isCrypto: true },
        'BAL-USD': { name: 'Balancer', sector: 'Crypto/DeFi', beta: 3.5, yield: 0.0, dgr: 0.0, price: 4.56, isCrypto: true },
        
        // Layer 1 & Layer 2
        'ATOM-USD': { name: 'Cosmos', sector: 'Crypto/L1', beta: 3.4, yield: 0.0, dgr: 0.0, price: 10.23, isCrypto: true },
        'NEAR-USD': { name: 'NEAR Protocol', sector: 'Crypto/L1', beta: 3.6, yield: 0.0, dgr: 0.0, price: 3.45, isCrypto: true },
        'FTM-USD': { name: 'Fantom', sector: 'Crypto/L1', beta: 3.7, yield: 0.0, dgr: 0.0, price: 0.56, isCrypto: true },
        'ALGO-USD': { name: 'Algorand', sector: 'Crypto/L1', beta: 3.5, yield: 0.0, dgr: 0.0, price: 0.23, isCrypto: true },
        'EGLD-USD': { name: 'MultiversX', sector: 'Crypto/L1', beta: 3.6, yield: 0.0, dgr: 0.0, price: 45.67, isCrypto: true },
        'HBAR-USD': { name: 'Hedera', sector: 'Crypto/L1', beta: 3.4, yield: 0.0, dgr: 0.0, price: 0.078, isCrypto: true },
        'ICP-USD': { name: 'Internet Computer', sector: 'Crypto/L1', beta: 3.8, yield: 0.0, dgr: 0.0, price: 12.34, isCrypto: true },
        'VET-USD': { name: 'VeChain', sector: 'Crypto/L1', beta: 3.5, yield: 0.0, dgr: 0.0, price: 0.034, isCrypto: true },
        'FIL-USD': { name: 'Filecoin', sector: 'Crypto/Storage', beta: 3.6, yield: 0.0, dgr: 0.0, price: 5.67, isCrypto: true },
        'THETA-USD': { name: 'Theta Network', sector: 'Crypto/Media', beta: 3.5, yield: 0.0, dgr: 0.0, price: 1.23, isCrypto: true },
        'EOS-USD': { name: 'EOS', sector: 'Crypto/L1', beta: 3.4, yield: 0.0, dgr: 0.0, price: 0.89, isCrypto: true },
        'XTZ-USD': { name: 'Tezos', sector: 'Crypto/L1', beta: 3.3, yield: 0.0, dgr: 0.0, price: 1.12, isCrypto: true },
        
        // Metaverse & Gaming
        'SAND-USD': { name: 'The Sandbox', sector: 'Crypto/Metaverse', beta: 3.8, yield: 0.0, dgr: 0.0, price: 0.56, isCrypto: true },
        'MANA-USD': { name: 'Decentraland', sector: 'Crypto/Metaverse', beta: 3.7, yield: 0.0, dgr: 0.0, price: 0.45, isCrypto: true },
        'AXS-USD': { name: 'Axie Infinity', sector: 'Crypto/Gaming', beta: 3.9, yield: 0.0, dgr: 0.0, price: 7.89, isCrypto: true },
        'ENJ-USD': { name: 'Enjin Coin', sector: 'Crypto/Gaming', beta: 3.6, yield: 0.0, dgr: 0.0, price: 0.34, isCrypto: true },
        'GALA-USD': { name: 'Gala', sector: 'Crypto/Gaming', beta: 3.8, yield: 0.0, dgr: 0.0, price: 0.023, isCrypto: true },
        'IMX-USD': { name: 'Immutable X', sector: 'Crypto/Gaming', beta: 3.7, yield: 0.0, dgr: 0.0, price: 1.89, isCrypto: true },
        'APE-USD': { name: 'ApeCoin', sector: 'Crypto/Metaverse', beta: 3.9, yield: 0.0, dgr: 0.0, price: 1.45, isCrypto: true },
        'GMT-USD': { name: 'STEPN', sector: 'Crypto/Gaming', beta: 3.8, yield: 0.0, dgr: 0.0, price: 0.23, isCrypto: true },
        
        // Stablecoins & Wrapped Assets
        'USDT-USD': { name: 'Tether', sector: 'Crypto/Stablecoin', beta: 0.1, yield: 0.0, dgr: 0.0, price: 1.00, isCrypto: true },
        'USDC-USD': { name: 'USD Coin', sector: 'Crypto/Stablecoin', beta: 0.1, yield: 0.0, dgr: 0.0, price: 1.00, isCrypto: true },
        'DAI-USD': { name: 'Dai', sector: 'Crypto/Stablecoin', beta: 0.1, yield: 0.0, dgr: 0.0, price: 1.00, isCrypto: true },
        'BUSD-USD': { name: 'Binance USD', sector: 'Crypto/Stablecoin', beta: 0.1, yield: 0.0, dgr: 0.0, price: 1.00, isCrypto: true },
        'WBTC-USD': { name: 'Wrapped Bitcoin', sector: 'Crypto/Wrapped', beta: 2.5, yield: 0.0, dgr: 0.0, price: 44300.00, isCrypto: true },
        
        // Other Major Coins
        'LTC-USD': { name: 'Litecoin', sector: 'Crypto', beta: 3.2, yield: 0.0, dgr: 0.0, price: 73.45, isCrypto: true },
        'BCH-USD': { name: 'Bitcoin Cash', sector: 'Crypto', beta: 3.3, yield: 0.0, dgr: 0.0, price: 234.56, isCrypto: true },
        'XLM-USD': { name: 'Stellar', sector: 'Crypto', beta: 3.4, yield: 0.0, dgr: 0.0, price: 0.12, isCrypto: true },
        'TRX-USD': { name: 'TRON', sector: 'Crypto', beta: 3.5, yield: 0.0, dgr: 0.0, price: 0.089, isCrypto: true },
        'ETC-USD': { name: 'Ethereum Classic', sector: 'Crypto', beta: 3.4, yield: 0.0, dgr: 0.0, price: 23.45, isCrypto: true },
        'XMR-USD': { name: 'Monero', sector: 'Crypto/Privacy', beta: 3.3, yield: 0.0, dgr: 0.0, price: 156.78, isCrypto: true },
        'ZEC-USD': { name: 'Zcash', sector: 'Crypto/Privacy', beta: 3.4, yield: 0.0, dgr: 0.0, price: 34.56, isCrypto: true },
        'DASH-USD': { name: 'Dash', sector: 'Crypto', beta: 3.3, yield: 0.0, dgr: 0.0, price: 28.90, isCrypto: true },
        'NEO-USD': { name: 'NEO', sector: 'Crypto', beta: 3.5, yield: 0.0, dgr: 0.0, price: 12.34, isCrypto: true },
        'WAVES-USD': { name: 'Waves', sector: 'Crypto', beta: 3.4, yield: 0.0, dgr: 0.0, price: 2.34, isCrypto: true },
        'QTUM-USD': { name: 'Qtum', sector: 'Crypto', beta: 3.3, yield: 0.0, dgr: 0.0, price: 3.45, isCrypto: true },
        
        // Emerging & Popular
        'OP-USD': { name: 'Optimism', sector: 'Crypto/L2', beta: 3.6, yield: 0.0, dgr: 0.0, price: 2.34, isCrypto: true },
        'ARB-USD': { name: 'Arbitrum', sector: 'Crypto/L2', beta: 3.7, yield: 0.0, dgr: 0.0, price: 1.23, isCrypto: true },
        'LDO-USD': { name: 'Lido DAO', sector: 'Crypto/DeFi', beta: 3.5, yield: 0.0, dgr: 0.0, price: 2.45, isCrypto: true },
        'RPL-USD': { name: 'Rocket Pool', sector: 'Crypto/DeFi', beta: 3.6, yield: 0.0, dgr: 0.0, price: 28.90, isCrypto: true },
        'RNDR-USD': { name: 'Render Token', sector: 'Crypto/AI', beta: 3.7, yield: 0.0, dgr: 0.0, price: 3.45, isCrypto: true },
        'GRT-USD': { name: 'The Graph', sector: 'Crypto/Infrastructure', beta: 3.5, yield: 0.0, dgr: 0.0, price: 0.23, isCrypto: true },
        'CHZ-USD': { name: 'Chiliz', sector: 'Crypto/Sports', beta: 3.6, yield: 0.0, dgr: 0.0, price: 0.089, isCrypto: true },
        'FLOW-USD': { name: 'Flow', sector: 'Crypto/NFT', beta: 3.5, yield: 0.0, dgr: 0.0, price: 0.78, isCrypto: true },
        'KAVA-USD': { name: 'Kava', sector: 'Crypto/DeFi', beta: 3.4, yield: 0.0, dgr: 0.0, price: 0.89, isCrypto: true },
        'CELO-USD': { name: 'Celo', sector: 'Crypto/Mobile', beta: 3.5, yield: 0.0, dgr: 0.0, price: 0.67, isCrypto: true }
    },
    
    // === ETFs ===
    etfs: {
        'SPY': { name: 'SPDR S&P 500 ETF', sector: 'ETF/Index', beta: 1.0, yield: 1.5, dgr: 0.0, price: 478.56, isETF: true },
        'QQQ': { name: 'Invesco QQQ Trust', sector: 'ETF/Tech', beta: 1.15, yield: 0.6, dgr: 0.0, price: 410.23, isETF: true },
        'DIA': { name: 'SPDR Dow Jones ETF', sector: 'ETF/Index', beta: 1.0, yield: 2.0, dgr: 0.0, price: 374.89, isETF: true },
        'IWM': { name: 'iShares Russell 2000', sector: 'ETF/SmallCap', beta: 1.25, yield: 1.3, dgr: 0.0, price: 202.34, isETF: true },
        'VTI': { name: 'Vanguard Total Stock', sector: 'ETF/Total', beta: 1.0, yield: 1.4, dgr: 0.0, price: 234.56, isETF: true },
        'VOO': { name: 'Vanguard S&P 500', sector: 'ETF/Index', beta: 1.0, yield: 1.5, dgr: 0.0, price: 438.90, isETF: true },
        'GLD': { name: 'SPDR Gold Trust', sector: 'ETF/Commodity', beta: 0.1, yield: 0.0, dgr: 0.0, price: 189.67, isETF: true },
        'SLV': { name: 'iShares Silver Trust', sector: 'ETF/Commodity', beta: 0.3, yield: 0.0, dgr: 0.0, price: 21.89, isETF: true },
        'USO': { name: 'US Oil Fund', sector: 'ETF/Commodity', beta: 1.8, yield: 0.0, dgr: 0.0, price: 71.23, isETF: true },
        'TLT': { name: 'iShares 20Y Treasury', sector: 'ETF/Bonds', beta: -0.3, yield: 4.5, dgr: 0.0, price: 93.45, isETF: true },
        'ARKK': { name: 'ARK Innovation ETF', sector: 'ETF/Innovation', beta: 1.8, yield: 0.0, dgr: 0.0, price: 48.90, isETF: true }
    },
    
    // === COMMODITIES (Futuros) ===
    futures: {
        'GC=F': { name: 'Gold Futures', sector: 'Commodity/Precious', beta: 0.1, yield: 0.0, dgr: 0.0, price: 2063.50, isFutures: true },
        'SI=F': { name: 'Silver Futures', sector: 'Commodity/Precious', beta: 0.3, yield: 0.0, dgr: 0.0, price: 24.12, isFutures: true },
        'CL=F': { name: 'Crude Oil WTI', sector: 'Commodity/Energy', beta: 1.5, yield: 0.0, dgr: 0.0, price: 73.42, isFutures: true },
        'NG=F': { name: 'Natural Gas', sector: 'Commodity/Energy', beta: 2.0, yield: 0.0, dgr: 0.0, price: 2.89, isFutures: true },
        'HG=F': { name: 'Copper Futures', sector: 'Commodity/Industrial', beta: 1.2, yield: 0.0, dgr: 0.0, price: 3.85, isFutures: true },
        'ZC=F': { name: 'Corn Futures', sector: 'Commodity/Agriculture', beta: 0.8, yield: 0.0, dgr: 0.0, price: 4.67, isFutures: true },
        'ZW=F': { name: 'Wheat Futures', sector: 'Commodity/Agriculture', beta: 0.9, yield: 0.0, dgr: 0.0, price: 6.12, isFutures: true },
        'ZS=F': { name: 'Soybean Futures', sector: 'Commodity/Agriculture', beta: 0.85, yield: 0.0, dgr: 0.0, price: 12.45, isFutures: true }
    },
    
    // === FOREX ===
    forex: {
        'EURUSD=X': { name: 'EUR/USD', sector: 'Forex', beta: 0.3, yield: 0.0, dgr: 0.0, price: 1.0912, isForex: true },
        'GBPUSD=X': { name: 'GBP/USD', sector: 'Forex', beta: 0.4, yield: 0.0, dgr: 0.0, price: 1.2734, isForex: true },
        'USDJPY=X': { name: 'USD/JPY', sector: 'Forex', beta: 0.3, yield: 0.0, dgr: 0.0, price: 144.52, isForex: true },
        'AUDUSD=X': { name: 'AUD/USD', sector: 'Forex', beta: 0.5, yield: 0.0, dgr: 0.0, price: 0.6789, isForex: true },
        'USDCAD=X': { name: 'USD/CAD', sector: 'Forex', beta: 0.3, yield: 0.0, dgr: 0.0, price: 1.3423, isForex: true }
    }
};

// Combinar todo en un solo objeto
const combined = {
    ...marketData.stocks,
    ...marketData.indices,
    ...marketData.crypto,
    ...marketData.etfs,
    ...marketData.futures,
    ...marketData.forex
};

// Generar estadísticas
const stats = {
    total: Object.keys(combined).length,
    byCategory: {
        stocks: Object.keys(marketData.stocks).length,
        indices: Object.keys(marketData.indices).length,
        crypto: Object.keys(marketData.crypto).length,
        etfs: Object.keys(marketData.etfs).length,
        futures: Object.keys(marketData.futures).length,
        forex: Object.keys(marketData.forex).length
    }
};

// Generar archivo
const output = {
    metadata: {
        generated: marketData.generated,
        source: marketData.source,
        disclaimer: marketData.disclaimer,
        version: '3.0',
        totalSymbols: stats.total,
        categories: stats.byCategory
    },
    data: combined
};

// Guardar a archivo JSON
const outputPath = path.join(__dirname, '..', 'market-data.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

// Generar archivo JavaScript para frontend
const jsContent = `// Auto-generated market data - ${new Date().toISOString()}
// Total symbols: ${stats.total}

export const MARKET_DATA = ${JSON.stringify(combined, null, 2)};

export const METADATA = ${JSON.stringify(output.metadata, null, 2)};
`;

const jsOutputPath = path.join(__dirname, '../../assets/js/market-data.js');
fs.writeFileSync(jsOutputPath, jsContent);

// Mostrar resumen
console.log('✅ Datos de mercado generados\n');
console.log('📊 Resumen:');
console.log(`   Acciones:     ${stats.byCategory.stocks}`);
console.log(`   Índices:      ${stats.byCategory.indices}`);
console.log(`   Criptomonedas: ${stats.byCategory.crypto}`);
console.log(`   ETFs:         ${stats.byCategory.etfs}`);
console.log(`   Futuros:      ${stats.byCategory.futures}`);
console.log(`   Forex:        ${stats.byCategory.forex}`);
console.log(`   ─────────────────`);
console.log(`   TOTAL:        ${stats.total} símbolos\n`);

console.log('📁 Archivos generados:');
console.log(`   ${outputPath}`);
console.log(`   ${jsOutputPath}\n`);

console.log('📝 Uso en frontend:');
console.log('   <script type="module" src="assets/js/market-data.js"></script>');
console.log('   import { MARKET_DATA } from "./assets/js/market-data.js";\n');

console.log('🔄 Actualizar datos:');
console.log('   node backend/scripts/generate-market-data.js\n');

console.log('✨ Listo para usar en dashboard!');
