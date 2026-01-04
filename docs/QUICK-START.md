# 🚀 Quick Start Guide - SV Portfolio Dashboard

## ⚡ Setup en 5 Minutos

### Paso 1: Obtener API Keys (3 min)

```
1. Marketstack (GRATIS - 100 req/día)
   → https://marketstack.com/signup/free
   → Copiar API key

2. Alpha Vantage (GRATIS - 500 req/día)
   → https://www.alphavantage.co/support/#api-key
   → Copiar API key

3. Blackbox AI (PAGO - opcional para IA)
   → https://www.blackbox.ai/
   → Copiar API key
```

### Paso 2: Configurar (1 min)

```javascript
// Abrir: test-apis.html
// Pegar tus keys y hacer clic en cada botón "Test"
// ✅ Todos deben mostrar "funciona correctamente"
```

### Paso 3: ¡Listo! (1 min)

```javascript
// Opción A: Análisis con IA
Abrir: opi.html
→ Click "AI Portfolio" 
→ Ingresar capital y perfil
→ ¡Listo! Portafolio generado automáticamente

// Opción B: Manual avanzado
Abrir: opi-enhanced.html
→ Click "⚙️ Configuración" → Pegar API keys
→ Click "Agregar" → Añadir posiciones
→ Explorar tabs
```

---

## 🎯 Casos de Uso Rápidos

### Caso 1: "Quiero que la IA cree mi portafolio"

```
Tiempo: 2 minutos
Archivo: opi.html

Pasos:
1. Click "AI Portfolio"
2. Ingresar:
   - Capital: $10,000
   - Riesgo: Moderado
   - Objetivo: Crecimiento
3. Click "Generar Portafolio con IA"
4. Esperar 5-10 segundos
5. Revisar recomendaciones
6. Click "Aplicar al Portafolio"
7. ✅ Listo!
```

### Caso 2: "Quiero analizar una acción antes de comprar"

```
Tiempo: 30 segundos
Archivo: opi.html

Pasos:
1. Agregar la acción al portafolio temporalmente
2. Click botón "AI" en la fila
3. Leer análisis completo:
   - Datos históricos
   - Noticias recientes
   - Sentimiento
   - Recomendación IA
4. Decidir COMPRAR/MANTENER/VENDER
5. Si no compras, eliminar de portafolio
```

### Caso 3: "Quiero comparar dos estrategias"

```
Tiempo: 10 minutos
Archivo: opi-enhanced.html

Pasos:
1. Click "Gestionar"
2. Crear "Estrategia A - Conservadora"
3. Agregar: JNJ, PG, KO, VZ (betas bajos)
4. Crear "Estrategia B - Agresiva"
5. Agregar: NVDA, TSLA, AMD (betas altos)
6. Tab "Comparación"
7. Ver tabla: Beta, Sharpe, Retorno
8. Decidir cuál usar
```

### Caso 4: "¿Cuál es mi Sharpe Ratio?"

```
Tiempo: 10 segundos
Archivo: opi-enhanced.html

Pasos:
1. Tab "Riesgo"
2. Mirar card "Sharpe Ratio"
3. Interpretación:
   > 2.0 = Excelente 🌟
   1-2 = Muy bueno ✅
   0.5-1 = Bueno 👍
   < 0.5 = Mejorar ⚠️
```

---

## 📊 Cheat Sheet de Funciones

### opi.html (v2.8.1)

| Acción | Cómo |
|--------|------|
| Agregar posición | "Simular" → Llenar form → Submit |
| Eliminar posición | Botón 🗑️ en tabla |
| Analizar con IA | Botón "AI" en tabla |
| Ver histórico | Hover sobre ticker |
| Análisis global | "Análisis Global Semanal" |
| Generar portafolio IA | "AI Portfolio" → Configurar → Generar |
| Actualizar precios | Automático cada 5 min |

### opi-enhanced.html (v3.0)

| Acción | Cómo |
|--------|------|
| Crear portafolio | "Gestionar" → Nombre → "Crear" |
| Cambiar portafolio | Dropdown header → Seleccionar |
| Agregar posición | "Agregar" → Llenar → Submit |
| Ajustar meta anual | Tab "Proyecciones" → Input "Meta Anual" |
| Ver Sharpe Ratio | Tab "Riesgo" → Card "Sharpe Ratio" |
| Comparar portafolios | Tab "Comparación" |
| Cambiar escenario | Tab "Proyecciones" → Dropdown "Escenario" |
| Configurar APIs | "⚙️ Configuración" → Pegar keys → "Guardar" |

---

## 🎨 Interface Overview

### opi.html - Layout
```
┌─────────────────────────────────────┐
│  Header: Timer | AI Portfolio | +   │
├─────────────────────────────────────┤
│  [4 KPI Cards]                      │
├────────────────────┬────────────────┤
│                    │                │
│  📋 Tabla          │  🤖 AI Panel  │
│  Posiciones        │  Forecast      │
│                    │                │
│  📈 Proyección     │  🍩 Sectores  │
│  7 días            │                │
│                    │                │
└────────────────────┴────────────────┘

Modals:
├─ AI Portfolio Builder
├─ AI Analysis
└─ Add Position
```

