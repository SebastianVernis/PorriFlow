# 🗄️ Arquitectura de Base de Datos - SV Portfolio

## 📊 Stack Actual

```
┌─────────────────┐
│   FRONTEND      │  (Vercel)
│   index.html    │  - JavaScript puro
│   login.html    │  - No acceso directo a DB
└────────┬────────┘
         │
         │ HTTPS REST API
         │
┌────────▼────────┐
│   BACKEND       │  (Render)
│   Express API   │  - Node.js + Express
│   + Prisma ORM  │  - Autenticación JWT
└────────┬────────┘
         │
         │ PostgreSQL Protocol (SSL)
         │
┌────────▼────────┐
│   DATABASE      │  (Neon)
│   PostgreSQL    │  - Serverless
│   + Connection  │  - Connection Pooling
│     Pooling     │  - Auto-scaling
└─────────────────┘
```

## ✅ Estado Actual: FUNCIONANDO

### 1. **Backend conectado a Neon** ✅
- URL: `postgresql://neondb_owner:***@ep-shy-wind-ah6eilaz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require`
- Prisma ORM configurado
- Connection pooling habilitado (`-pooler`)
- SSL/TLS activado

### 2. **API Endpoints Disponibles** ✅

#### Autenticación
- `POST /api/auth/register` - Crear usuario
- `POST /api/auth/login` - Login (retorna JWT token)
- `GET /api/auth/profile` - Obtener perfil

#### Portfolios
- `GET /api/portfolios` - Listar portfolios del usuario
- `POST /api/portfolios` - Crear portfolio
- `GET /api/portfolios/:id` - Obtener portfolio específico
- `PUT /api/portfolios/:id` - Actualizar portfolio
- `DELETE /api/portfolios/:id` - Eliminar portfolio

#### Posiciones
- `POST /api/portfolios/:id/positions` - Agregar posición
- `PUT /api/portfolios/:id/positions/:posId` - Actualizar posición
- `DELETE /api/portfolios/:id/positions/:posId` - Eliminar posición
- `POST /api/portfolios/:id/positions/bulk-update` - Actualizar precios masivamente

#### Settings
- `GET /api/settings` - Obtener configuración del usuario
- `PUT /api/settings` - Actualizar configuración

#### Market Data (proxies APIs externas)
- `GET /api/market-data/prices?symbols=AAPL,MSFT` - Precios actuales
- `GET /api/market-data/historical?symbol=AAPL&days=30` - Históricos

#### News
- `GET /api/news?symbols=AAPL,MSFT&limit=10` - Noticias
- `GET /api/news/sentiment/:symbol` - Sentiment analysis

### 3. **Esquema de Base de Datos** ✅

```sql
-- Usuarios
users (
  id, email, username, password, name,
  createdAt, updatedAt
)

-- Configuración por usuario
user_settings (
  id, userId, riskFreeRate, marketVolatility,
  annualTarget, refreshInterval, currency,
  marketstackKey, alphaVantageKey, blackboxKey,
  createdAt, updatedAt
)

-- Portfolios
portfolios (
  id, userId, name, description, isDefault,
  createdAt, updatedAt
)

-- Posiciones en portfolios
positions (
  id, portfolioId, ticker, name, sector, isCrypto,
  shares, avgCost, currentPrice,
  beta, dgr, dividendYield,
  createdAt, updatedAt
)

-- Cache de precios (opcional)
price_cache (
  id, ticker, price, bid, ask,
  timestamp, source, updatedAt
)

-- Datos históricos (opcional)
historical_data (
  id, ticker, date, open, high, low, close,
  volume, createdAt
)

-- Preferencias de noticias
user_news_preferences (
  id, userId, enabledSources, categories,
  minSentiment, autoRefresh, refreshInterval,
  createdAt, updatedAt
)
```

## 🔐 Seguridad

### Autenticación
- **JWT Tokens** con expiración de 7 días
- Passwords hasheados con **bcrypt** (10 rounds)
- Middleware de autenticación en todas las rutas protegidas

### Conexión
- **SSL/TLS** obligatorio en Neon (`sslmode=require`)
- **Connection pooling** para eficiencia
- Variables de entorno para credenciales sensibles

### CORS
- Configurado para permitir solo dominios específicos
- Credentials habilitados para cookies/headers

## 📦 Datos de Prueba

