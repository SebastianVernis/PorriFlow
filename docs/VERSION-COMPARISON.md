# Comparación de Versiones - SV Dashboard

## 📁 Archivos Disponibles

| Archivo | Versión | Propósito | Usar Cuando... |
|---------|---------|-----------|----------------|
| `opi.html` | v2.8.1 | AI Analysis + News | Necesitas análisis profundo con IA |
| `opi-enhanced.html` | v3.0 | Multi-Portfolio + Analytics | Gestionas múltiples estrategias |
| `test-apis.html` | -- | Testing | Verificas configuración de APIs |

---

## 🔍 Comparación Detallada

### Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│  OPI.HTML v2.8.1 - SINGLE PORTFOLIO FOCUS              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✅ Single portfolio                                    │
│  ✅ AI analysis with historical data                   │
│  ✅ News & sentiment integration                       │
│  ✅ Hover charts (7-day history)                       │
│  ✅ Blackbox AI integration                            │
│  ✅ AI Portfolio Builder                               │
│  ✅ Global portfolio analysis                          │
│                                                         │
│  ❌ No multi-portfolio management                      │
│  ❌ No adjustable parameters                           │
│  ❌ No advanced risk metrics                           │
│  ❌ No comparison features                             │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  OPI-ENHANCED.HTML v3.0 - MULTI-PORTFOLIO PRO          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✅ Multiple portfolios (unlimited)                    │
│  ✅ Adjustable parameters (target, horizon)            │
│  ✅ Multi-scenario projections                         │
│  ✅ Advanced metrics (Sharpe, Sortino, VaR)            │
│  ✅ 8+ analytical charts                               │
│  ✅ Portfolio comparison                               │
│  ✅ Organized tabs (5 sections)                        │
│  ✅ Risk analysis dashboard                            │
│                                                         │
│  ❌ No AI analysis (yet)                               │
│  ❌ No news integration (yet)                          │
│  ❌ No hover charts (yet)                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Matriz de Decisión

### ¿Cuál Archivo Usar?

```
┌────────────────────┬─────────────┬──────────────────┐
│   Tu Necesidad     │  opi.html   │  opi-enhanced    │
├────────────────────┼─────────────┼──────────────────┤
│ Un solo portafolio │     ⭐⭐⭐    │      ⭐⭐        │
│ Múltiples carteras │     ❌      │      ⭐⭐⭐⭐     │
│ Análisis con IA    │    ⭐⭐⭐⭐   │      ❌          │
│ Noticias mercado   │    ⭐⭐⭐⭐   │      ❌          │
│ Métricas avanzadas │     ⭐      │     ⭐⭐⭐⭐      │
│ Comparar estrateg. │     ❌      │     ⭐⭐⭐⭐      │
│ Ajustar parámetros │     ❌      │     ⭐⭐⭐⭐      │
│ Gráficos avanzados │     ⭐⭐    │     ⭐⭐⭐⭐      │
│ Proyecciones largo │     ⭐      │     ⭐⭐⭐⭐      │
│ Análisis de riesgo │     ⭐      │     ⭐⭐⭐⭐⭐    │
└────────────────────┴─────────────┴──────────────────┘

Leyenda: ⭐⭐⭐⭐⭐ Excelente | ⭐⭐⭐ Bueno | ⭐ Básico | ❌ No disponible
```

---

## 💡 Casos de Uso Recomendados

### Usar `opi.html` (v2.8.1) cuando:

✅ **Análisis Profundo de Activos**
```
Necesitas:
- Análisis AI de cada ticker
- Noticias recientes del mercado
- Sentimiento de inversores
- Recomendaciones COMPRAR/MANTENER/VENDER
```

✅ **Portfolio Builder Automático**
```
Quieres:
- Generar portafolio optimizado con IA
- Basado en capital, riesgo, objetivo
- Sin análisis manual
```

✅ **Datos Históricos al Vuelo**
```
Necesitas:
- Hover sobre ticker → gráfico 7 días
- Ver volatilidad rápidamente
- Máximos y mínimos recientes
```

### Usar `opi-enhanced.html` (v3.0) cuando:

