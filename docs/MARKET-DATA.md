# 📊 Sistema de Datos de Mercado - SV Portfolio

## 🎯 Overview

**107 símbolos** de múltiples mercados con datos actualizados sin consumir APIs de pago.

---

## 📦 Símbolos Disponibles

### 📈 Acciones USA (63)

#### Tecnología (15)
```
AAPL, MSFT, GOOGL, META, NVDA, TSLA, AMD, INTC,
CSCO, ORCL, IBM, CRM, AVGO, ADBE, NFLX
```

#### Salud (8)
```
JNJ, ABBV, PFE, UNH, MRK, LLY, BMY, AMGN
```

#### Finanzas (8)
```
JPM, BAC, WFC, GS, MS, V, MA, PYPL
```

#### Consumo (10)
```
AMZN, WMT, HD, COST, PG, KO, PEP, MCD, NKE, SBUX
```

#### Energía (4)
```
XOM, CVX, COP, SLB
```

#### Industrial (5)
```
BA, CAT, GE, MMM, HON
```

#### Utilities (4)
```
NEE, DUK, SO, D
```

#### Real Estate/REITs (4)
```
AMT, PLD, O, SPG
```

#### Telecomunicaciones (3)
```
T, VZ, TMUS
```

#### Materiales (2)
```
LIN, APD
```

**Total Acciones: 63**

---

### 📊 Índices Bursátiles (8)

```
^GSPC    S&P 500
^DJI     Dow Jones Industrial
^IXIC    NASDAQ Composite
^RUT     Russell 2000
^VIX     Volatility Index (Fear Index)
^FTSE    FTSE 100 (UK)
^GDAXI   DAX (Germany)
^N225    Nikkei 225 (Japan)
```

**Total Índices: 8**

---

### 💰 Criptomonedas (12)

```
BTC-USD   Bitcoin          (Top 1)
ETH-USD   Ethereum         (Top 2)
BNB-USD   Binance Coin     (Top 4)
XRP-USD   Ripple           (Top 5)
ADA-USD   Cardano          (Top 10)
SOL-USD   Solana           (Top 6)
DOT-USD   Polkadot         (Top 15)
DOGE-USD  Dogecoin         (Top 12)
MATIC-USD Polygon          (Top 13)
AVAX-USD  Avalanche        (Top 11)
LINK-USD  Chainlink        (Top 16)
UNI-USD   Uniswap          (Top 20)
```

**Total Crypto: 12**

---

### 📈 ETFs (11)

```
SPY     SPDR S&P 500
QQQ     Invesco QQQ (NASDAQ-100)
DIA     SPDR Dow Jones
IWM     iShares Russell 2000
VTI     Vanguard Total Stock Market
VOO     Vanguard S&P 500
GLD     SPDR Gold Trust
SLV     iShares Silver Trust
USO     US Oil Fund
TLT     iShares 20Y Treasury
ARKK    ARK Innovation
```

**Total ETFs: 11**

---

### 🌾 Commodities/Futuros (8)

```
GC=F    Gold Futures
SI=F    Silver Futures
CL=F    Crude Oil WTI
NG=F    Natural Gas
HG=F    Copper
ZC=F    Corn
ZW=F    Wheat
ZS=F    Soybean
```

**Total Futuros: 8**

---

### 💱 Forex (5)

```
EURUSD=X  Euro/USD
GBPUSD=X  Pound/USD
USDJPY=X  USD/Yen
AUDUSD=X  Aussie/USD
USDCAD=X  USD/Canadian
```

**Total Forex: 5**

---

## 🔄 Actualización de Precios

### Método 1: Script Automático (Recomendado)

```bash
# Actualizar precios desde fuentes públicas
node backend/scripts/update-prices.js

# Fuentes usadas:
# - CoinGecko API (crypto) - Sin key, 30 req/min
# - Yahoo Finance API (stocks, ETFs, índices) - Sin key
# - Delay automático entre requests

# Tiempo: ~5-10 minutos para 107 símbolos
# Frecuencia recomendada: Diaria
```

### Método 2: Regenerar Data Completa

```bash
# Regenerar archivo base (con precios estáticos)
node backend/scripts/generate-market-data.js

# Luego actualizar precios
node backend/scripts/update-prices.js
```

### Método 3: Cron Job (Automatizado)

```bash
# Agregar a crontab (actualizar diariamente a las 6 PM)
crontab -e

# Agregar línea:
0 18 * * * cd /ruta/a/inversion && node backend/scripts/update-prices.js

# O con npm si está instalado globalmente:
0 18 * * * cd /ruta/a/inversion/backend && npm run update:prices
```

