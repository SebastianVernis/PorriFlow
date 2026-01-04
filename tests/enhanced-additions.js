// ===== ADDITIONAL FEATURES FOR OPI-ENHANCED.HTML =====
// Copy these functions into opi-enhanced.html after the existing script section

// ===== STOCK REFERENCE DATA =====
const stockRef = {
    // Tecnología & AI
    "AVGO": { beta: 1.15, dgr: 18.5, yield: 1.4, sector: 'Tecnología/AI', name: 'Broadcom Inc.' },
    "AAPL": { beta: 1.24, dgr: 7.5, yield: 0.5, sector: 'Tecnología', name: 'Apple Inc.' },
    "MSFT": { beta: 0.89, dgr: 10.2, yield: 0.8, sector: 'Tecnología', name: 'Microsoft Corp.' },
    "NVDA": { beta: 1.68, dgr: 15.2, yield: 0.03, sector: 'Tecnología/AI', name: 'NVIDIA Corp.' },
    "GOOGL": { beta: 1.05, dgr: 0.0, yield: 0.0, sector: 'Tecnología', name: 'Alphabet Inc.' },
    
    // Salud
    "JNJ": { beta: 0.54, dgr: 5.8, yield: 3.0, sector: 'Salud', name: 'Johnson & Johnson' },
    "ABBV": { beta: 0.58, dgr: 12.4, yield: 3.4, sector: 'Salud', name: 'AbbVie Inc.' },
    "UNH": { beta: 0.75, dgr: 12.8, yield: 1.3, sector: 'Salud', name: 'UnitedHealth Group' },
    
    // Finanzas
    "JPM": { beta: 1.12, dgr: 8.5, yield: 2.4, sector: 'Finanzas', name: 'JPMorgan Chase & Co.' },
    "MA": { beta: 1.02, dgr: 18.2, yield: 0.5, sector: 'Finanzas', name: 'Mastercard Inc.' },
    
    // Energía
    "XOM": { beta: 1.02, dgr: 3.8, yield: 3.6, sector: 'Energía', name: 'Exxon Mobil Corp.' },
    "CVX": { beta: 0.95, dgr: 6.2, yield: 3.4, sector: 'Energía', name: 'Chevron Corp.' }
};

// ===== PRICE LOADING WITH MARKETSTACK =====
async function preloadStockPrices() {
    const tickers = Object.keys(stockRef);
    const now = Date.now();
    const cacheExpiry = 15 * 60 * 1000;
    
    if (cachedPrices.timestamp && (now - cachedPrices.timestamp) < cacheExpiry) {
        console.log('✅ Usando precios en caché');
        return;
    }

    console.log('🚀 Cargando precios con Marketstack...');
    
    const newCache = { timestamp: now, prices: cachedPrices.prices || {} };
    const batchSize = 50;
    
    for (let i = 0; i < tickers.length; i += batchSize) {
        const batch = tickers.slice(i, i + batchSize);
        const tickerString = batch.join(',');
        
        try {
            const res = await fetch(
                `http://api.marketstack.com/v1/eod/latest?access_key=${MARKETSTACK_KEY}&symbols=${tickerString}&limit=1`
            );
            const data = await res.json();
            
            if (data.data && Array.isArray(data.data)) {
                data.data.forEach(quote => {
                    newCache.prices[quote.symbol] = parseFloat(quote.close || quote.open);
                });
            }
            
            cachedPrices = newCache;
            localStorage.setItem('sv_cached_prices', JSON.stringify(cachedPrices));
            
            if (i + batchSize < tickers.length) {
                await new Promise(r => setTimeout(r, 1000));
            }
        } catch (e) {
            console.error('Error cargando precios:', e);
        }
    }
    
    console.log(`✅ ${Object.keys(newCache.prices).length}/${tickers.length} precios cargados`);
}