### opi-enhanced.html - Layout
```
┌─────────────────────────────────────┐
│  Header: [Selector] | Gestionar | ⚙│
├─────────────────────────────────────┤
│  [5 Tabs Navigation]                │
├─────────────────────────────────────┤
│                                     │
│  [6 KPI Cards - Expandido]          │
│                                     │
│  Contenido dinámico según tab:      │
│  ├─ Overview: Tabla + Charts        │
│  ├─ Analytics: 3 charts avanzados   │
│  ├─ Projections: Controles + 2 graf │
│  ├─ Risk: Métricas + 3 gráficos     │
│  └─ Comparison: Tabla + gráfico     │
│                                     │
└─────────────────────────────────────┘

Modals:
├─ Portfolio Manager
├─ Settings
└─ Add Position
```

---

## 🆘 Troubleshooting Rápido

### Problema: "No se cargan precios"
```
1. Abrir: test-apis.html
2. Test Marketstack
3. Si falla → Verificar API key
4. Si OK → Limpiar cache:
   localStorage.removeItem('sv_cached_prices')
5. Refrescar página
```

### Problema: "AI no funciona"
```
1. Verificar BLACKBOX_API_KEY en código
2. Verificar créditos/saldo en Blackbox.ai
3. Ver consola (F12) para errores específicos
4. Si dice "Rate limit" → Esperar 1 minuto
```

### Problema: "Gráficos en blanco"
```
1. Verificar que Chart.js cargó (F12 → Network)
2. Cambiar de tab y volver
3. Agregar al menos 2-3 posiciones
4. Refrescar página (F5)
```

### Problema: "Sharpe negativo"
```
No es error, significa:
→ Retorno esperado < Tasa libre riesgo
→ O portafolio en pérdidas

Solución:
1. Reducir "Meta Anual" a valor realista
2. O ajustar "Tasa libre riesgo" en config
3. O mejorar posiciones del portafolio
```

---

## 💡 Tips Pro

### Performance
```
✅ Limitar portafolios a 20-30 posiciones c/u
✅ Cache se limpia automáticamente cada 15 min
✅ Usar "Actualizar" solo cuando necesario
✅ Cerrar tabs que no uses (Chrome)
```

### Precisión
```
✅ Actualizar precios antes de tomar decisiones
✅ Verificar noticias recientes (opi.html)
✅ Usar análisis AI para contexto
✅ No confiar ciegamente en proyecciones
```

### Organización
```
✅ Nombrar portafolios descriptivamente
   "Retiro 2045" mejor que "Portfolio 2"
✅ Usar tags en nombres: [Conservador], [Agresivo]
✅ Crear versión de prueba antes de cambios grandes
✅ Documentar decisiones en notas externas
```

### Seguridad
```
⚠️ No uses en PC pública sin borrar datos
⚠️ Limpia localStorage si compartes dispositivo:
   localStorage.clear()
⚠️ No compartas screenshots con API keys visibles
```

---

## 🎯 Objetivos de Retorno Realistas

### Por Perfil de Riesgo

```
Conservador (Beta < 0.7)
├─ Meta anual: 8-12%
├─ Meta semanal: 0.15-0.22%
├─ Sharpe esperado: 0.8-1.2
└─ Ejemplo: JNJ, PG, VZ, T

Moderado (Beta 0.7-1.2)
├─ Meta anual: 15-20%
├─ Meta semanal: 0.27-0.35%
├─ Sharpe esperado: 1.0-1.5
└─ Ejemplo: AAPL, MSFT, JPM, ABBV

Agresivo (Beta > 1.2)
├─ Meta anual: 25-35%
├─ Meta semanal: 0.43-0.59%
├─ Sharpe esperado: 0.9-1.3
└─ Ejemplo: NVDA, TSLA, AMD, GOOGL

Muy Agresivo (Beta > 1.5)
├─ Meta anual: 40-60%+
├─ Meta semanal: 0.65-0.90%+
├─ Sharpe esperado: 0.7-1.1
└─ Ejemplo: TSLA, AMD concentrados
```

---

## 📅 Workflow Semanal Recomendado

### Lunes (15 min)
```
1. Abrir opi.html
2. Revisar análisis global del portafolio
3. Leer noticias de top holdings
4. Identificar cambios importantes
```

### Miércoles (10 min)
```
1. Abrir opi-enhanced.html
2. Verificar progreso hacia meta semanal
3. Tab "Riesgo" → Revisar VaR
4. Ajustar si hay concentración >30%
```

### Viernes (20 min)
```
1. opi.html → Análisis AI de cada posición
2. Verificar sentimiento de noticias
3. opi-enhanced.html → Tab "Proyecciones"
4. Evaluar si meta semanal se cumplió
5. Planear ajustes para próxima semana
```

---

## 🎁 Bonus: Snippets Útiles

### Consola: Ver Todos los Datos
```javascript
// En cualquier versión:
console.table(
    JSON.parse(localStorage.getItem('sv_portfolios_v3') || 
    localStorage.getItem('sv_dividend_portfolio'))
);
```