---

## 📁 Archivos Generados

### backend/market-data.json (18 KB)

```json
{
  "metadata": {
    "generated": "2026-01-04T...",
    "source": "Multiple public sources",
    "totalSymbols": 107,
    "categories": {
      "stocks": 63,
      "indices": 8,
      "crypto": 12,
      "etfs": 11,
      "futures": 8,
      "forex": 5
    }
  },
  "data": {
    "AAPL": {
      "name": "Apple Inc.",
      "sector": "Tecnología",
      "beta": 1.24,
      "yield": 0.5,
      "dgr": 7.5,
      "price": 185.92,
      "lastUpdate": "2026-01-04T..."
    },
    ...
  }
}
```

### assets/js/market-data.js (17 KB)

```javascript
// Auto-generated market data - 2026-01-04T...
// Updated: 107/107 symbols

export const MARKET_DATA = {
  "AAPL": {
    "name": "Apple Inc.",
    "beta": 1.24,
    "price": 185.92,
    ...
  },
  ...
};

export const METADATA = {
  "generated": "2026-01-04T...",
  "totalSymbols": 107,
  ...
};
```

---

## 🔌 Integración en Dashboard

### Opción 1: Reemplazar stockRef Completo

```javascript
// En public/index.html, reemplazar:

// ANTES:
const stockRef = {
    "AAPL": { beta: 1.24, ... },
    // ...manual
};

// DESPUÉS:
import { MARKET_DATA } from './assets/js/market-data.js';
const stockRef = MARKET_DATA;
```

### Opción 2: Merge con Datos Existentes

```javascript
// Mantener datos custom + agregar nuevos símbolos
import { MARKET_DATA } from './assets/js/market-data.js';

const stockRef = {
    ...MARKET_DATA,
    // Override específicos si necesitas
    'AAPL': {
        ...MARKET_DATA['AAPL'],
        customField: 'valor personalizado'
    }
};
```

### Opción 3: Cargar Dinámicamente

```javascript
// Cargar solo cuando se necesita
async function loadMarketData() {
    const { MARKET_DATA } = await import('./assets/js/market-data.js');
    return MARKET_DATA;
}

// Uso
const stockRef = await loadMarketData();
```

---

## 🎯 Categorías y Filtros

### Por Tipo de Activo

```javascript
// En el dashboard, filtrar por tipo:

const stocks = Object.entries(MARKET_DATA)
    .filter(([symbol, data]) => !data.isCrypto && !data.isIndex && !data.isETF);

const cryptos = Object.entries(MARKET_DATA)
    .filter(([symbol, data]) => data.isCrypto);

const indices = Object.entries(MARKET_DATA)
    .filter(([symbol, data]) => data.isIndex);

const etfs = Object.entries(MARKET_DATA)
    .filter(([symbol, data]) => data.isETF);
```

### Por Sector

```javascript
const techStocks = Object.entries(MARKET_DATA)
    .filter(([s, d]) => d.sector.includes('Tecnología'));

const healthStocks = Object.entries(MARKET_DATA)
    .filter(([s, d]) => d.sector === 'Salud');
```

### Por Beta (Riesgo)

```javascript
const lowRisk = Object.entries(MARKET_DATA)
    .filter(([s, d]) => d.beta < 0.7);

const highRisk = Object.entries(MARKET_DATA)
    .filter(([s, d]) => d.beta > 1.5);
```

---

## 📊 Rangos de Beta por Categoría

```
Forex:           0.3 - 0.8   (Muy bajo)
Utilities:       0.3 - 0.6   (Muy bajo)
Índices:         1.0 - 1.0   (Mercado)
Bonds ETF:      -0.3 - 0.2   (Inverso)
Gold/Silver:     0.1 - 0.3   (Refugio)
Healthcare:      0.5 - 0.8   (Defensivo)
Consumer:        0.5 - 0.9   (Defensivo)
REITs:           0.7 - 1.0   (Moderado)
Tech:            1.2 - 2.0   (Agresivo)
Finance:         1.0 - 1.3   (Moderado)
Commodities:     0.8 - 2.0   (Variable)
Crypto:          2.5 - 4.0   (Muy alto)
```

---

## 🔄 Fuentes de Datos

### CoinGecko (Crypto)

```
API: https://api.coingecko.com/api/v3/simple/price
Rate Limit: 10-30 requests/min (free)
Sin autenticación: ✅
Datos: Precios en tiempo real
Cobertura: Top 100 cryptos
```

