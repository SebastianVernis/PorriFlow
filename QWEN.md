# 🎯 QWEN.md - inversion (SV Portfolio Manager)

## 📋 Información General

| Campo | Valor |
|-------|-------|
| **Nombre del Proyecto** | inversion (SV Portfolio Manager) |
| **Versión** | 3.0.0 |
| **Estado** | ✅ PRODUCCIÓN |
| **Tipo** | SaaS Web Application |
| **Categoría** | Dashboard de Inversiones con IA |
| **Fecha de Análisis** | 2026-01-09 |

---

## 🎯 Propósito del Proyecto

Dashboard profesional de gestión de portafolios de inversión con análisis de IA, 107 símbolos financieros, 15 métricas profesionales y 8 gráficos interactivos. Sistema multi-usuario con análisis de sentimiento y noticias en tiempo real.

**Misión:** Democratizar el análisis profesional de inversiones con tecnología de IA.

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

**Backend:**
- Node.js 18+
- Express.js
- PostgreSQL Database
- Prisma ORM
- JWT Authentication

**Frontend:**
- Vanilla JavaScript
- HTML5/CSS3
- Tailwind CSS
- Chart.js (Gráficos)
- ApexCharts (Gráficos avanzados)

**APIs Integradas:**
- **Blackbox AI** - Análisis con IA
- **Alpha Vantage** - Datos financieros
- **News API** - Noticias financieras
- **Sentiment Analysis API** - Análisis de sentimiento

**Deployment:**
- **Backend:** Render (Free tier)
- **Frontend:** Vercel (Free tier)
- **Database:** Neon PostgreSQL (Free tier)

---

## ✨ Características Principales

### 1. 107 Símbolos Financieros

**Acciones (40):**
- Tech: AAPL, MSFT, GOOGL, AMZN, META, NVDA, TSLA
- Finance: JPM, BAC, GS, V, MA
- Consumer: WMT, KO, PEP, NKE, MCD
- Healthcare: JNJ, PFE, UNH, ABBV
- Energy: XOM, CVX, COP
- Y más...

**Crypto (20):**
- BTC, ETH, BNB, ADA, SOL, DOT, MATIC, AVAX, LINK, UNI, etc.

**Índices (15):**
- S&P 500, NASDAQ, Dow Jones, Russell 2000, VIX, etc.

**ETFs (20):**
- SPY, QQQ, IWM, DIA, VTI, VOO, etc.

**Futuros (7):**
- Oro, Plata, Petróleo, Gas Natural, Trigo, Maíz, Soja

**Forex (5):**
- EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD

### 2. AI Analysis (Blackbox + News + Sentiment)
- Análisis técnico con IA
- Análisis fundamental
- Sentiment analysis de noticias
- Recomendaciones personalizadas
- Alertas inteligentes

### 3. Multi-Usuario (JWT + PostgreSQL)
- Registro y login
- Portafolios personalizados
- Watchlists
- Alertas configurables
- Historial de operaciones

### 4. 15 Métricas Profesionales

**Rendimiento:**
1. Total Return
2. Annualized Return
3. CAGR (Compound Annual Growth Rate)

**Riesgo:**
4. Volatility (Desviación estándar)
5. Beta (vs mercado)
6. VaR (Value at Risk)
7. CVaR (Conditional VaR)
8. Maximum Drawdown

**Ratios:**
9. Sharpe Ratio
10. Sortino Ratio
11. Calmar Ratio
12. Information Ratio
13. Treynor Ratio

**Otros:**
14. Alpha
15. Correlation Matrix

### 5. 8 Gráficos Interactivos

1. **Price Chart** - Precio histórico con indicadores
2. **Portfolio Allocation** - Distribución de activos
3. **Performance Chart** - Rendimiento vs benchmark
4. **Risk-Return Scatter** - Riesgo vs retorno
5. **Drawdown Chart** - Caídas históricas
6. **Correlation Heatmap** - Correlaciones entre activos
7. **Sector Allocation** - Distribución por sector
8. **Cumulative Returns** - Retornos acumulados

### 6. News Feed en Tiempo Real
- Noticias financieras actualizadas
- Filtrado por símbolo
- Sentiment analysis
- Fuentes verificadas

### 7. Alertas Inteligentes
- Precio objetivo alcanzado
- Cambio de tendencia
- Noticias importantes
- Métricas fuera de rango

---

## 📂 Estructura del Proyecto

```
inversion/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── portfolioController.js
│   │   │   ├── symbolsController.js
│   │   │   └── aiController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Portfolio.js
│   │   │   └── Transaction.js
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── marketDataService.js
│   │   │   └── newsService.js
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   ├── js/
│   │   │   ├── dashboard.js
│   │   │   ├── charts.js
│   │   │   └── portfolio.js
│   │   └── index.html
│   └── package.json
└── docs/
    └── README.md
```

---

## 🚀 Deployment

### Backend (Render - Free Tier)
```bash
# Build command
npm install && npx prisma generate && npx prisma migrate deploy

# Start command
npm start

# Environment variables
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
BLACKBOX_API_KEY="..."
ALPHA_VANTAGE_KEY="..."
NEWS_API_KEY="..."
```

### Frontend (Vercel - Free Tier)
```bash
# Build command
npm run build

# Output directory
public
```

