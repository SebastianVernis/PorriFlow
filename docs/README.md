# SV Portfolio Manager v3.0 Unified

**Dashboard profesional completo** para análisis y gestión de portafolios de inversión.

## 🎯 Archivo Principal

**📁 public/index.html** - Versión completa con todas las características

### Características Unificadas
- ✅ **AI Analysis** - Análisis inteligente con Blackbox AI
- ✅ **News & Sentiment** - Noticias del mercado con análisis de sentimiento
- ✅ **Multi-Portfolio** - Gestión de múltiples portafolios simultáneos
- ✅ **Advanced Metrics** - Sharpe, Sortino, VaR, Max Drawdown
- ✅ **Projections** - Escenarios optimista/base/pesimista
- ✅ **Risk Analysis** - Análisis completo de riesgo
- ✅ **Comparison** - Comparación de estrategias
- ✅ **Hover Charts** - Gráficos históricos al pasar mouse
- ✅ **Real-time Prices** - Marketstack + Alpha Vantage

## 🚀 Quick Start

```bash
1. Abrir: public/index.html
2. Configurar APIs (si es primera vez)
3. ¡Listo para usar!
```

👉 **Guía rápida completa**: [QUICK-START.md](QUICK-START.md)

## 🚀 Características

- **Análisis AI enriquecido**: Análisis inteligente con datos históricos, noticias y sentimiento del mercado
- **Datos en tiempo real**: Integración con Marketstack API para precios actualizados
- **Gráficos interactivos**: Hover sobre tickers para ver gráficos históricos de 7 días
- **Proyecciones semanales**: Cálculo automático de metas basado en 20% anual
- **Portfolio Builder AI**: Generación automática de portafolios optimizados
- **Cache inteligente**: Sistema de cache con fallback automático

## 🔑 APIs Requeridas

### 1. **Marketstack** (Principal - Precios en tiempo real)
- **URL**: https://marketstack.com/
- **Precio**: FREE tier disponible (100 requests/día)
- **Configuración**: 
  ```javascript
  const MARKETSTACK_API_KEY = "TU_API_KEY_AQUI";
  ```
- **Uso**: Precios actuales, datos históricos

### 2. **Alpha Vantage** (Fallback - Precios y datos históricos)
- **URL**: https://www.alphavantage.co/
- **Precio**: FREE (5 requests/minuto, 500/día)
- **Configuración**:
  ```javascript
  const ALPHA_VANTAGE_KEY = "TU_API_KEY_AQUI";
  ```
- **Uso**: Backup para precios, noticias con sentimiento

### 3. **Blackbox AI** (Análisis Inteligente)
- **URL**: https://www.blackbox.ai/
- **Precio**: API de pago
- **Configuración**:
  ```javascript
  const BLACKBOX_API_KEY = "sk-TU_API_KEY_AQUI";
  ```
- **Uso**: Análisis profundo de activos con IA

### 4. **Marketaux** (OPCIONAL - Noticias y Sentimiento)
- **URL**: https://www.marketaux.com/
- **Precio**: FREE tier (100 requests/día)
- **Configuración**:
  ```javascript
  const MARKETAUX_API_KEY = "TU_API_KEY_AQUI"; // Dejar vacío para desactivar
  ```
- **Uso**: Noticias financieras con análisis de sentimiento

## 📊 APIs de Noticias y Sentimiento Disponibles

### Opción 1: Alpha Vantage News Sentiment (INCLUIDA)
- ✅ **Ya configurada** en el código
- ✅ Gratis con límites razonables
- ✅ Incluye score de sentimiento
- ⚠️ Limitada a 5 requests/minuto

**Endpoint usado**:
```
https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=YOUR_KEY
```

**Respuesta incluye**:
- Títulos y descripciones de noticias
- Sentimiento por ticker (-1 a +1)
- Relevancia de la noticia

### Opción 2: Marketaux (RECOMENDADA)
- ✅ **100 requests diarias gratis**
- ✅ Múltiples fuentes de noticias
- ✅ Análisis de sentimiento avanzado
- ✅ Filtrado por entidades

**Cómo activar**:
1. Registrarse en https://www.marketaux.com/
2. Obtener API key
3. Agregar al código:
   ```javascript
   const MARKETAUX_API_KEY = "tu_key_aqui";
   ```

### Opción 3: NewsAPI (Alternativa)
- 🔸 Enfocada en noticias generales
- 🔸 500 requests/día en tier gratuito
- ⚠️ No incluye sentimiento nativo

### Opción 4: Finnhub (Alternativa Premium)
- ✅ Datos en tiempo real
- ✅ Sentimiento de noticias
- 💰 60 calls/minuto en free tier