### Yahoo Finance (Stocks, ETFs, Índices)

```
API: https://query1.finance.yahoo.com/v8/finance/chart
Rate Limit: Generoso (100+ req/min)
Sin autenticación: ✅
Datos: OHLC, volume, precios actuales
Cobertura: Global
```

### Alternativas (Backup)

```
Alpha Vantage: Usa tu API key si la tienes
Marketstack: Usa tu API key si la tienes
FinnHub: Free tier disponible
Twelve Data: Free tier disponible
```

---

## ⚙️ Configuración Avanzada

### Agregar Más Símbolos

```javascript
// Editar: backend/scripts/generate-market-data.js

// Buscar sección SYMBOLS y agregar:
stocks: {
    tech: [
        'AAPL', 'MSFT', ...,
        'SNOW', 'PLTR', 'RBLX'  // Agregar nuevos
    ]
}

// Regenerar:
node backend/scripts/generate-market-data.js
```

### Actualizar Betas Manualmente

```javascript
// Editar market-data.json directamente
{
  "AAPL": {
    "beta": 1.30  // Actualizar a valor más reciente
  }
}

// O en generate-market-data.js cambiar valores base
```

### Programar Actualización Automática

```bash
# GitHub Actions (gratis)
# Crear: .github/workflows/update-data.yml

name: Update Market Data
on:
  schedule:
    - cron: '0 18 * * *'  # Diario a las 6 PM UTC
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: node backend/scripts/update-prices.js
      - run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add .
          git commit -m "Update market data [automated]"
          git push
```

---

## 📊 Estructura de Datos

### Por Símbolo

```javascript
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "sector": "Tecnología",
  "beta": 1.24,
  "yield": 0.5,       // Dividend yield %
  "dgr": 7.5,         // Dividend growth rate %
  "price": 185.92,    // Precio actual
  "lastUpdate": "2026-01-04T...",
  
  // Flags opcionales
  "isCrypto": false,
  "isIndex": false,
  "isETF": false,
  "isFutures": false,
  "isForex": false
}
```

---

## 🎨 Uso en Frontend

### Importar Datos

```html
<!-- En public/index.html -->
<script type="module">
    import { MARKET_DATA, METADATA } from './assets/js/market-data.js';
    
    console.log(`📊 ${METADATA.totalSymbols} símbolos cargados`);
    console.log(`📅 Generado: ${METADATA.generated}`);
    
    // Usar como stockRef
    const stockRef = MARKET_DATA;
</script>
```

### Dropdown Dinámico

```javascript
// Poblar selector con todos los símbolos
function populateTickerDropdown() {
    const select = document.getElementById('sim-ticker');
    
    Object.entries(MARKET_DATA).forEach(([ticker, data]) => {
        const option = document.createElement('option');
        option.value = ticker;
        option.textContent = `${ticker} - ${data.name} ($${data.price.toFixed(2)})`;
        
        // Agregar icono según tipo
        if (data.isCrypto) option.textContent = '💰 ' + option.textContent;
        if (data.isIndex) option.textContent = '📊 ' + option.textContent;
        if (data.isETF) option.textContent = '📈 ' + option.textContent;
        
        select.appendChild(option);
    });
}
```

### Búsqueda y Filtrado

```javascript
// Buscar símbolos por nombre o sector
function searchSymbols(query) {
    query = query.toLowerCase();
    
    return Object.entries(MARKET_DATA)
        .filter(([ticker, data]) => 
            ticker.toLowerCase().includes(query) ||
            data.name.toLowerCase().includes(query) ||
            data.sector.toLowerCase().includes(query)
        )
        .map(([ticker, data]) => ({ ticker, ...data }));
}

// Ejemplo:
const techStocks = searchSymbols('tecnología');
const cryptos = searchSymbols('crypto');
```

---

## 🔄 Actualización de Precios

### Script de Actualización

```bash
# Actualizar todos los precios
node backend/scripts/update-prices.js

# Proceso:
1. Lee market-data.json
2. Para crypto: CoinGecko API
3. Para resto: Yahoo Finance API
4. Actualiza precios
5. Guarda JSON y JS actualizados

# Tiempo: ~5-10 minutos (107 símbolos con delays)
# Rate limits respetados automáticamente
```

### Resultados Esperados

