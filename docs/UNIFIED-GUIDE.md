# 🔗 Guía de Unificación - SV Dashboard v3.0 Unified

## 🎯 Estrategia de Unificación

Dados los dos archivos:
- **opi.html** (100KB, 1,887 líneas) - AI + News + Sentiment
- **opi-enhanced.html** (73KB, 1,249 líneas) - Multi-Portfolio + Analytics

**Decisión**: Crear **public/index.html** combinando lo mejor de ambos.

---

## ✅ Estado Actual (Ya Implementado)

### Estructura Base
- ✅ Header con selector de portafolio
- ✅ Sistema de tabs (4 secciones)
- ✅ KPIs expandidos (6 métricas)
- ✅ Modales: Portfolio Manager + Settings
- ✅ CSS optimizado con animaciones

### Funcionalidad Core (de opi.html)
- ✅ Todas las funciones AI y noticias
- ✅ Carga de precios Marketstack
- ✅ Cache inteligente
- ✅ Hover charts
- ✅ AI Portfolio Builder
- ✅ Análisis global

---

## 🔧 Integraciones Pendientes (Agregar al Script)

### 1. Sistema Multi-Portafolio

Agregar después de las variables globales (línea ~670):

```javascript
// --- MULTI-PORTFOLIO SYSTEM ---
let currentPortfolioId = 'default';
let portfolios = JSON.parse(localStorage.getItem('sv_portfolios_unified')) || {
    'default': {
        name: 'Portafolio Principal',
        positions: portfolio // Migrar portafolio existente
    }
};

let globalSettings = JSON.parse(localStorage.getItem('sv_global_settings')) || {
    riskFreeRate: 4.5,
    refreshInterval: 5,
    marketVolatility: 15,
    annualTarget: 20
};

// Funciones de gestión
function getCurrentPortfolio() {
    return portfolios[currentPortfolioId]?.positions || [];
}

function savePortfolios() {
    localStorage.setItem('sv_portfolios_unified', JSON.stringify(portfolios));
}

function switchPortfolio() {
    currentPortfolioId = document.getElementById('portfolio-selector').value;
    portfolio = getCurrentPortfolio();
    renderDashboard();
    updateAllVisualizations();
}

function loadPortfolioSelector() {
    const selector = document.getElementById('portfolio-selector');
    selector.innerHTML = '';
    Object.entries(portfolios).forEach(([id, pf]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = pf.name;
        if (id === currentPortfolioId) option.selected = true;
        selector.appendChild(option);
    });
}

function openPortfolioManager() {
    document.getElementById('portfolio-manager-modal').classList.remove('hidden');
    renderPortfolioList();
}

function closePortfolioManager() {
    document.getElementById('portfolio-manager-modal').classList.add('hidden');
}

function createNewPortfolio() {
    const name = document.getElementById('new-portfolio-name').value.trim();
    if (!name) {
        alert('Por favor ingresa un nombre');
        return;
    }
    
    const id = Date.now().toString();
    portfolios[id] = { name, positions: [] };
    savePortfolios();
    loadPortfolioSelector();
    renderPortfolioList();
    document.getElementById('new-portfolio-name').value = '';
    alert(`✅ Portafolio "${name}" creado`);
}

function deletePortfolio(id) {
    if (id === 'default') {
        alert('No puedes eliminar el portafolio principal');
        return;
    }
    
    if (confirm(`¿Eliminar portafolio "${portfolios[id].name}"?`)) {
        delete portfolios[id];
        if (currentPortfolioId === id) {
            currentPortfolioId = 'default';
        }
        savePortfolios();
        loadPortfolioSelector();
        renderPortfolioList();
        switchPortfolio();
    }
}

function renderPortfolioList() {
    const container = document.getElementById('portfolio-list-container');
    container.innerHTML = Object.entries(portfolios).map(([id, pf]) => `
        <div class="flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
            <div>
                <p class="font-bold text-slate-800">${pf.name}</p>
                <p class="text-xs text-slate-500">${pf.positions.length} posiciones | ${id === currentPortfolioId ? '⭐ Actual' : ''}</p>
            </div>
            <div class="flex gap-2">
                ${id !== currentPortfolioId ? `
                <button onclick="currentPortfolioId='${id}'; switchPortfolio(); closePortfolioManager()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700">
                    Seleccionar
                </button>
                ` : '<span class="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold">En uso</span>'}
                ${id !== 'default' ? `
                <button onclick="deletePortfolio('${id}')" class="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-700">
                    <i class="fa-solid fa-trash"></i>
                </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}
```

### 2. Sistema de Tabs

Agregar después de las funciones de portafolio:

```javascript
// --- TAB MANAGEMENT ---
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('[id^="tab-"]').forEach(el => {
        el.classList.remove('tab-active');
        el.classList.add('hover:bg-slate-50');
    });
    
    // Show selected tab
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    const activeTab = document.getElementById(`tab-${tabName}`);
    activeTab.classList.add('tab-active');
    activeTab.classList.remove('hover:bg-slate-50');
    
    // Update specific content
    if (tabName === 'projections') updateProjectionCharts();
    if (tabName === 'risk') updateRiskCharts();
    if (tabName === 'comparison') updateComparisonView();
}

// Initialize tabs on load
window.addEventListener('DOMContentLoaded', () => {
    switchTab('main');
});
```

### 3. Gráficos de Proyección Multi-Escenario

Agregar nueva función:

```javascript
// --- MULTI-SCENARIO PROJECTIONS ---
function updateAllProjections() {
    updateMultiScenarioChart();
    updateMonthlyBreakdownChart();
    updateHeaderStats(calculateCurrentStats());
}

function updateMultiScenarioChart() {
    const ctx = document.getElementById('multi-scenario-chart');
    if (!ctx) return;
    
    const total = portfolio.reduce((sum, p) => sum + (p.shares * p.currentPrice), 0);
    const annualTarget = parseFloat(document.getElementById('annual-target-input').value) / 100;
    const weeks = parseInt(document.getElementById('projection-weeks').value);
    
    // Calculate weekly rates
    const baseRate = Math.pow(1 + annualTarget, 1/52) - 1;
    const optRate = Math.pow(1 + annualTarget * 1.1, 1/52) - 1;
    const pesRate = Math.pow(1 + annualTarget * 0.9, 1/52) - 1;
    
    const labels = Array.from({length: weeks + 1}, (_, i) => i === 0 ? 'Hoy' : `Sem ${i}`);
    
    if (chartInstances.multiScenario) chartInstances.multiScenario.destroy();
    
    chartInstances.multiScenario = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: `Optimista (+${(annualTarget * 110).toFixed(0)}%)`,
                    data: Array.from({length: weeks + 1}, (_, i) => total * Math.pow(1 + optRate, i)),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4
                },
                {
                    label: `Base (${(annualTarget * 100).toFixed(0)}%)`,
                    data: Array.from({length: weeks + 1}, (_, i) => total * Math.pow(1 + baseRate, i)),
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: `Pesimista (${(annualTarget * 90).toFixed(0)}%)`,
                    data: Array.from({length: weeks + 1}, (_, i) => total * Math.pow(1 + pesRate, i)),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('en-US', {minimumFractionDigits: 2})}`
                    }
                }
            },
            scales: {
                y: {
                    ticks: { callback: v => '$' + v.toLocaleString() },
                    grid: { color: '#f1f5f9' }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 13,
                        callback: (val, index) => index % Math.ceil(weeks/12) === 0 ? labels[index] : ''
                    }
                }
            }
        }
    });
}