## 🎯 Cómo Funciona el Análisis AI Mejorado

### 1. **Recopilación de Datos**
```javascript
// Se obtienen automáticamente:
- Datos históricos (7 días): precios, volatilidad, cambio %
- Noticias recientes (hasta 3): títulos + sentimiento
- Métricas del activo: Beta, Yield, DGR, Sector
```

### 2. **Contexto Enriquecido para IA**
La IA recibe un prompt con:
- 📊 **Datos técnicos**: Beta, Yield, DGR
- 📈 **Performance histórico**: Cambio 7 días, volatilidad, máximo/mínimo
- 📰 **Noticias y sentimiento**: Headlines con score de sentimiento
- 🎯 **Objetivo específico**: Evaluar proyección semanal 0.35%

### 3. **Respuesta Estructurada**
```
1. Análisis Técnico (precio y volatilidad)
2. Análisis Fundamental (Beta, sector, noticias)
3. Recomendación (COMPRAR/MANTENER/VENDER) con razones
```

### 4. **UI Mejorada**
- Tarjeta de datos históricos con colores semánticos
- Sección de noticias con emojis de sentimiento
- Análisis AI destacado en gradiente

## 🛠️ Instalación y Uso

1. **Configurar API Keys** en el archivo `opi.html`:
   ```javascript
   // Línea ~385
   const ALPHA_VANTAGE_KEY = "TU_KEY"; 
   const MARKETSTACK_API_KEY = "TU_KEY";
   const BLACKBOX_API_KEY = "TU_KEY";
   const MARKETAUX_API_KEY = ""; // Opcional
   ```

2. **Abrir archivo** directamente en el navegador:
   ```bash
   # Doble clic en opi.html
   # O desde terminal:
   open opi.html  # Mac
   start opi.html # Windows
   xdg-open opi.html # Linux
   ```

3. **Agregar símbolos** al portafolio:
   - Click en "Simular"
   - Seleccionar ticker
   - Ingresar cantidad y costo promedio
   - Click en "Integrar al Monitor"

4. **Analizar con IA**:
   - Click en botón "AI" de cualquier activo
   - Esperar análisis enriquecido
   - Revisar datos históricos, noticias y recomendación

## 📈 Estructura de Datos

### Cache de Precios
```javascript
{
  "timestamp": 1704398400000,
  "prices": {
    "AAPL": 185.50,
    "MSFT": 375.20,
    // ...
  }
}
```

### Cache de Datos Históricos
```javascript
{
  "AAPL": {
    "timestamp": 1704398400000,
    "data": {
      "dates": ["4 ene", "5 ene", ...],
      "prices": [185.20, 186.50, ...],
      "high": 187.30,
      "low": 183.90,
      "change": "1.25"
    }
  }
}
```

### Noticias con Sentimiento
```javascript
[
  {
    "title": "Apple announces new product line",
    "description": "...",
    "sentiment": 0.35, // -1 (negativo) a +1 (positivo)
    "published": "2024-01-04T10:00:00Z"
  }
]
```

## 🔄 Sistema de Fallback

```
Precios:
Marketstack → Alpha Vantage → Cache

Históricos:
Marketstack → Alpha Vantage → Cache

Noticias:
Marketaux → Alpha Vantage News → Sin noticias
```

## ⚡ Optimizaciones

- **Batch requests**: Hasta 50 símbolos por llamada (Marketstack)
- **Cache inteligente**: 15 min para precios, 1 hora para históricos
- **Parallel loading**: Carga simultánea de múltiples lotes
- **Lazy loading**: Datos históricos solo al hover
- **Fallback automático**: Sin interrupciones si una API falla

## 📝 Notas Técnicas

### Rate Limits
- **Marketstack Free**: 100 requests/día
- **Alpha Vantage**: 5 requests/minuto, 500/día
- **Marketaux Free**: 100 requests/día
- **Blackbox AI**: Según plan contratado

### Recomendaciones
1. Usar Marketstack para precios en tiempo real
2. Activar Marketaux para mejor análisis de noticias
3. El sistema funciona sin Marketaux (usa Alpha Vantage)
4. Cache reduce significativamente las llamadas a APIs

## 🐛 Troubleshooting

### "Rate limit alcanzado"
- Esperar 1 minuto antes de refrescar
- El sistema usará cache automáticamente

### "No hay noticias disponibles"
- Verificar que MARKETAUX_API_KEY esté configurado
- O dejar que use Alpha Vantage (más lento)

### "Error al conectar con BlackboxAI"
- Verificar API key de Blackbox
- Verificar saldo/créditos de la cuenta

## 📄 Licencia

Proyecto personal de Sebastian Vernis

---

**Última actualización**: Enero 2026 (v2.8)