### Usuario Demo
```javascript
username: "demo"
password: "demo123456"
email: "demo@svportfolio.com"
```

**Portfolios:**
1. "Portafolio Principal" (3 posiciones: AAPL, MSFT, GOOGL)
2. "Portafolio Crypto" (2 posiciones: BTC-USD, ETH-USD)

### Usuario Admin
```javascript
username: "admin"
password: "admin123456"
email: "admin@svportfolio.com"
```

## 🚀 Flujo de Datos

### Login y Carga Inicial
```
1. Usuario entra a login.html
2. Submit form → POST /api/auth/login
3. Backend valida contra Neon DB
4. Retorna JWT token + user info
5. Frontend guarda token en localStorage
6. Redirect a index.html

7. index.html carga
8. Verifica token en localStorage
9. GET /api/portfolios (con Authorization: Bearer token)
10. Backend consulta Neon → retorna portfolios + positions
11. Frontend renderiza datos
```

### Agregar Posición
```
1. Usuario completa formulario
2. Frontend → POST /api/portfolios/:id/positions
3. Backend valida ownership
4. INSERT en Neon DB (tabla positions)
5. Retorna posición creada
6. Frontend actualiza UI
```

### Actualizar Precios
```
1. Timer cada 5 min
2. Frontend obtiene lista de tickers
3. Llama APIs externas (Marketstack/Finnhub/AlphaVantage)
4. Batch update → POST /api/portfolios/:id/positions/bulk-update
5. Backend UPDATE masivo en Neon
6. Frontend refresca UI
```

## 🔄 Migración de localStorage a API

Ya creado el archivo `/public/assets/js/api-client.js` con:
- Funciones para todos los endpoints
- Auto-detección de entorno (local vs producción)
- Helper `migrateLocalStorageToAPI()` para migrar datos existentes

### Pasos para Migrar Frontend

1. **Importar api-client.js en index.html**
```html
<script type="module" src="/assets/js/api-client.js"></script>
```

2. **Reemplazar localStorage por API calls**
```javascript
// ANTES (localStorage)
const portfolios = JSON.parse(localStorage.getItem('sv_portfolios_unified'));

// DESPUÉS (API)
import { getPortfolios } from '/assets/js/api-client.js';
const portfolios = await getPortfolios();
```

3. **Ejecutar migración automática**
```javascript
import { migrateLocalStorageToAPI } from '/assets/js/api-client.js';
await migrateLocalStorageToAPI();
```

## 📈 Ventajas de Usar API + Neon

### Persistencia Real
- ✅ Datos no se pierden al cambiar de navegador
- ✅ Acceso desde múltiples dispositivos
- ✅ No hay límite de 5-10MB de localStorage

### Escalabilidad
- ✅ Neon escala automáticamente
- ✅ Connection pooling eficiente
- ✅ Backups automáticos

### Seguridad
- ✅ Datos en servidor, no en cliente
- ✅ Autenticación por usuario
- ✅ Validación server-side

### Colaboración (futuro)
- ✅ Compartir portfolios entre usuarios
- ✅ Portfolios públicos/privados
- ✅ Comentarios y análisis compartidos

## 🔧 Comandos Útiles

### Backend Local
```bash
cd backend
npm run dev          # Modo desarrollo con hot-reload
npm start            # Modo producción
npm run db:studio    # Abrir Prisma Studio (GUI)
npm run db:push      # Sincronizar schema con DB
npm run db:seed      # Crear datos demo
```

### Prisma
```bash
npx prisma generate              # Generar cliente
npx prisma db push               # Push schema a DB
npx prisma migrate deploy        # Aplicar migraciones
npx prisma studio                # GUI visual de la DB
```

### Test API
```bash
# Health check
curl https://sv-portfolio-api.onrender.com/health

# Login
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123456"}'

# Get portfolios (usar token del login)
curl https://sv-portfolio-api.onrender.com/api/portfolios \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Próximos Pasos

1. ✅ Backend conectado a Neon
2. ✅ API endpoints implementados
3. ✅ Cliente API JavaScript creado
4. ⏳ Migrar index.html para usar API
5. ⏳ Migrar datos localStorage existentes
6. ⏳ Deploy y pruebas en producción

---

**Estado:** ✅ Infraestructura lista y funcionando  
**Última actualización:** 2026-01-09  
**Versión:** 3.0