✅ **Gestión Multi-Portafolio**
```
Necesitas:
- Varias estrategias simultáneas
- Portafolio Retiro vs Crecimiento
- Comparar rendimientos lado a lado
```

✅ **Análisis Cuantitativo Avanzado**
```
Requieres:
- Sharpe Ratio
- Value at Risk
- Distribución de Beta
- Riesgo de concentración
```

✅ **Planificación a Largo Plazo**
```
Quieres:
- Proyecciones 52 semanas
- Escenarios optimista/pesimista
- Desglose mensual
- Metas ajustables
```

✅ **Optimización de Estrategia**
```
Proceso:
1. Crear versión A del portafolio
2. Crear versión B alternativa
3. Comparar métricas
4. Seleccionar mejor opción
```

---

## 🔄 Flujo de Trabajo Combinado (Recomendado)

### Estrategia Híbrida

```
┌─────────────────────────────────────────────┐
│  FASE 1: ANÁLISIS (opi.html)               │
├─────────────────────────────────────────────┤
│  1. Analizar cada ticker con IA            │
│  2. Revisar noticias y sentimiento         │
│  3. Ver datos históricos (hover)           │
│  4. Identificar buenos candidatos          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  FASE 2: CONSTRUCCIÓN (opi-enhanced.html)  │
├─────────────────────────────────────────────┤
│  1. Crear portafolio con candidatos        │
│  2. Ajustar parámetros (meta, horizon)     │
│  3. Ver proyecciones multi-escenario       │
│  4. Evaluar métricas de riesgo             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  FASE 3: OPTIMIZACIÓN (opi-enhanced.html)  │
├─────────────────────────────────────────────┤
│  1. Crear variaciones del portafolio       │
│  2. Comparar Sharpe, Beta, Retorno         │
│  3. Identificar mejor balance              │
│  4. Verificar concentración y diversif.    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  FASE 4: VALIDACIÓN (opi.html)             │
├─────────────────────────────────────────────┤
│  1. Análisis AI global del portafolio      │
│  2. Verificar sentimiento de top holdings  │
│  3. Confirmar decisión final               │
└─────────────────────────────────────────────┘
```

---

## 📊 Feature Matrix Completa

### Gestión de Portafolio

| Característica | opi.html | opi-enhanced |
|----------------|----------|--------------|
| Agregar posiciones | ✅ | ✅ |
| Eliminar posiciones | ✅ | ✅ |
| Editar posiciones | ❌ | ❌ |
| Múltiples portafolios | ❌ | ✅ |
| Copiar portafolio | ❌ | ❌ |
| Exportar datos | ❌ | ❌ |
| Importar datos | ❌ | ❌ |

### Datos y Precios

| Característica | opi.html | opi-enhanced |
|----------------|----------|--------------|
| Marketstack integration | ✅ | ✅ |
| Alpha Vantage fallback | ✅ | ✅ |
| Batch requests | ✅ (50 tickers) | ✅ (50 tickers) |
| Cache inteligente | ✅ (15 min) | ✅ (15 min) |
| Auto-refresh | ✅ (5 min) | ✅ (configurable) |
| Precios históricos | ✅ (7 días) | ❌ |

### Análisis e IA

| Característica | opi.html | opi-enhanced |
|----------------|----------|--------------|
| Blackbox AI integration | ✅ | ❌ |
| News integration | ✅ | ❌ |
| Sentiment analysis | ✅ | ❌ |
| AI Portfolio Builder | ✅ | ❌ |
| Individual ticker analysis | ✅ | ❌ |
| Global portfolio analysis | ✅ | ❌ |

### Gráficos

| Gráfico | opi.html | opi-enhanced |
|---------|----------|--------------|
| Proyección semanal | ✅ (básica) | ✅ (multi-escenario) |
| Diversificación sectorial | ✅ (doughnut) | ✅ (mejorado) |
| Hover histórico | ✅ | ❌ |
| Análisis por sector | ❌ | ✅ (barras) |
| Risk/Return scatter | ❌ | ✅ |
| Distribución Beta | ❌ | ✅ |
| Concentración | ❌ | ✅ |
| Proyección mensual | ❌ | ✅ |
| Comparación portafolios | ❌ | ✅ |