### Consola: Calcular Sharpe Manual
```javascript
const expectedReturn = 20; // Tu meta anual
const riskFreeRate = 4.5;  // T-Bills
const volatility = 12;      // Estimada

const sharpe = (expectedReturn - riskFreeRate) / volatility;
console.log('Sharpe Ratio:', sharpe.toFixed(2));
```

### Consola: Limpiar Todo
```javascript
// ⚠️ Cuidado: Borra TODO
localStorage.clear();
location.reload();
```

### Consola: Backup Manual
```javascript
// Exportar todo
const backup = {
    portfolios: localStorage.getItem('sv_portfolios_v3'),
    prices: localStorage.getItem('sv_cached_prices'),
    settings: localStorage.getItem('sv_settings_v3')
};
console.log(JSON.stringify(backup));
// Copiar y guardar en archivo .txt
```

---

## 📱 Mobile Support

### Compatibilidad
```
✅ Responsive design en ambas versiones
✅ Funciona en tablets
⚠️ En móviles pequeños:
   - Algunos gráficos se ven comprimidos
   - Tablas requieren scroll horizontal
   - Mejor experiencia: tablet o desktop
```

### Recomendaciones Mobile
```
1. Orientación horizontal preferida
2. Usar tabs en v3.0 (más organizado)
3. Zoom del navegador al 90% si es necesario
```

---

## 🎓 Recursos de Aprendizaje

### Si eres nuevo en inversiones
```
1. Leer: README.md sección "Métricas"
2. Entender: Beta, Sharpe, Diversificación
3. Empezar: Portafolio conservador
4. Usar: AI Portfolio Builder en opi.html
```

### Si entiendes finanzas pero no tech
```
1. Todo es point-and-click
2. No requiere programación
3. API keys = copiar/pegar
4. Documentación clara paso a paso
```

### Si eres desarrollador
```
1. Ver: enhanced-additions.js para referencia
2. Código: Bien comentado en HTML
3. Estructura: Modular y extensible
4. APIs: REST simples
```

---

## ✅ Verification Checklist

### Después del Setup
```
[ ] test-apis.html → Todos los tests en ✅
[ ] opi.html carga sin errores
[ ] opi-enhanced.html carga sin errores
[ ] Puedo agregar una posición
[ ] Los precios se actualizan
[ ] Los gráficos se renderizan
[ ] Análisis AI funciona (si configurado)
```

### Antes de Usar en Serio
```
[ ] Entiendo qué es Beta
[ ] Entiendo qué es Sharpe Ratio
[ ] Sé mi perfil de riesgo
[ ] Tengo meta de retorno clara
[ ] He probado con datos de prueba
[ ] Leí al menos README.md
```

---

## 🎯 Next Steps

### Después de Quick Start

```
Nivel 1 (Ya hiciste esto)
├─ ✅ APIs configuradas
├─ ✅ Archivos funcionando
└─ ✅ Primera posición agregada

Nivel 2 (Hazlo ahora - 30 min)
├─ [ ] Leer V3-FEATURES.md
├─ [ ] Crear 2-3 portafolios
├─ [ ] Explorar cada tab de v3.0
└─ [ ] Usar AI analysis en v2.8

Nivel 3 (Esta semana - 2 hrs)
├─ [ ] Leer VERSION-COMPARISON.md
├─ [ ] Crear portafolio real
├─ [ ] Calcular y entender Sharpe
├─ [ ] Ajustar parámetros de proyección
└─ [ ] Comparar estrategias

Nivel 4 (Este mes)
├─ [ ] Optimizar basado en métricas
├─ [ ] Backtesting manual
├─ [ ] Workflow personalizado
└─ [ ] ¡Dominio completo del sistema!
```

---

## 🔗 Navegación Rápida

### Documentos por Tiempo de Lectura

```
⚡ 5 min:   Este archivo (QUICK-START.md)
⚡ 10 min:  README.md
⚡ 15 min:  CHANGELOG.md
⚡ 20 min:  FIXES.md
⚡ 30 min:  VERSION-COMPARISON.md
⚡ 45 min:  V3-FEATURES.md
⚡ 5 min:   INDEX.md (referencia)
```

### Por Objetivo

```
Setup inicial       → README.md
Aprender v3.0       → V3-FEATURES.md
Decidir versión     → VERSION-COMPARISON.md
Resolver problemas  → FIXES.md + test-apis.html
Ver qué hay         → INDEX.md
Empezar YA          → Este archivo
```

---

## 🎉 ¡Listo para Empezar!

```
Has completado el Quick Start ✅

Próximos pasos recomendados:
1. Agregar 3-5 posiciones reales
2. Explorar todos los tabs de v3.0
3. Probar análisis AI en v2.8
4. Leer V3-FEATURES.md cuando tengas tiempo

¡Buena suerte con tus inversiones! 📈
```

---

**⏱️ Tiempo total de este Quick Start**: 5-10 minutos  
**🎯 Objetivo**: Estar operativo AHORA  
**✅ Siguiente lectura**: [V3-FEATURES.md](V3-FEATURES.md) o [VERSION-COMPARISON.md](VERSION-COMPARISON.md)