```
🔄 Actualizador de Precios
==========================================

📊 Actualizando 107 símbolos...

  ✓ AAPL         $   185.92 (Yahoo)
  ✓ MSFT         $   376.04 (Yahoo)
  ✓ BTC-USD      $ 44328.50 (CoinGecko)
  ✓ ETH-USD      $  2328.75 (CoinGecko)
  ...

📊 Resultados:
   ✅ Actualizados: 95
   ⚠️  Sin datos: 12
   📈 Tasa éxito: 88.8%

✅ Actualización completa
```

### Frecuencia Recomendada

```
Desarrollo:   Manual cuando necesites
Producción:   Diaria (cron o GitHub Actions)
Alto volumen: Cada 4-6 horas
```

---

## 📊 Estadísticas

### Distribución por Mercado

```
Acciones USA:    63 (59%)
Criptomonedas:   12 (11%)
ETFs:            11 (10%)
Índices:          8 (7%)
Futuros:          8 (7%)
Forex:            5 (5%)
───────────────────────
TOTAL:          107 símbolos
```

### Distribución por Sector (Acciones)

```
Tecnología:      15 (24%)
Salud:            8 (13%)
Finanzas:         8 (13%)
Consumo:         10 (16%)
Energía:          4 (6%)
Industrial:       5 (8%)
Utilities:        4 (6%)
REITs:            4 (6%)
Telecom:          3 (5%)
Materiales:       2 (3%)
```

### Distribución por Beta

```
Muy Bajo (<0.5):    8 símbolos
Bajo (0.5-0.8):    18 símbolos
Medio (0.8-1.2):   32 símbolos
Alto (1.2-1.5):    19 símbolos
Muy Alto (>1.5):   18 símbolos
Crypto (>2.5):     12 símbolos
```

---

## 🎯 Ventajas del Sistema

### vs APIs de Pago

```
✅ Gratis (0 API calls de pago)
✅ 107 símbolos pre-cargados
✅ Datos estáticos confiables
✅ Actualización bajo demanda
✅ Sin límites de rate
✅ Offline-friendly
✅ Sin dependencias externas
```

### Datos Incluidos

```
Por símbolo:
✅ Nombre completo
✅ Sector/Categoría
✅ Beta (riesgo)
✅ Dividend Yield
✅ Dividend Growth Rate
✅ Precio actual (actualizable)
✅ Última actualización
✅ Flags de tipo (crypto, ETF, etc)
```

---

## 🔧 Comandos NPM

### Agregar a package.json

```json
{
  "scripts": {
    "data:generate": "node backend/scripts/generate-market-data.js",
    "data:update": "node backend/scripts/update-prices.js",
    "data:full": "npm run data:generate && npm run data:update"
  }
}
```

### Uso

```bash
# Generar datos base
npm run data:generate

# Actualizar precios
npm run data:update

# Ambos
npm run data:full
```

---

## 📝 Notas Importantes

### Rate Limits

```
CoinGecko:
- Free tier: 10-30 req/min
- Script usa delay de 2.1 seg entre requests
- ~28 req/min → dentro del límite

Yahoo Finance:
- Sin límite oficial documentado
- Script usa delay de 0.5 seg
- ~120 req/min → seguro
```

### Precisión de Datos

```
✅ Precios: Actualizados desde APIs públicas
✅ Beta: Calculado o estimado por categoría
✅ Yield/DGR: Datos históricos conocidos
⚠️ Actualizar Beta manualmente si es crítico
```

### Datos Estáticos vs Dinámicos

```
Estáticos (generados una vez):
- Beta, Yield, DGR, Sector, Name

Dinámicos (actualizables):
- Price, lastUpdate

Script de actualización solo cambia price
```

---

## 🚀 Siguientes Mejoras

### Scraping Avanzado

```javascript
// Obtener Beta real desde Yahoo Finance
// Obtener Dividend data actualizado
// Calcular volatilidad histórica
// Earnings dates
// Analyst ratings
```

### Más Fuentes

```
Binance API (crypto) - Free
Coinbase API (crypto) - Free  
Polygon.io - Free tier
Finnhub - Free tier
IEX Cloud - Free tier
```

---

## ✅ Checklist de Uso

```
[ ] Generar datos base
[ ] Actualizar precios (opcional)
[ ] Verificar archivos generados
[ ] Importar en dashboard
[ ] Probar dropdown con 107 símbolos
[ ] Agregar posición de prueba
[ ] Verificar precio se muestra
[ ] (Opcional) Configurar cron job
[ ] (Opcional) GitHub Actions auto-update
```

---

**📊 107 símbolos de 6 mercados diferentes**  
**🔄 Actualizable desde fuentes públicas**  
**💰 0 costo en APIs**  
**✅ Listo para usar en producción**