### Métricas

| Métrica | opi.html | opi-enhanced |
|---------|----------|--------------|
| Valor total | ✅ | ✅ |
| Beta ponderado | ✅ | ✅ |
| Yield promedio | ✅ | ✅ |
| Meta semanal | ✅ (fija) | ✅ (ajustable) |
| Sharpe Ratio | ❌ | ✅ |
| Sortino Ratio | ❌ | ✅ |
| VaR (95%) | ❌ | ✅ |
| Max Drawdown | ❌ | ✅ |
| Peso por posición | ❌ | ✅ |
| Diversificación count | ❌ | ✅ |

### UI/UX

| Característica | opi.html | opi-enhanced |
|----------------|----------|--------------|
| Diseño responsive | ✅ | ✅ |
| Tailwind CSS | ✅ | ✅ |
| Modales | ✅ (3) | ✅ (3) |
| Tabs organizadas | ❌ | ✅ (5) |
| Selector portafolio | ❌ | ✅ |
| Panel configuración | ❌ | ✅ |
| Top/Bottom performers | ❌ | ✅ |

---

## 🎯 Recomendaciones por Perfil

### Inversor Principiante
```
Usar: opi.html (v2.8.1)

Razones:
✅ Más simple, menos opciones
✅ AI guía las decisiones
✅ Noticias ayudan a entender contexto
✅ Portfolio Builder automático

Flujo:
1. Usar AI Portfolio Builder
2. Revisar análisis AI de cada activo
3. Leer noticias y sentimiento
4. Tomar decisión informada
```

### Inversor Intermedio
```
Usar: Ambos archivos

Flujo:
1. Analizar activos en opi.html (IA + noticias)
2. Construir portafolio en opi-enhanced.html
3. Evaluar métricas de riesgo
4. Ajustar parámetros según objetivo
5. Validar con análisis AI global en opi.html
```

### Inversor Avanzado
```
Usar: opi-enhanced.html (v3.0)

Razones:
✅ Control total de parámetros
✅ Múltiples estrategias simultáneas
✅ Métricas cuantitativas avanzadas
✅ Comparación sistemática
✅ Análisis de concentración

Flujo:
1. Crear 3-4 portafolios con estrategias diferentes
2. Ajustar metas según perfil de riesgo
3. Analizar Sharpe, Sortino, VaR
4. Comparar rendimientos proyectados
5. Optimizar basado en métricas
6. Seleccionar estrategia con mejor Sharpe
```

### Trader Activo
```
Usar: opi.html (v2.8.1)

Razones:
✅ Análisis rápido con IA
✅ Noticias en tiempo real
✅ Sentimiento del mercado
✅ Datos históricos al hover
✅ Actualización cada 5 min

Configurar:
- Auto-refresh: 1-2 min (en código)
- Monitorear noticias constantemente
- Usar análisis AI para timing
```

### Gestor de Patrimonio
```
Usar: opi-enhanced.html (v3.0)

Razones:
✅ Múltiples carteras (clientes, objetivos)
✅ Métricas institucionales (Sharpe, VaR)
✅ Comparación profesional
✅ Proyecciones personalizadas
✅ Análisis de riesgo completo

Setup:
- Portafolio por cliente
- Metas ajustadas a cada perfil
- Monitoreo de concentración
- Reports de comparación
```

---

## 🔄 Tabla de Migración

### De v2.8 → v3.0

#### Paso 1: Exportar Datos
```javascript
// En opi.html, abrir consola:
const portfolio = JSON.parse(localStorage.getItem('sv_dividend_portfolio'));
console.log(JSON.stringify(portfolio, null, 2));

// Copiar output
```

#### Paso 2: Importar a v3.0
```javascript
// En opi-enhanced.html, abrir consola:
const oldPortfolio = [/* pegar datos aquí */];

portfolios['default'].positions = oldPortfolio.map(pos => ({
    ticker: pos.ticker,
    shares: pos.shares,
    avgCost: pos.avgCost,
    currentPrice: pos.currentPrice,
    beta: pos.beta,
    dgr: pos.dgr,
    dividendYield: pos.dividendYield,
    sector: pos.sector,
    name: pos.name || pos.ticker
}));

localStorage.setItem('sv_portfolios_v3', JSON.stringify(portfolios));
location.reload();
```

