# 🔄 Background Jobs & News System

Sistema flexible de tareas en segundo plano con soporte para actualización automática de noticias financieras.

---

## 🎯 Características

### ✅ Implementado

1. **Background Scheduler**
   - Sistema flexible de trabajos periódicos
   - Manejo de errores robusto
   - Deshabilitación automática tras fallos repetidos
   - Monitoreo de estado de cada job

2. **News Service**
   - Noticias de Yahoo Finance (sin API key)
   - Noticias de Finnhub (con API key opcional)
   - Noticias de crypto desde CryptoPanic
   - Filings de SEC EDGAR
   - Agregación y deduplicación automática
   - Cache en base de datos

3. **API Endpoints**
   - `GET /api/news/:symbol` - Noticias por símbolo
   - `POST /api/news/batch` - Noticias para múltiples símbolos
   - `GET /api/news/portfolio/:id` - Noticias del portafolio completo

4. **Frontend Integration**
   - Módulo JavaScript para consumir noticias
   - Renderizado de cards con thumbnails
   - Indicadores de sentiment (cuando disponible)
   - Time-ago humanizado

---

## 📋 Trabajos Configurados

### 1. **News Update - Popular Symbols**
- **Frecuencia**: Cada 30 minutos
- **Símbolos**: AAPL, MSFT, GOOGL, TSLA, NVDA, BTC-USD, ETH-USD
- **Límite**: 10 artículos por símbolo
- **Propósito**: Mantener noticias frescas de activos populares

### 2. **News Update - All Tracked**
- **Frecuencia**: Cada 6 horas
- **Símbolos**: Todos los tickers en posiciones activas
- **Límite**: 5 artículos por símbolo
- **Propósito**: Actualizar noticias de todos los activos del sistema

### 3. **Cache Cleanup**
- **Frecuencia**: Cada 24 horas
- **Propósito**: Eliminar cache antiguo (>24h)
- **Efecto**: Mantiene base de datos limpia

---

## ⚙️ Configuración

### Variables de Entorno

```bash
# Habilitar/deshabilitar background jobs
ENABLE_BACKGROUND_JOBS=true

# API Keys opcionales (mejoran resultados)
FINNHUB_API_KEY=your_key_here
```

### Estado por Defecto

- **Sin `ENABLE_BACKGROUND_JOBS`**: Jobs deshabilitados
- **Con `ENABLE_BACKGROUND_JOBS=true`**: Jobs activos al iniciar servidor

---

## 🔌 Fuentes de Noticias

### Yahoo Finance
- ✅ **Sin API key**
- ✅ Completamente gratuito
- ✅ Noticias de acciones y ETFs
- ⚠️  API no documentada (puede cambiar)

**Endpoint usado**:
```
https://query1.finance.yahoo.com/v1/finance/search?q={symbol}&newsCount=10
```

### Finnhub
- 🔑 **Requiere API key**
- ✅ 60 requests/min (tier gratuito)
- ✅ Incluye sentiment analysis
- ✅ Fuentes premium

**Signup**: https://finnhub.io

### CryptoPanic
- ✅ **Sin API key** (modo público)
- ✅ Noticias de crypto
- ✅ Votación de comunidad (sentiment)
- ⚠️  Rate limit: ~30/min

### SEC EDGAR
- ✅ **API oficial del gobierno**
- ✅ Completamente gratuito
- ✅ Filings regulatorios (8-K, 10-Q, 10-K)
- ✅ Rate limit: 10 req/sec

---

## 📡 API Usage

### Obtener noticias de un símbolo

```javascript
// Frontend
import { getSymbolNews } from './assets/js/news.js';

const news = await getSymbolNews('AAPL', {
    limit: 20,
    sources: 'yahoo,finnhub,sec'
});

console.log(news);
// [{ title, summary, url, publishedAt, publisher, sentiment, ... }]
```

### Obtener noticias de múltiples símbolos

```javascript
import { getBatchNews } from './assets/js/news.js';

const results = await getBatchNews(['AAPL', 'MSFT', 'TSLA'], 10);

console.log(results);
// { 'AAPL': [...], 'MSFT': [...], 'TSLA': [...] }
```

### Obtener noticias del portafolio

```javascript
import { getPortfolioNews } from './assets/js/news.js';

const news = await getPortfolioNews('portfolio_id', 5);

console.log(news);
// [{ symbol: 'AAPL', title, summary, ... }, ...]
```

### Renderizar noticias en UI

```javascript
import { renderSymbolNews } from './assets/js/news.js';

// Renderizar noticias de AAPL en el contenedor 'news-container'
await renderSymbolNews('AAPL', 'news-container');
```

---

## 🛠️ Gestión de Jobs

### Ver estado de jobs

```javascript
// En el servidor
import scheduler from './services/background-scheduler.js';

const status = scheduler.getStatus();
console.log(status);
```

**Output**:
```javascript
[
  {
    name: 'news-update-popular',
    enabled: true,
    interval: '30m',
    lastRun: '2026-01-04T12:00:00.000Z',
    nextRun: '2026-01-04T12:30:00.000Z',
    successCount: 5,
    failCount: 0,
    lastError: null
  },
  // ...
]
```

### Ejecutar job manualmente

```javascript
await scheduler.runJob('news-update-popular');
```

### Habilitar/Deshabilitar job

```javascript
scheduler.setJobEnabled('news-update-popular', false); // Pausar
scheduler.setJobEnabled('news-update-popular', true);  // Reanudar
```