### Database (Neon PostgreSQL - Free Tier)
- 0.5 GB storage
- 1 database
- Serverless PostgreSQL
- Auto-scaling

---

## 🔧 Configuración Requerida

### Variables de Entorno (Backend)

```bash
# Server
NODE_ENV="production"
PORT="3000"

# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# JWT
JWT_SECRET="tu_secret_muy_seguro_aqui"
JWT_EXPIRES_IN="7d"

# APIs
BLACKBOX_API_KEY="tu_key_aqui"
ALPHA_VANTAGE_KEY="tu_key_aqui"
NEWS_API_KEY="tu_key_aqui"
SENTIMENT_API_KEY="tu_key_aqui"

# CORS
FRONTEND_URL="https://tu-frontend.vercel.app"
```

### Variables de Entorno (Frontend)

```bash
VITE_API_URL="https://tu-backend.render.com"
```

---

## 📊 Métricas del Proyecto

### Performance
- **API Response:** <500ms
- **Database Queries:** <100ms
- **Chart Rendering:** <1s
- **Real-time Updates:** 30s interval

### Cobertura
- **Símbolos:** 107
- **Métricas:** 15
- **Gráficos:** 8
- **Fuentes de Datos:** 4 APIs

### Usuarios (Ejemplo)
- **Usuarios Activos:** (tracking)
- **Portafolios Creados:** (tracking)
- **Análisis IA Realizados:** (tracking)

---

## 🎮 Funcionalidades por Rol

### Usuario Registrado
- Crear portafolios
- Agregar transacciones
- Ver métricas en tiempo real
- Análisis con IA
- Configurar alertas
- Exportar reportes

### Usuario Free
- Ver símbolos disponibles
- Análisis básico
- 1 portafolio
- Métricas limitadas

### Usuario Premium (Futuro)
- Portafolios ilimitados
- Análisis IA ilimitado
- Alertas avanzadas
- Exportación avanzada
- Soporte prioritario

---

## 📚 Documentación Disponible

### Técnica
- README.md completo
- API documentation
- Database schema (Prisma)
- Deployment guide

### Usuario
- Manual de usuario
- Guía de métricas
- FAQ
- Tutoriales en video

---

## 🔗 Enlaces y Recursos

- **Frontend:** (Vercel URL)
- **Backend:** (Render URL)
- **Database:** Neon PostgreSQL
- **Repositorio:** (Local)

---

## ⚠️ Notas Importantes

### Dependencias Críticas
- Node.js 18+ requerido
- PostgreSQL (Neon)
- Blackbox AI API key
- Alpha Vantage API key
- News API key

### Limitaciones (Free Tier)
- **Render:** 750 horas/mes, sleep después de 15min inactividad
- **Neon:** 0.5 GB storage, 1 database
- **Alpha Vantage:** 5 requests/min, 500 requests/day
- **News API:** 100 requests/day

### Seguridad
- JWT tokens con expiración
- Passwords hasheados (bcrypt)
- HTTPS obligatorio
- Rate limiting
- Input validation

### Mantenimiento
- Actualizar precios cada 30s (en sesión activa)
- Backup de base de datos semanal
- Revisar límites de APIs
- Monitorear performance

---

## 🎯 Estado del Proyecto

| Aspecto | Estado | Notas |
|---------|--------|-------|
| **Desarrollo** | ✅ Completo | v3.0.0 estable |
| **Testing** | ⚠️ Básico | Requiere más tests |
| **Documentación** | ✅ Completa | README detallado |
| **Producción** | ✅ Ready | Desplegado |
| **Mantenimiento** | 🟢 Activo | Actualizaciones regulares |

---

## 🔄 Relación con Otros Proyectos

**Proyectos Relacionados:** Ninguno (único en el portfolio)

**Tecnologías Compartidas:**
- Node.js + Express (con edifnuev, SAAS-DND)
- PostgreSQL (con SAAS-DND)
- Prisma ORM (con SAAS-DND, escuela-idiomas)
- JWT Auth (con edifnuev, CVChispart, SAAS-DND)
- Blackbox AI (con Bet-Copilot, CVChispart, celula-chatbot-ia)
- Tailwind CSS (con DefiendeteMX, SAAS-DND, escuela-idiomas)

**Diferenciadores:**
- Único dashboard de inversiones
- Único con 107 símbolos financieros
- Único con 15 métricas profesionales
- Único con análisis de sentimiento
- Único con múltiples clases de activos

---

## 📈 Próximos Pasos / Roadmap

- [ ] Plan Premium con subscripción
- [ ] Más símbolos (200+ total)
- [ ] Trading paper (simulación)
- [ ] Integración con brokers (Alpaca, Interactive Brokers)
- [ ] App móvil nativa (iOS/Android)
- [ ] Backtesting de estrategias
- [ ] Alertas por email/SMS/push
- [ ] Social trading (copiar portafolios)
- [ ] Análisis técnico avanzado (más indicadores)
- [ ] Análisis fundamental completo
- [ ] Screener de acciones
- [ ] Calendario económico
- [ ] Reportes fiscales
- [ ] Integración con TradingView

---

**Última Actualización:** 2026-01-09  
**Analizado por:** Blackbox AI  
**Versión QWEN:** 1.0