#### Paso 3: Verificar
```
1. Refrescar opi-enhanced.html
2. Ver que posiciones aparecen
3. Actualizar precios (automático)
4. Confirmar valores correctos
```

---

## 📈 Análisis Comparativo de Features

### Proyecciones

**opi.html (v2.8.1)**:
```javascript
Horizonte: Fijo 7 días
Escenarios: 1 (base)
Actualización: Manual (refresh)
Visualización: Línea simple azul

Caso de uso: Proyección corto plazo
```

**opi-enhanced.html (v3.0)**:
```javascript
Horizonte: Configurable (4-104 semanas)
Escenarios: 3 (optimista/base/pesimista)
Actualización: Click botón "Actualizar"
Visualización: 3 líneas con código color

Caso de uso: Planificación estratégica
```

### Diversificación

**opi.html (v2.8.1)**:
```javascript
Tipo: Doughnut básico
Datos: Solo tickers
Info: Visual simple

Limitación: No muestra % exactos
```

**opi-enhanced.html (v3.0)**:
```javascript
Tipo: Doughnut mejorado + Análisis sectorial
Datos: Sectores agregados
Info: Valores + porcentajes + gráfico barras

Extras:
- Análisis por sector (barras)
- Concentración por posición
- Alertas de sobre-exposición
```

### Métricas de Riesgo

**opi.html (v2.8.1)**:
```javascript
Disponible: Beta ponderado
Cálculo: Σ(beta × weight)
Display: Número simple

Limitación: Métrica única
```

**opi-enhanced.html (v3.0)**:
```javascript
Disponibles:
1. Beta ponderado
2. Sharpe Ratio
3. Sortino Ratio
4. VaR (95%)
5. Max Drawdown
6. Volatilidad anualizada

Cálculo: Fórmulas financieras estándar
Display: Panel dedicado + KPIs

Ventaja: Análisis completo del riesgo
```

---

## 🏆 Recomendación Final

### Para la Mayoría de Usuarios

```
1. COMENZAR con opi.html (v2.8.1)
   ├─ Más fácil de usar
   ├─ IA ayuda en decisiones
   └─ Suficiente para 1 portafolio

2. ESCALAR a opi-enhanced.html (v3.0) cuando:
   ├─ Necesites múltiples estrategias
   ├─ Quieras métricas profesionales
   ├─ Requieras comparación sistemática
   └─ Busques optimización cuantitativa
```

### Para Power Users

```
USAR AMBOS en paralelo:

opi.html → Investigación y análisis
   ├─ Analizar nuevos activos con IA
   ├─ Monitorear noticias
   └─ Validar decisiones

opi-enhanced.html → Gestión y optimización
   ├─ Administrar múltiples carteras
   ├─ Calcular métricas avanzadas
   ├─ Comparar estrategias
   └─ Planificar largo plazo
```

---

## 📦 Roadmap de Unificación

### v3.1 (Próxima Versión)

**Objetivo**: Combinar lo mejor de ambos mundos

```
public/index.html incluirá:

De v2.8:
✅ AI analysis con Blackbox
✅ News & sentiment
✅ Hover charts
✅ AI Portfolio Builder

De v3.0:
✅ Multi-portfolio management
✅ Advanced metrics
✅ Comparison features
✅ Adjustable parameters
✅ Multiple charts

Nuevas:
✅ AI analysis POR portafolio
✅ Backtesting
✅ Alertas de precio
✅ Export PDF/Excel
```

### Timeline Estimado

```
v3.1 → Q1 2026 (Febrero)
├─ Migración de features AI
├─ Unificación de UI
└─ Testing completo

v3.2 → Q2 2026 (Abril)
├─ Backtesting engine
├─ Real-time WebSockets
└─ Mobile app companion

v4.0 → Q3 2026 (Julio)
├─ Machine Learning predictions
├─ Portfolio optimization (Markowitz)
└─ Social features (compartir estrategias)
```

---

## 💾 Estructura de Datos