// ===== AUTO-UPDATE PRICES =====
async function updateCurrentPortfolioPrices() {
    const portfolio = getCurrentPortfolio();
    const tickers = portfolio.positions.map(p => p.ticker).join(',');
    
    if (!tickers) return;
    
    try {
        const res = await fetch(
            `http://api.marketstack.com/v1/eod/latest?access_key=${MARKETSTACK_KEY}&symbols=${tickers}&limit=1`
        );
        const data = await res.json();
        
        if (data.data) {
            data.data.forEach(quote => {
                const pos = portfolio.positions.find(p => p.ticker === quote.symbol);
                if (pos) {
                    pos.currentPrice = parseFloat(quote.close || quote.open);
                }
            });
            
            savePortfolios();
            renderPortfolio();
            updateAllCharts();
        }
    } catch (e) {
        console.error('Error actualizando precios:', e);
    }
}

// ===== ENHANCED ADD POSITION =====
// Override the form submit to enrich with stockRef data
const originalSubmit = document.getElementById('add-position-form').onsubmit;
document.getElementById('add-position-form').onsubmit = (e) => {
    e.preventDefault();
    const ticker = document.getElementById('add-ticker').value.toUpperCase();
    const shares = parseFloat(document.getElementById('add-shares').value);
    const cost = parseFloat(document.getElementById('add-cost').value);
    
    const ref = stockRef[ticker];
    const portfolio = getCurrentPortfolio();
    
    portfolio.positions.push({
        ticker,
        shares,
        avgCost: cost,
        currentPrice: cachedPrices.prices?.[ticker] || cost,
        beta: ref?.beta || 1.0,
        dgr: ref?.dgr || 5.0,
        dividendYield: ref?.yield || 2.0,
        sector: ref?.sector || 'Other',
        name: ref?.name || ticker
    });
    
    savePortfolios();
    renderPortfolio();
    updateAllCharts();
    toggleModal();
    e.target.reset();
};

// ===== COMPARISON FEATURES =====
function updateComparison() {
    const allPortfolios = Object.entries(portfolios);
    const comparisonHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-slate-100">
                    <tr>
                        <th class="p-3 text-left">Portafolio</th>
                        <th class="p-3 text-right">Valor</th>
                        <th class="p-3 text-right">Posiciones</th>
                        <th class="p-3 text-right">Beta</th>
                        <th class="p-3 text-right">Sharpe</th>
                        <th class="p-3 text-right">Retorno</th>
                    </tr>
                </thead>
                <tbody>
                    ${allPortfolios.map(([id, pf]) => {
                        const total = pf.positions.reduce((sum, p) => sum + (p.shares * p.currentPrice), 0);
                        const avgBeta = total > 0 ? pf.positions.reduce((sum, p) => sum + (p.beta * p.shares * p.currentPrice), 0) / total : 0;
                        const totalReturn = total > 0 ? pf.positions.reduce((sum, p) => {
                            const gain = ((p.currentPrice - p.avgCost) / p.avgCost * 100) * (p.shares * p.currentPrice / total);
                            return sum + gain;
                        }, 0) : 0;
                        const sharpe = ((20 - 4.5) / (avgBeta * 15)).toFixed(2);
                        
                        return `
                            <tr class="border-b hover:bg-slate-50 ${id === currentPortfolioId ? 'bg-indigo-50' : ''}">
                                <td class="p-3 font-bold">${pf.name}</td>
                                <td class="p-3 text-right">$${total.toLocaleString()}</td>
                                <td class="p-3 text-right">${pf.positions.length}</td>
                                <td class="p-3 text-right">${avgBeta.toFixed(2)}</td>
                                <td class="p-3 text-right">${sharpe}</td>
                                <td class="p-3 text-right ${totalReturn >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
                                    ${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}%
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('comparison-content').innerHTML = comparisonHTML;
}

// Add to switchTab function for comparison tab
// if (tabName === 'comparison') updateComparison();
