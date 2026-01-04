# SV Dashboard v3.0 - Guía Completa de Nuevas Características

## 🎯 Resumen Ejecutivo

**opi-enhanced.html** es la versión 3.0 del dashboard con capacidades profesionales de gestión de portafolios y análisis avanzado.

### Comparación Rápida

| Característica | v2.8 (opi.html) | v3.0 (opi-enhanced.html) |
|----------------|-----------------|--------------------------|
| Portafolios | 1 único | ✅ Múltiples ilimitados |
| Parámetros ajustables | ❌ Fijos | ✅ Configurables |
| Proyecciones | Básica (7 días) | ✅ Multi-escenario (52 semanas) |
| Métricas de riesgo | Beta básico | ✅ Sharpe, Sortino, VaR, Drawdown |
| Gráficos | 2 básicos | ✅ 8+ avanzados |
| Análisis comparativo | ❌ No | ✅ Sí |
| Pestañas organizadas | ❌ No | ✅ 5 secciones |

---

## 🗂️ Sistema de Múltiples Portafolios

### Crear y Gestionar

```
┌─────────────────────────────────────────┐
│  📁 Gestión de Portafolios             │
├─────────────────────────────────────────┤
│                                         │
│  [Nombre nuevo portafolio] [+ Crear]   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📊 Portafolio Principal         │   │
│  │    8 posiciones                 │   │
│  │    [Seleccionar] [Eliminar]     │   │
│  ├─────────────────────────────────┤   │
│  │ 💼 Portafolio Conservador       │   │
│  │    5 posiciones                 │   │
│  │    [Seleccionar] [Eliminar]     │   │
│  ├─────────────────────────────────┤   │
│  │ 🚀 Portafolio Agresivo          │   │
│  │    12 posiciones                │   │
│  │    [Seleccionar] [Eliminar]     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Casos de Uso

1. **Estrategias Separadas**:
   - Portafolio Largo Plazo (conservador)
   - Portafolio Trading (agresivo)
   - Portafolio Dividendos (high yield)

2. **Simulación de Escenarios**:
   - Crear versión alternativa
   - Comparar rendimientos
   - Tomar decisión informada

3. **Gestión por Objetivos**:
   - Retiro (bajo riesgo)
   - Crecimiento (alto riesgo)
   - Balanceado

---

## ⚙️ Panel de Configuración Global

### Acceso
```
Header → Botón "⚙️ Configuración"
```

### Parámetros Ajustables

#### 1. **API Keys** (Seguridad)
```javascript
✅ Marketstack API Key
✅ Alpha Vantage API Key
✅ Blackbox AI API Key
✅ Marketaux API Key (opcional)
```

#### 2. **Preferencias de Cálculo**
```javascript
Tasa Libre de Riesgo: 4.5% (ajustable)
├─ Afecta: Sharpe Ratio, Sortino Ratio
└─ Referencia: T-Bills USA 10Y

Intervalo de Actualización: 5 min (ajustable)
├─ Auto-refresh de precios
└─ Rango: 1-60 minutos