### v2.8 (opi.html)
```javascript
localStorage.getItem('sv_dividend_portfolio')
// Array simple:
[
  {
    id: number,
    ticker: string,
    shares: number,
    avgCost: number,
    currentPrice: number,
    beta: number,
    dgr: number,
    dividendYield: number,
    sector: string
  }
]
```

### v3.0 (opi-enhanced.html)
```javascript
localStorage.getItem('sv_portfolios_v3')
// Object con múltiples portafolios:
{
  "default": {
    name: "Portafolio Principal",
    positions: [ /* array de posiciones */ ]
  },
  "1704398400": {
    name: "Estrategia Conservadora",
    positions: [ /* array de posiciones */ ]
  }
}

localStorage.getItem('sv_settings_v3')
// Configuración global:
{
  riskFreeRate: 4.5,
  refreshInterval: 5,
  currency: 'USD',
  annualTarget: 20
}
```

---

## 🎨 Diferencias Visuales

### Layout

**opi.html**:
```
┌──────────────────────────────┐
│  Header + Botones            │
├──────────────────────────────┤
│  KPIs (4 cards)              │
├──────────────────────────────┤
│  Tabla (70%) │ AI Panel (30%)│
│              │ Diversif.     │
└──────────────────────────────┘

Scroll: Vertical
Espacio usado: ~80%
```

**opi-enhanced.html**:
```
┌──────────────────────────────┐
│  Header + Selector Portfolio │
├──────────────────────────────┤
│  [5 Tabs de Navegación]      │
├──────────────────────────────┤
│  Contenido dinámico por Tab  │
│  (Sin scroll, todo visible)  │
└──────────────────────────────┘

Scroll: Mínimo
Espacio usado: ~95%
Organización: Por secciones
```

### Color Scheme

**Ambos usan el mismo**:
```
Indigo (#6366f1): Primary, datos
Emerald (#10b981): Positivo, ganancias
Rose (#ef4444): Negativo, pérdidas
Amber (#f59e0b): Advertencia, medio
Purple (#8b5cf6): AI, premium
Slate: Backgrounds, text
```

---

## 🔗 Links Útiles

### Documentación
- [README.md](README.md) - Setup general
- [V3-FEATURES.md](V3-FEATURES.md) - Guía v3.0 completa
- [CHANGELOG.md](CHANGELOG.md) - Historia de cambios
- [FIXES.md](FIXES.md) - Issues resueltos

### Testing
- [test-apis.html](test-apis.html) - Verificar APIs

### APIs Necesarias
- Marketstack: https://marketstack.com/
- Alpha Vantage: https://www.alphavantage.co/
- Blackbox AI: https://www.blackbox.ai/
- Marketaux (opcional): https://www.marketaux.com/

---

## ✅ Checklist de Implementación

### Para opi.html (v2.8.1)
- [x] Marketstack integration
- [x] AI analysis
- [x] News & sentiment
- [x] Hover charts
- [x] Portfolio builder AI
- [x] Global analysis
- [ ] Multi-portfolio (no planeado)
- [ ] Advanced metrics (no planeado)

### Para opi-enhanced.html (v3.0)
- [x] Multi-portfolio system
- [x] Settings panel
- [x] Tab navigation
- [x] Advanced metrics
- [x] Multiple charts
- [x] Comparison features
- [x] Adjustable parameters
- [ ] AI integration (v3.1)
- [ ] News integration (v3.1)
- [ ] Hover charts (v3.1)

---

## 📞 Soporte

### Issues Comunes

**"No veo mis datos al cambiar de versión"**
- Normal: usan localStorage diferente
- Solución: Migración manual (ver arriba)

**"Los gráficos no cargan en v3.0"**
- Verificar que Chart.js cargó
- Abrir consola y buscar errores
- Intentar cambiar de tab y volver

**"Sharpe Ratio negativo"**
- Normal si portafolio está en pérdida
- O si meta anual < tasa libre riesgo
- Ajustar configuración

**"Quiero AI en v3.0"**
- Esperar v3.1 (próximamente)
- O usar opi.html para análisis AI
- O migrar funciones manualmente

---

**Última actualización**: Enero 2026
**Status**: Ambas versiones estables y funcionales