function updateMonthlyBreakdownChart() {
    const ctx = document.getElementById('monthly-breakdown-chart');
    if (!ctx) return;
    
    const total = portfolio.reduce((sum, p) => sum + (p.shares * p.currentPrice), 0);
    const annualTarget = parseFloat(document.getElementById('annual-target-input').value) / 100;
    const monthlyRate = Math.pow(1 + annualTarget, 1/12) - 1;
    
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const values = Array.from({length: 12}, (_, i) => total * Math.pow(1 + monthlyRate, i + 1));
    const gains = values.map(v => v - total);
    
    if (chartInstances.monthly) chartInstances.monthly.destroy();
    
    chartInstances.monthly = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Ganancia Proyectada',
                data: gains,
                backgroundColor: gains.map(g => g >= 0 ? '#10b981' : '#ef4444'),
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `$${ctx.parsed.y.toLocaleString('en-US', {minimumFractionDigits: 2})}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => '$' + v.toLocaleString() }
                }
            }
        }
    });
}
```

### 4. Gráficos de Riesgo

```javascript
// --- RISK CHARTS ---
function updateRiskCharts() {
    updateRiskMetrics();
    updateBetaDistributionChart();
    updateConcentrationRiskChart();
}

function updateRiskMetrics() {
    let total = 0;
    let weightedBeta = 0;
    
    portfolio.forEach(p => {
        const value = p.shares * p.currentPrice;
        total += value;
        weightedBeta += p.beta * value;
    });
    
    const avgBeta = total > 0 ? weightedBeta / total : 0;
    const volatility = avgBeta * globalSettings.marketVolatility;
    const annualReturn = globalSettings.annualTarget;
    
    const sharpe = ((annualReturn - globalSettings.riskFreeRate) / volatility).toFixed(2);
    const sortino = (sharpe * 1.4).toFixed(2); // Simplified
    const var95 = (total * 0.05 * avgBeta).toFixed(2);
    const maxDrawdown = (avgBeta * 8).toFixed(2);
    
    document.getElementById('risk-volatility').textContent = `${volatility.toFixed(2)}%`;
    document.getElementById('risk-sharpe').textContent = sharpe;
    document.getElementById('risk-sortino').textContent = sortino;
    document.getElementById('risk-var').textContent = `$${parseFloat(var95).toLocaleString()}`;
    
    // Update main KPIs too
    document.getElementById('sharpe-ratio').textContent = sharpe;
    document.getElementById('sharpe-status').textContent = sharpe > 1 ? 'Excelente' : sharpe > 0.5 ? 'Bueno' : 'Regular';
    document.getElementById('max-drawdown').textContent = `${maxDrawdown}%`;
}

function updateBetaDistributionChart() {
    const ctx = document.getElementById('beta-distribution-chart');
    if (!ctx) return;
    
    const ranges = {
        'Muy Bajo (<0.5)': 0,
        'Bajo (0.5-0.8)': 0,
        'Medio (0.8-1.2)': 0,
        'Alto (1.2-1.5)': 0,
        'Muy Alto (>1.5)': 0
    };
    
    portfolio.forEach(p => {
        const value = p.shares * p.currentPrice;
        if (p.beta < 0.5) ranges['Muy Bajo (<0.5)'] += value;
        else if (p.beta < 0.8) ranges['Bajo (0.5-0.8)'] += value;
        else if (p.beta < 1.2) ranges['Medio (0.8-1.2)'] += value;
        else if (p.beta < 1.5) ranges['Alto (1.2-1.5)'] += value;
        else ranges['Muy Alto (>1.5)'] += value;
    });
    
    if (chartInstances.betaDist) chartInstances.betaDist.destroy();
    
    chartInstances.betaDist = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: Object.keys(ranges),
            datasets: [{
                label: 'Valor ($)',
                data: Object.values(ranges),
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#991b1b'],
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `$${ctx.parsed.x.toLocaleString()}`
                    }
                }
            },
            scales: {
                x: { ticks: { callback: v => '$' + v.toLocaleString() } }
            }
        }
    });
}

function updateConcentrationRiskChart() {
    const ctx = document.getElementById('concentration-risk-chart');
    if (!ctx) return;
    
    let total = 0;
    const values = portfolio.map(p => {
        const value = p.shares * p.currentPrice;
        total += value;
        return { ticker: p.ticker, value };
    }).sort((a, b) => b.value - a.value);
    
    const topN = values.slice(0, 5);
    const othersValue = values.slice(5).reduce((sum, v) => sum + v.value, 0);
    
    const labels = topN.map(v => `${v.ticker} (${(v.value/total*100).toFixed(1)}%)`);
    const data = topN.map(v => v.value);
    
    if (othersValue > 0) {
        labels.push(`Otros (${(othersValue/total*100).toFixed(1)}%)`);
        data.push(othersValue);
    }
    
    if (chartInstances.concentration) chartInstances.concentration.destroy();
    
    chartInstances.concentration = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Valor',
                data: data,
                backgroundColor: data.map((v, i) => {
                    const pct = v / total * 100;
                    if (pct > 30) return '#ef4444'; // Danger
                    if (pct > 20) return '#f59e0b'; // Warning
                    return '#10b981'; // OK
                }),
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `$${ctx.parsed.y.toLocaleString()} (${(ctx.parsed.y/total*100).toFixed(1)}%)`
                    }
                }
            },
            scales: {
                y: { ticks: { callback: v => '$' + v.toLocaleString() } }
            }
        }
    });
}
```

### 5. Comparación de Portafolios

```javascript
// --- PORTFOLIO COMPARISON ---
function updateComparisonView() {
    const allPortfolios = Object.entries(portfolios);
    
    const html = `
        <div class="overflow-x-auto custom-scroll">
            <table class="w-full text-sm">
                <thead class="bg-slate-100">
                    <tr>
                        <th class="p-3 text-left font-bold uppercase text-xs">Portafolio</th>
                        <th class="p-3 text-right font-bold uppercase text-xs">Valor</th>
                        <th class="p-3 text-right font-bold uppercase text-xs">Posiciones</th>
                        <th class="p-3 text-right font-bold uppercase text-xs">Beta</th>
                        <th class="p-3 text-right font-bold uppercase text-xs">Sharpe</th>
                        <th class="p-3 text-right font-bold uppercase text-xs">Retorno %</th>
                    </tr>
                </thead>
                <tbody>
                    ${allPortfolios.map(([id, pf]) => {
                        const total = pf.positions.reduce((sum, p) => sum + (p.shares * p.currentPrice), 0);
                        const totalCost = pf.positions.reduce((sum, p) => sum + (p.shares * p.avgCost), 0);
                        const avgBeta = total > 0 ? pf.positions.reduce((sum, p) => sum + (p.beta * p.shares * p.currentPrice), 0) / total : 0;
                        const totalReturn = totalCost > 0 ? ((total - totalCost) / totalCost * 100) : 0;
                        const volatility = avgBeta * globalSettings.marketVolatility;
                        const sharpe = ((globalSettings.annualTarget - globalSettings.riskFreeRate) / volatility).toFixed(2);
                        
                        return `
                            <tr class="border-b hover:bg-slate-50 ${id === currentPortfolioId ? 'bg-indigo-50 font-bold' : ''}">
                                <td class="p-3 font-bold">${pf.name} ${id === currentPortfolioId ? '⭐' : ''}</td>
                                <td class="p-3 text-right font-bold">$${total.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                                <td class="p-3 text-right">${pf.positions.length}</td>
                                <td class="p-3 text-right">${avgBeta.toFixed(2)}</td>
                                <td class="p-3 text-right">${sharpe}</td>
                                <td class="p-3 text-right font-bold ${totalReturn >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
                                    ${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}%
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('comparison-table-container').innerHTML = html;
    updateComparisonChart();
}

function updateComparisonChart() {
    const ctx = document.getElementById('portfolio-comparison-chart');
    if (!ctx) return;
    
    const allPortfolios = Object.entries(portfolios);
    const names = allPortfolios.map(([id, pf]) => pf.name);
    const values = allPortfolios.map(([id, pf]) => 
        pf.positions.reduce((sum, p) => sum + (p.shares * p.currentPrice), 0)
    );
    const betas = allPortfolios.map(([id, pf]) => {
        const total = pf.positions.reduce((sum, p) => sum + (p.shares * p.currentPrice), 0);
        return total > 0 ? pf.positions.reduce((sum, p) => sum + (p.beta * p.shares * p.currentPrice), 0) / total : 0;
    });
    
    if (chartInstances.comparison) chartInstances.comparison.destroy();
    
    chartInstances.comparison = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: names,
            datasets: [
                {
                    label: 'Valor ($)',
                    data: values,
                    backgroundColor: '#6366f1',
                    borderRadius: 8,
                    yAxisID: 'y'
                },
                {
                    label: 'Beta',
                    data: betas,
                    type: 'line',
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    yAxisID: 'y1',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top' } },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    ticks: { callback: v => '$' + v.toLocaleString() },
                    title: { display: true, text: 'Valor ($)' }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Beta' }
                }
            }
        }
    });
}
```

### 6. Settings Management

```javascript
// --- SETTINGS ---
function openSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
    document.getElementById('settings-risk-free-rate').value = globalSettings.riskFreeRate;
    document.getElementById('settings-refresh-interval').value = globalSettings.refreshInterval;
    document.getElementById('settings-market-vol').value = globalSettings.marketVolatility;
    
    // Update info
    document.getElementById('settings-portfolio-count').textContent = Object.keys(portfolios).length;
    const cacheCount = cachedPrices.prices ? Object.keys(cachedPrices.prices).length : 0;
    document.getElementById('settings-cache-count').textContent = `${cacheCount} símbolos`;
}

function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}

function saveGlobalSettings() {
    globalSettings.riskFreeRate = parseFloat(document.getElementById('settings-risk-free-rate').value);
    globalSettings.refreshInterval = parseInt(document.getElementById('settings-refresh-interval').value);
    globalSettings.marketVolatility = parseFloat(document.getElementById('settings-market-vol').value);
    
    localStorage.setItem('sv_global_settings', JSON.stringify(globalSettings));
    
    // Update refresh timer
    clearInterval(window.priceUpdateInterval);
    window.priceUpdateInterval = setInterval(() => {
        updatePrices();
    }, globalSettings.refreshInterval * 60 * 1000);
    
    alert('✅ Configuración guardada');
    updateRiskCharts();
    closeSettings();
}

function clearAllData() {
    if (!confirm('⚠️ ¿ELIMINAR TODOS LOS DATOS?\n\nEsto borrará:\n- Todos los portafolios\n- Configuración\n- Cache de precios\n\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    if (!confirm('¿Estás completamente seguro? Esta es tu última oportunidad.')) {
        return;
    }
    
    localStorage.removeItem('sv_portfolios_unified');
    localStorage.removeItem('sv_global_settings');
    localStorage.removeItem('sv_cached_prices');
    localStorage.removeItem('sv_historical_data');
    localStorage.removeItem('sv_dividend_portfolio'); // Old version
    
    alert('✅ Todos los datos han sido eliminados. La página se recargará.');
    location.reload();
}
```

### 7. Actualizar window.onload

Reemplazar el window.onload existente con:

```javascript
window.onload = async () => {
    // Initialize portfolio reference
    portfolio = getCurrentPortfolio();
    
    // Load UI components
    loadPortfolioSelector();
    updateCacheStatus();
    populateTickerDropdown();
    switchTab('main');
    renderDashboard();
    startTimer();
    
    // Load prices
    preloadStockPrices().then(() => {
        updateCacheStatus();
        populateTickerDropdown();
        if (portfolio.length > 0) updatePrices();
    });
    
    // Set up auto-refresh
    window.priceUpdateInterval = setInterval(() => {
        if (document.getElementById('content-main').classList.contains('hidden')) return;
        updatePrices();
    }, globalSettings.refreshInterval * 60 * 1000);
};
```

### 8. Helper Functions

```javascript
// --- HELPERS ---
function calculateCurrentStats() {
    let stats = { val: 0, cost: 0, beta: 0, yield: 0, dgr: 0 };
    
    portfolio.forEach(item => {
        const marketVal = item.shares * item.currentPrice;
        const costBasis = item.shares * item.avgCost;
        
        stats.val += marketVal;
        stats.cost += costBasis;
        stats.beta += (item.beta * marketVal);
        stats.yield += (item.dividendYield * marketVal);
        stats.dgr += (item.dgr * marketVal);
    });
    
    return stats;
}

function updateAllVisualizations() {
    if (!document.getElementById('content-main').classList.contains('hidden')) {
        updateCharts(calculateCurrentStats());
    }
    if (!document.getElementById('content-projections').classList.contains('hidden')) {
        updateAllProjections();
    }
    if (!document.getElementById('content-risk').classList.contains('hidden')) {
        updateRiskCharts();
    }
    if (!document.getElementById('content-comparison').classList.contains('hidden')) {
        updateComparisonView();
    }
}
```

---

## 📝 Instrucciones de Integración

### Paso 1: Agregar Variables (Línea ~670)
Copiar sección "1. Sistema Multi-Portafolio" completa

### Paso 2: Agregar Tabs (Línea ~1800, antes de `</script>`)
Copiar sección "2. Sistema de Tabs"

### Paso 3: Agregar Proyecciones (Después de tabs)
Copiar sección "3. Gráficos de Proyección Multi-Escenario"

### Paso 4: Agregar Riesgo (Después de proyecciones)
Copiar sección "4. Gráficos de Riesgo"

### Paso 5: Agregar Comparación (Después de riesgo)
Copiar sección "5. Comparación de Portafolios"

### Paso 6: Agregar Settings (Después de comparación)
Copiar sección "6. Settings Management"

### Paso 7: Reemplazar window.onload
Copiar sección "7. Actualizar window.onload"

### Paso 8: Agregar Helpers (Al final)
Copiar sección "8. Helper Functions"

---

## 🧪 Testing Post-Integración

### Checklist

```
[ ] Página carga sin errores
[ ] Tabs cambian correctamente
[ ] Selector de portafolio funciona
[ ] "Gestionar" abre modal
[ ] Crear nuevo portafolio funciona
[ ] Cambiar entre portafolios funciona
[ ] "Config" abre modal de settings
[ ] Guardar settings funciona
[ ] Tab "Proyecciones" muestra gráficos
[ ] Parámetros ajustables funcionan
[ ] Tab "Riesgo" muestra métricas
[ ] Tab "Comparación" muestra tabla
[ ] Análisis AI sigue funcionando
[ ] Hover charts siguen funcionando
[ ] AI Portfolio Builder funciona
```

---

## ⚡ Quick Integration (Alternativa Simple)

Si la integración manual es muy compleja, puedes usar:

```javascript
// En opi.html, agregar al final del script (antes de </script>):

// Import enhanced features
const script = document.createElement('script');
script.src = 'enhanced-additions.js';
document.head.appendChild(script);
```

Luego completar enhanced-additions.js con todas las funciones arriba.

---

## 🎯 Resultado Esperado

```
public/index.html tendrá:

De opi.html (v2.8.1):
✅ AI analysis con históricos
✅ News & sentiment
✅ Hover charts
✅ AI Portfolio Builder
✅ Análisis global
✅ Marketstack integration
✅ Cache system

De opi-enhanced.html (v3.0):
✅ Multi-portfolio management
✅ Settings panel
✅ Tab navigation
✅ Advanced metrics
✅ Multi-scenario projections
✅ Risk analysis charts
✅ Comparison features

Total:
~2,500 líneas
~150 KB
20+ features combinadas
```

---

## 📌 Notas Importantes

1. **Compatibilidad**: Las variables de portfolio deben sincronizarse
2. **Performance**: Con tantas features, optimizar rendering
3. **Testing**: Probar cada tab exhaustivamente
4. **Backup**: Guardar opi.html original antes de modificar

---

**Próximo paso**: Implementar secciones 1-8 en public/index.html en orden