Moneda Base: USD (ajustable)
├─ Opciones: USD, EUR, GBP
└─ Afecta visualización
```

---

## 📊 Sistema de Pestañas

### Vista General (Overview)
```
┌────────────────────────────────────────────┐
│  📊 KPIs (6 métricas principales)         │
│  ├─ Valor Total                           │
│  ├─ Meta Semanal (auto-calculada)         │
│  ├─ Beta (con clasificación)              │
│  ├─ Sharpe Ratio                          │
│  ├─ Max Drawdown                          │
│  └─ Diversificación (# sectores)          │
├────────────────────────────────────────────┤
│  📋 Tabla de Posiciones                   │
│  └─ Con columna "Peso %" agregada         │
├────────────────────────────────────────────┤
│  🍩 Diversificación Sectorial             │
│  📈 Top/Bottom 3 Performers               │
└────────────────────────────────────────────┘
```

### Análisis (Analytics)
```
┌────────────────────────────────────────────┐
│  📊 Análisis por Sector                   │
│  └─ Gráfico de barras con valores         │
├────────────────────────────────────────────┤
│  📈 Matriz Riesgo/Retorno                 │
│  └─ Scatter plot: Beta vs Performance     │
├────────────────────────────────────────────┤
│  🔥 Matriz de Correlación                 │
│  └─ Heatmap entre activos (placeholder)   │
└────────────────────────────────────────────┘
```

### Proyecciones (Projections)
```
┌────────────────────────────────────────────┐
│  ⚙️ CONTROLES                             │
│  ├─ Meta Anual: [20%] ← ajustable         │
│  ├─ Horizonte: [52 semanas] ← ajustable   │
│  ├─ Escenario: [Base/Optimista/Pesimista] │
│  └─ [🔄 Actualizar]                       │
├────────────────────────────────────────────┤
│  📈 PROYECCIÓN MULTI-ESCENARIO            │
│  ├─ Línea verde: Optimista (+10%)         │
│  ├─ Línea azul sólida: Base               │
│  └─ Línea roja: Pesimista (-10%)          │
├────────────────────────────────────────────┤
│  📅 DESGLOSE MENSUAL                      │
│  └─ Barras: Ganancia proyectada/mes       │
└────────────────────────────────────────────┘
```

### Riesgo (Risk)
```
┌────────────────────────────────────────────┐
│  🛡️ MÉTRICAS DE RIESGO                    │
│  ├─ Volatilidad Anualizada                │
│  ├─ Sharpe Ratio                          │
│  ├─ Sortino Ratio                         │
│  └─ VaR (Value at Risk 95%)               │
├────────────────────────────────────────────┤
│  📊 DISTRIBUCIÓN DE BETA                  │
│  └─ Barras horizontales por rango         │
├────────────────────────────────────────────┤
│  ⚠️ RIESGO DE CONCENTRACIÓN               │
│  └─ Top 5 posiciones con código color:    │
│     🔴 >30% (alto riesgo)                 │
│     🟡 20-30% (medio)                     │
│     🟢 <20% (bajo)                        │
└────────────────────────────────────────────┘
```

### Comparación (Comparison)
```
┌────────────────────────────────────────────┐
│  📊 TABLA COMPARATIVA                     │
│  ├─ Todos los portafolios en una tabla    │
│  ├─ Métricas: Valor, Beta, Sharpe, Ret.   │
│  └─ Portafolio actual marcado con ⭐      │
├────────────────────────────────────────────┤
│  📈 GRÁFICO COMPARATIVO                   │
│  ├─ Eje Y izq: Valores (barras)           │
│  └─ Eje Y der: Beta (línea)               │
└────────────────────────────────────────────┘
```

---

## 📐 Parámetros de Proyección Ajustables

### 1. Meta Anual (%)
```
Default: 20%
Rango: 1-100%

Afecta:
- Meta semanal = (1 + target)^(1/52) - 1
- Meta mensual = (1 + target)^(1/12) - 1
- Proyecciones en todos los gráficos
- Cálculo de Sharpe Ratio
```

**Ejemplo**:
```javascript
Meta 15% → Semanal: 0.27%
Meta 20% → Semanal: 0.35%
Meta 30% → Semanal: 0.52%
```

### 2. Horizonte Temporal (semanas)
```
Default: 52 semanas (1 año)
Rango: 4-104 semanas

Afecta:
- Extensión del gráfico de proyección
- Visualización de largo/corto plazo
```

### 3. Escenarios de Proyección
```
Optimista: +10% sobre meta
Base: Según meta configurada
Pesimista: -10% bajo meta

Visualización:
- Verde punteado (optimista)
- Azul sólido (base)
- Rojo punteado (pesimista)
```

---

## 📊 Gráficos Nuevos

### 1. **Análisis por Sector** (Barras)
```javascript
Muestra: Valor ($) por sector
Tooltip: Valor + porcentaje del total
Uso: Identificar sobre-exposición sectorial
```

### 2. **Matriz Riesgo/Retorno** (Scatter)
```javascript
Eje X: Beta (riesgo)
Eje Y: Retorno % (gain/loss)
Puntos: Cada posición

Interpretación:
- Alto/Derecha: Alto riesgo, alto retorno ⚡
- Bajo/Izquierda: Bajo riesgo, bajo retorno 🐢
- Bajo/Derecha: ⭐ IDEAL (bajo riesgo, alto retorno)
- Alto/Izquierda: ❌ EVITAR (alto riesgo, bajo retorno)
```

### 3. **Proyección Multi-Escenario** (Líneas)
```javascript
3 líneas en un gráfico:
- Optimista (verde, punteada)
- Base (azul, sólida)
- Pesimista (roja, punteada)

Interacción:
- Hover: Ver valor exacto en cada punto
- Zoom: Ajustar horizonte temporal
```

### 4. **Desglose Mensual** (Barras)
```javascript
12 barras: Ganancia proyectada por mes
Color: Verde si positivo
Tooltip: Valor en dólares
```

### 5. **Distribución de Beta** (Barras Horizontales)
```javascript
Rangos:
- Muy Bajo (<0.5): Verde
- Bajo (0.5-0.8): Azul
- Medio (0.8-1.2): Amarillo
- Alto (1.2-1.5): Naranja
- Muy Alto (>1.5): Rojo

Valor: Suma de posiciones en cada rango
```

### 6. **Riesgo de Concentración** (Barras)
```javascript
Top 5 posiciones + "Otros"
Código de color:
- 🔴 Rojo: >30% (peligro)
- 🟡 Amarillo: 20-30% (cuidado)
- 🟢 Verde: <20% (ok)

Recomendación:
Ninguna posición >30% del portafolio
```

### 7. **Comparación de Portafolios** (Dual Axis)
```javascript
Barras: Valor de cada portafolio
Línea: Beta de cada portafolio

Uso: Ver balance riesgo/valor
```

### 8. **Top/Bottom Performers** (Lista)
```javascript
Top 3: Mejores rendimientos (verde)
Bottom 3: Peores rendimientos (rojo)

Actualización: Tiempo real
```

---

## 🎓 Métricas Avanzadas Explicadas

### Sharpe Ratio
```
Fórmula: (Retorno - Tasa Libre Riesgo) / Volatilidad

Interpretación:
> 2.0  → Excelente 🌟
1.0-2.0 → Muy Bueno ✅
0.5-1.0 → Bueno 👍
< 0.5  → Regular ⚠️

Uso: Mide retorno ajustado por riesgo
```

### Sortino Ratio
```
Similar a Sharpe pero solo penaliza volatilidad negativa

Interpretación:
> Sharpe → Portfolio protege bien las caídas
< Sharpe → Portfolio tiene más downside risk

Uso: Mejor que Sharpe para estrategias asimétricas
```

### VaR (Value at Risk 95%)
```
Pérdida máxima esperada en 95% de los casos

Ejemplo:
VaR = $5,000 → En un día malo típico, 
no esperamos perder más de $5,000

Uso: Cuantificar riesgo en dólares
```

### Max Drawdown
```
Caída máxima desde el pico más alto

Ejemplo:
Max Drawdown 15% → En el peor momento,
el portafolio cayó 15% desde su máximo

Uso: Preparación psicológica para volatilidad
```

### Beta Ponderado
```
Beta promedio considerando el peso de cada posición

Fórmula: Σ(Beta_i × Peso_i)

Ejemplo:
AAPL (Beta 1.2) - 60% del portafolio
JNJ (Beta 0.5) - 40% del portafolio
Beta Ponderado = (1.2 × 0.6) + (0.5 × 0.4) = 0.92
```

---

## 🎮 Flujo de Trabajo Recomendado

### Para Nuevo Usuario

1. **Configuración Inicial**
   ```
   1. Abrir opi-enhanced.html
   2. Click "⚙️ Configuración"
   3. Ingresar API keys
   4. Ajustar tasa libre de riesgo (T-Bills actuales)
   5. Guardar
   ```

2. **Crear Primer Portafolio**
   ```
   1. Click "📁 Gestionar"
   2. Crear portafolio (ej: "Mi Estrategia 2026")
   3. Seleccionarlo
   4. Agregar posiciones
   ```

3. **Explorar Secciones**
   ```
   Vista General → Ver resumen
   Análisis → Entender composición
   Proyecciones → Ajustar parámetros
   Riesgo → Evaluar exposición
   ```

### Para Usuario Avanzado

1. **Crear Múltiples Estrategias**
   ```
   - Portafolio A: Conservador (Beta < 0.7)
   - Portafolio B: Moderado (Beta 0.8-1.0)
   - Portafolio C: Agresivo (Beta > 1.2)
   ```

2. **Optimizar con Proyecciones**
   ```
   Tab "Proyecciones":
   1. Ajustar meta anual según objetivo
   2. Ver escenarios optimista/pesimista
   3. Evaluar si meta es realista
   4. Ajustar posiciones según proyección
   ```

3. **Gestión de Riesgo**
   ```
   Tab "Riesgo":
   1. Revisar Sharpe (debe ser > 1.0)
   2. Verificar VaR (< 5% del portafolio)
   3. Corregir concentración (ninguna >30%)
   4. Balancear distribución de Beta
   ```

4. **Comparar y Decidir**
   ```
   Tab "Comparación":
   1. Ver todos los portafolios lado a lado
   2. Identificar el mejor Sharpe
   3. Evaluar trade-offs
   4. Seleccionar estrategia óptima
   ```

---

## 🔢 Fórmulas y Cálculos

### Meta Semanal Auto-Calculada
```javascript
// Basada en meta anual
weeklyRate = (1 + annualTarget)^(1/52) - 1

Ejemplo (Meta 20%):
weeklyRate = (1.20)^(1/52) - 1 = 0.0035 = 0.35%
weeklyValue = portfolioTotal × 0.0035
```

### Proyección Compuesta
```javascript
// Crecimiento compuesto semanal
value(week) = initialValue × (1 + weeklyRate)^week

Escenarios:
optimistic = (1 + target × 1.1)^(1/52) - 1
base = (1 + target)^(1/52) - 1  
pessimistic = (1 + target × 0.9)^(1/52) - 1
```

### Sharpe Ratio
```javascript
sharpe = (expectedReturn - riskFreeRate) / volatility

Donde:
- expectedReturn = meta anual configurada
- riskFreeRate = configuración (default 4.5%)
- volatility = beta × marketVolatility (15% asumido)
```

### Peso de Posición
```javascript
weight = (shares × currentPrice) / portfolioTotal × 100

Alerta si:
weight > 30% → "⚠️ Alta concentración"
weight > 40% → "🔴 Concentración peligrosa"
```

---

## 🎨 Mejoras de UI/UX

### 1. **Navegación por Tabs**
- ✅ Sin scroll infinito
- ✅ Contenido organizado por propósito
- ✅ Transiciones suaves

### 2. **Selector de Portafolio**
```html
Header → Dropdown con todos los portafolios
Cambio → Actualización instantánea de TODO
```

### 3. **KPIs con Clasificación**
```javascript
Beta < 0.85 → "Bajo Riesgo" (verde)
Beta 0.85-1.2 → "Riesgo Medio" (amarillo)
Beta > 1.2 → "Alto Riesgo" (rojo)

Sharpe > 1.0 → "Excelente" (verde)
Sharpe 0.5-1.0 → "Bueno" (amarillo)
Sharpe < 0.5 → "Regular" (rojo)
```

### 4. **Código de Colores Consistente**
```
Verde (#10b981): Positivo, bueno, bajo riesgo
Azul (#6366f1): Neutral, base, información
Amarillo (#f59e0b): Advertencia, medio
Rojo (#ef4444): Negativo, peligro, alto riesgo
Púrpura (#8b5cf6): Premium, AI, especial
```

---

## 🔧 Funciones JavaScript Clave

### `switchTab(tabName)`
```javascript
// Gestión de navegación
- Oculta todos los tabs
- Muestra el seleccionado
- Actualiza gráficos específicos del tab
```

### `updateProjections()`
```javascript
// Recalcula todo basado en parámetros
1. Lee meta anual
2. Lee horizonte
3. Lee escenario
4. Recalcula proyecciones
5. Actualiza KPIs
6. Re-renderiza gráficos
```

### `updateRiskMetrics()`
```javascript
// Calcula métricas avanzadas
1. Volatilidad = Beta × 15%
2. Sharpe = (Return - RiskFree) / Vol
3. Sortino = Sharpe × 1.4 (simplificado)
4. VaR = Total × 0.05 × Beta
5. MaxDrawdown = Beta × 8% (estimado)
```

### `calculateStats()`
```javascript
// Agregación de datos del portafolio
return {
    total: Σ(shares × price),
    cost: Σ(shares × avgCost),
    beta: Σ(beta × value) / total,
    yield: Σ(yield × value) / total,
    dgr: Σ(dgr × value) / total
}
```

---

## 🚀 Roadmap de Características

### Implementadas en v3.0
- ✅ Múltiples portafolios
- ✅ Parámetros configurables
- ✅ Proyecciones multi-escenario
- ✅ Métricas avanzadas (Sharpe, Sortino, VaR)
- ✅ 8+ gráficos informativos
- ✅ Comparación de portafolios
- ✅ Sistema de tabs organizados
- ✅ Top/Bottom performers

### Próximas Versiones (v3.1+)

#### Fase 1: Integración Completa
- [ ] Migrar funcionalidad AI de opi.html
- [ ] Popup hover con gráficos históricos
- [ ] AI Portfolio Builder
- [ ] Análisis AI con noticias y sentimiento

#### Fase 2: Features Avanzadas
- [ ] Matriz de correlación real (con datos históricos)
- [ ] Backtesting de estrategias
- [ ] Alertas de precio configurables
- [ ] Rebalanceo automático
- [ ] Export a PDF/Excel

#### Fase 3: Optimización
- [ ] WebSocket para precios en tiempo real
- [ ] Optimización de Markowitz
- [ ] Monte Carlo simulation
- [ ] Machine Learning predictions

---

## 📖 Guía Rápida de Uso

### Escenario 1: Crear Portafolio Diversificado
```
1. Configuración → Meta Anual: 18%
2. Gestionar → Crear "Diversificado 2026"
3. Agregar posiciones:
   - 3-4 Tech (Beta alto)
   - 3-4 Salud (Beta bajo)
   - 2-3 Finanzas (Beta medio)
4. Vista General → Verificar diversificación
5. Riesgo → Asegurar ninguna posición >25%
6. Proyecciones → Evaluar meta es alcanzable
```

### Escenario 2: Optimizar Portafolio Existente
```
1. Vista General → Identificar pesos
2. Análisis → Ver sector sobre-representado
3. Riesgo → Detectar concentración
4. Agregar/eliminar para balancear
5. Proyecciones → Simular resultados
6. Comparación → Crear versión alternativa y comparar
```

### Escenario 3: Comparar Estrategias
```
1. Crear Portafolio A: Conservador
2. Crear Portafolio B: Agresivo
3. Agregar mismas posiciones con pesos diferentes
4. Tab Comparación → Ver tabla comparativa
5. Evaluar Sharpe, Beta, Retorno
6. Seleccionar mejor opción
```

---

## 🎯 Best Practices

### Diversificación Óptima
```
✅ Mínimo 5 sectores diferentes
✅ Ninguna posición >30% del total
✅ Beta promedio 0.8-1.2 (moderado)
✅ Top 3 posiciones <60% del total
```

### Configuración de Metas
```
Conservador: 10-12% anual
Moderado: 15-20% anual
Agresivo: 25-35% anual
Muy Agresivo: >40% anual

⚠️ Metas >30% requieren alto riesgo (Beta >1.5)
```

### Frecuencia de Actualización
```
Activo (day trading): 1-5 min
Normal (swing): 15-30 min
Pasivo (largo plazo): 60+ min
```

---

## 🔗 Migración desde v2.8

### Opción 1: Mantener Ambos
```
opi.html → Análisis AI profundo + noticias
opi-enhanced.html → Gestión multi-portafolio + métricas

Usar cada uno según necesidad
```

### Opción 2: Integración Futura
```
Próxima versión combinará:
- Multi-portafolio de v3.0
- AI analysis de v2.8
- Todas las características
```

### Migrar Datos
```javascript
// Los portafolios usan localStorage diferente
v2.8: 'sv_dividend_portfolio'
v3.0: 'sv_portfolios_v3'

// Para migrar manualmente:
1. Abrir v2.8
2. Copiar posiciones
3. Abrir v3.0
4. Agregar manualmente (o usar consola)
```

---

## 📊 Ejemplo Completo de Uso

### Setup Inicial
```javascript
// 1. Configurar APIs
Marketstack: 68b8070ec719075f3ea37d9069d4ea68
Alpha Vantage: CJIOJ9QSU8A2JM7R
Blackbox: sk-Vl6HBMkEaEzvj6x_qfrfhA

// 2. Configurar parámetros
Tasa libre riesgo: 4.5%
Meta anual: 20%
Actualización: 5 min
```

### Crear Portafolio Ejemplo
```javascript
Portafolio: "Growth 2026"
Meta: 25% anual

Posiciones:
- NVDA: 10 acciones @ $450 (Tech/AI - Alto crecimiento)
- MSFT: 15 acciones @ $375 (Tech - Estable)
- ABBV: 20 acciones @ $165 (Salud - Dividendos)
- JPM: 25 acciones @ $155 (Finanzas - Balance)
- COP: 30 acciones @ $110 (Energía - Diversificación)

Total: ~$20,000
```

### Análisis Paso a Paso
```
1. Vista General
   ✓ Valor total: $20,450
   ✓ Meta semanal: +$71.58 (0.35%)
   ✓ Beta: 1.08 (Riesgo Medio)
   ✓ 4 sectores

2. Análisis
   ⚠️ Tecnología: 55% (alta concentración)
   ✓ Salud: 16%
   ✓ Finanzas: 19%
   ✓ Energía: 10%
   
   Acción: Reducir tech o aumentar otros

3. Proyecciones
   ✓ Optimista (27.5%): $25,625 en 1 año
   ✓ Base (25%): $25,562
   ✓ Pesimista (22.5%): $25,050
   
   Rango razonable ✅

4. Riesgo
   ⚠️ NVDA: 22% del portafolio (límite ok)
   ✓ Sharpe: 1.37 (Excelente)
   ✓ VaR 95%: $1,080 (5.3% - aceptable)
   ✓ Max Drawdown esperado: ~8.6%

5. Decisión
   Portafolio viable con ajuste menor:
   Reducir NVDA 2-3 acciones, aumentar ABBV
```

---

## 📝 Notas Técnicas

### LocalStorage Keys
```javascript
'sv_portfolios_v3'      → Todos los portafolios
'sv_cached_prices'      → Cache de precios (compartido con v2.8)
'sv_settings_v3'        → Configuración global
'sv_historical_data'    → Cache históricos (compartido)
```

### Compatibilidad
```
✅ Chrome/Edge: Completo
✅ Firefox: Completo
✅ Safari: Completo
⚠️ IE11: No soportado (usa ES6+)
```

### Performance
```
Portafolios simultáneos: Ilimitados
Posiciones por portafolio: Recomendado <50
Gráficos simultáneos: 8+
Memoria: ~5-10MB (con cache)
```

---

## 🆘 Troubleshooting

### "Gráficos no se actualizan"
```
Solución: Tab Proyecciones → Click "🔄 Actualizar"
```

### "Comparación muestra datos viejos"
```
Solución: Cambiar tab y volver a Comparación
Auto-actualiza al entrar
```

### "Sharpe Ratio muy bajo"
```
Causas:
- Meta anual demasiado alta
- Beta promedio muy alto
- Tasa libre riesgo configurada alta

Solución:
1. Reducir meta anual a nivel realista
2. Agregar activos de bajo beta
3. Verificar tasa libre riesgo (debe ser ~4-5%)
```

### "Max Drawdown asusta"
```
Info: Es una ESTIMACIÓN basada en Beta
No es predicción exacta

Si quieres reducirlo:
1. Reducir Beta promedio
2. Agregar activos defensivos
3. Diversificar más sectores
```

---

**Versión**: v3.0
**Fecha**: Enero 2026
**Autor**: Sebastian Vernis
**Status**: ✅ Funcional - Listo para uso