### Detener todos los jobs

```javascript
scheduler.stop();
```

---

## 📊 Estructura de Datos - News

```typescript
interface NewsArticle {
  source: 'yahoo' | 'finnhub' | 'sec' | 'cryptopanic';
  title: string;
  summary: string;
  url: string;
  publishedAt: Date;
  publisher: string;
  thumbnail: string | null;
  type: 'article' | 'filing';
  sentiment?: 'positive' | 'negative' | 'neutral';
  symbol?: string; // When fetched for portfolio
}
```

---

## 🎨 UI Components

### News Card

Diseñado con Tailwind CSS:
- Thumbnail (si disponible)
- Título (max 2 líneas)
- Summary (max 2 líneas)
- Publisher y timestamp
- Badge de sentiment (si disponible)
- Indicador de fuente
- Link externo

### Ejemplo HTML

```html
<div id="news-feed"></div>

<script type="module">
  import { renderSymbolNews } from './assets/js/news.js';
  
  // Cargar noticias de Apple
  renderSymbolNews('AAPL', 'news-feed');
</script>
```

---

## 🔧 Extensibilidad

### Agregar nueva fuente de noticias

**1. Implementar fetcher en `news-service.js`**:

```javascript
async function fetchMyNewSource(symbol) {
    try {
        const url = `https://api.newsource.com/news?symbol=${symbol}`;
        const data = await fetchURL(url);
        const json = JSON.parse(data);
        
        return json.articles.map(item => ({
            source: 'mynewsource',
            title: item.headline,
            summary: item.description,
            url: item.link,
            publishedAt: new Date(item.date),
            publisher: item.author,
            thumbnail: item.image,
            type: 'article'
        }));
    } catch (error) {
        console.error(`MyNewSource error:`, error);
        return [];
    }
}
```

**2. Agregar a `getNewsForSymbol`**:

```javascript
if (sources.includes('mynewsource')) {
    newsPromises.push(fetchMyNewSource(symbol));
}
```

**3. Actualizar frontend**:

```javascript
const news = await getSymbolNews('AAPL', {
    sources: 'yahoo,mynewsource'
});
```

### Agregar nuevo job periódico

```javascript
// En server.js
scheduler.register(
    'my-custom-job',
    async () => {
        console.log('Running my custom job');
        // Tu lógica aquí
    },
    15 * 60 * 1000, // 15 minutos
    { enabled: true, runOnStart: true }
);
```

---

## 📈 Rate Limits & Performance

### Yahoo Finance
- **Sin límite documentado**
- Recomendado: 1 req/segundo
- Usar delays de 500-1000ms entre requests

### Finnhub
- **Free tier**: 60 req/min
- Delay recomendado: 1100ms

### CryptoPanic
- **Free tier**: ~30 req/min
- Delay recomendado: 2100ms

### SEC EDGAR
- **Límite oficial**: 10 req/sec
- Sin problemas con uso normal

### Estrategia del Sistema

```javascript
// Batch updates usan delays automáticos
for (const symbol of symbols) {
    const news = await getNewsForSymbol(symbol);
    await new Promise(r => setTimeout(r, 1000)); // 1 segundo entre símbolos
}
```

---

## 🚀 Roadmap Futuro

### Corto Plazo
- [ ] Tabla `News` en Prisma para persistir noticias
- [ ] WebSocket push notifications para noticias importantes
- [ ] Filtros por tipo de noticia (earnings, dividends, mergers)

### Medio Plazo
- [ ] Sentiment analysis local (sin depender de APIs)
- [ ] Alertas personalizadas por símbolo
- [ ] Integración con calendario de earnings

### Largo Plazo
- [ ] Machine learning para predicción de impacto
- [ ] Resúmenes automáticos con AI
- [ ] Trending topics del portafolio

---

## 🐛 Troubleshooting

### Jobs no se ejecutan

**Verificar**:
```bash
# En .env
ENABLE_BACKGROUND_JOBS=true
```

**Logs esperados**:
```
🚀 SV Portfolio API v3.0
📡 Server running on port 3000
✅ Ready to accept connections

🔧 Configuring background jobs...
📋 Job registered: news-update-popular (interval: 30m)
✅ Job scheduled: news-update-popular
```

### Sin noticias para un símbolo

**Posibles causas**:
1. Símbolo no soportado por fuentes
2. Rate limit alcanzado
3. API temporalmente caída

**Debug**:
```javascript
const news = await getSymbolNews('AAPL', { sources: 'yahoo' });
console.log('News count:', news.length);
```

### Errores de API

**Yahoo Finance cambió**:
- Verificar endpoint actual en navegador
- Actualizar parser en `news-service.js`

**Finnhub unauthorized**:
- Verificar `FINNHUB_API_KEY` en `.env`
- Confirmar key válida en dashboard

---

## 📚 Referencias

- **Finnhub Docs**: https://finnhub.io/docs/api
- **SEC EDGAR**: https://www.sec.gov/edgar/searchedgar/accessing-edgar-data.htm
- **CryptoPanic**: https://cryptopanic.com/developers/api/
- **Background Scheduler**: `backend/src/services/background-scheduler.js`
- **News Service**: `backend/src/services/news-service.js`
- **Frontend Module**: `assets/js/news.js`

---

**🎉 Sistema completo de noticias y background jobs implementado!**

**Ready to**: Actualizar noticias automáticamente y mostrarlas en el dashboard.
