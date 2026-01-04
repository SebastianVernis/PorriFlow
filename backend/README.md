# SV Portfolio Backend API

## 🚀 Setup Rápido

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Base de Datos (Neon)

#### Opción A: Neon Database (Recomendado)

1. **Crear cuenta en Neon**:
   - Ir a https://neon.tech
   - Crear cuenta gratis
   - Crear nuevo proyecto: "sv-portfolio"

2. **Obtener Connection String**:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/svportfolio?sslmode=require
   ```

3. **Configurar `.env`**:
   ```bash
   cp .env.example .env
   # Editar .env y pegar tu DATABASE_URL
   ```

#### Opción B: PostgreSQL Local

```bash
# Instalar PostgreSQL
sudo apt install postgresql  # Linux
brew install postgresql      # Mac

# Crear base de datos
createdb svportfolio

# DATABASE_URL en .env:
DATABASE_URL="postgresql://localhost:5432/svportfolio"
```

### 3. Generar JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiar el resultado a `.env` en `JWT_SECRET`

### 4. Inicializar Base de Datos

```bash
# Push schema a la base de datos
npm run db:push

# Generar Prisma Client
npm run db:generate

# Seed con usuarios demo
npm run db:seed
```

### 5. Iniciar Servidor

```bash
# Modo desarrollo (auto-reload)
npm run dev

# Modo producción
npm start
```

Servidor corriendo en: `http://localhost:3000`

---

## 👥 Usuarios Demo Creados

Después del seed, tendrás:

### Usuario Demo
```
Email: demo@svportfolio.com
Username: demo
Password: demo123456

Portafolios: 2
- Portafolio Principal (3 acciones)
- Portafolio Crypto (2 cryptos)
```

### Usuario Admin
```
Email: admin@svportfolio.com
Username: admin
Password: admin123456

Portafolios: 1
- Portafolio Principal (vacío)
```

---

## 📡 API Endpoints

### Authentication

#### POST /api/auth/register
```json
// Request
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "name": "John Doe" // opcional
}

// Response
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx",
    "email": "user@example.com",
    "username": "username",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/login
```json
// Request
{
  "username": "demo", // o email
  "password": "demo123456"
}

// Response
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx",
    "email": "demo@svportfolio.com",
    "username": "demo",
    "name": "Demo User"
  }
}
```

#### GET /api/auth/me
```
Headers: Authorization: Bearer <token>

Response:
{
  "user": {
    "id": "clxxx",
    "email": "demo@svportfolio.com",
    "username": "demo",
    "name": "Demo User",
    "createdAt": "2026-01-04T10:00:00.000Z"
  }
}
```

### Portfolios

#### GET /api/portfolios
```
Headers: Authorization: Bearer <token>

Response:
{
  "portfolios": [
    {
      "id": "clxxx",
      "name": "Portafolio Principal",
      "description": null,
      "isDefault": true,
      "positions": [
        {
          "id": "clyyy",
          "ticker": "AAPL",
          "shares": 10,
          "avgCost": 150.00,
          "currentPrice": 185.50,
          "beta": 1.24,
          // ...más campos
        }
      ]
    }
  ]
}
```

#### POST /api/portfolios
```json
// Request
Headers: Authorization: Bearer <token>
{
  "name": "Mi Nuevo Portafolio",
  "description": "Estrategia conservadora"
}

// Response
{
  "portfolio": {
    "id": "clxxx",
    "name": "Mi Nuevo Portafolio",
    "description": "Estrategia conservadora"
  }
}
```

#### POST /api/portfolios/:id/positions
```json
// Request
Headers: Authorization: Bearer <token>
{
  "ticker": "AAPL",
  "shares": 10,
  "avgCost": 150.00,
  "currentPrice": 185.50,
  "beta": 1.24,
  "dgr": 7.5,
  "dividendYield": 0.5,
  "sector": "Tecnología",
  "name": "Apple Inc.",
  "isCrypto": false
}

// Response
{
  "position": { /* posición creada */ }
}
```

#### DELETE /api/portfolios/:id
```
Headers: Authorization: Bearer <token>

Response:
{
  "message": "Portfolio deleted"
}
```

### Settings

#### GET /api/settings
```
Headers: Authorization: Bearer <token>

Response:
{
  "settings": {
    "riskFreeRate": 4.5,
    "marketVolatility": 15.0,
    "annualTarget": 20.0,
    "refreshInterval": 5,
    "currency": "USD",
    "hasMarketstackKey": true,
    "hasAlphaVantageKey": true,
    "hasBlackboxKey": false,
    "hasMarketauxKey": false
  }
}
```

#### PUT /api/settings
```json
// Request
Headers: Authorization: Bearer <token>
{
  "riskFreeRate": 5.0,
  "annualTarget": 25.0
}

// Response
{
  "message": "Settings updated",
  "settings": { /* configuración actualizada */ }
}
```

---

## 🗄️ Base de Datos

### Schema Prisma

```prisma
User
├─ id, email, username, password (hashed)
├─ portfolios[]
└─ settings

Portfolio
├─ id, userId, name, description
└─ positions[]

Position
├─ id, portfolioId
├─ ticker, shares, avgCost, currentPrice
└─ beta, dgr, dividendYield, sector

UserSettings
├─ id, userId
├─ riskFreeRate, marketVolatility, annualTarget
└─ API keys (encrypted)

PriceCache (opcional)
└─ ticker, price, timestamp

HistoricalData (opcional)
└─ ticker, date, OHLC, volume
```

### Comandos Prisma

```bash
# Ver base de datos en navegador
npm run db:studio

# Aplicar cambios de schema
npm run db:push

# Regenerar client
npm run db:generate

# Crear nueva migración
npx prisma migrate dev --name add_new_field
```

---

## 🔒 Seguridad

### Password Hashing
```javascript
// Usa bcrypt con 10 rounds
const hashed = await bcrypt.hash(password, 10);
```

### JWT Tokens
```javascript
// Expiran en 7 días
expiresIn: '7d'

// Contienen:
{
  userId: "clxxx",
  email: "user@example.com",
  iat: 1234567890,
  exp: 1234567890
}
```

### API Keys
```javascript
// NO se retornan en GET /api/settings
// Solo indica si existen (hasMarketstackKey: true)
// Se actualizan con PUT /api/settings/api-keys
```

---

## 🧪 Testing

### Con cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"testuser","password":"test123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123456"}'

# Get portfolios (con token)
curl http://localhost:3000/api/portfolios \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Con Frontend

1. Abrir `public/login.html`
2. Usar credenciales demo
3. Debe redirigir a `public/index.html`

---

## 🔄 Migración desde LocalStorage

### Script de Migración

Crear `src/migrate-local-data.js`:

```javascript
// Ejecutar desde consola del navegador en public/index.html

const portfolios = JSON.parse(localStorage.getItem('sv_portfolios_unified'));
const settings = JSON.parse(localStorage.getItem('sv_global_settings'));

// Subir a API
async function migrateData(token) {
    for (const [id, pf] of Object.entries(portfolios)) {
        if (id === 'default') continue; // Ya existe
        
        // Crear portafolio
        const res = await fetch('http://localhost:3000/api/portfolios', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: pf.name })
        });
        
        const { portfolio } = await res.json();
        
        // Agregar posiciones
        for (const pos of pf.positions) {
            await fetch(`http://localhost:3000/api/portfolios/${portfolio.id}/positions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pos)
            });
        }
    }
    
    console.log('✅ Migración completa');
}

// Uso:
// const token = localStorage.getItem('sv_auth_token');
// migrateData(token);
```

---

## 🌐 Deploy a Producción

### Neon + Vercel/Railway

```bash
# 1. Configurar variables de entorno
DATABASE_URL=postgresql://xxx
JWT_SECRET=xxx
NODE_ENV=production
ALLOWED_ORIGINS=https://tudominio.com

# 2. Deploy
git push origin main  # Si usas Railway/Vercel con Git

# 3. Ejecutar migraciones
npx prisma db push --skip-generate
```

### Variables de Entorno Necesarias

```
DATABASE_URL          (Neon connection string)
JWT_SECRET            (Random 32 bytes hex)
PORT                  (3000 por defecto)
NODE_ENV              (production)
ALLOWED_ORIGINS       (URLs separadas por comas)
SESSION_EXPIRY        (7d por defecto)
```

---

## 📊 Database Management

### Prisma Studio (UI Visual)

```bash
npm run db:studio
```

Abre en: `http://localhost:5555`

Permite:
- ✅ Ver todos los usuarios
- ✅ Ver portafolios y posiciones
- ✅ Editar datos manualmente
- ✅ Eliminar registros
- ✅ Ejecutar queries

### Crear Usuario Manualmente

**Opción 1: Prisma Studio**
1. `npm run db:studio`
2. Ir a tabla "users"
3. "Add record"
4. Llenar campos (password debe hashearse primero)

**Opción 2: Desde Node.js**

```javascript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const password = await bcrypt.hash('mypassword', 10);

await prisma.user.create({
    data: {
        email: 'new@user.com',
        username: 'newuser',
        password: password,
        name: 'New User',
        portfolios: {
            create: { name: 'Portafolio Principal', isDefault: true }
        },
        settings: {
            create: {
                riskFreeRate: 4.5,
                marketVolatility: 15.0,
                annualTarget: 20.0
            }
        }
    }
});
```

---

## 🔧 Troubleshooting

### "Connection to database failed"
```bash
# Verificar DATABASE_URL en .env
echo $DATABASE_URL

# Test connection
npx prisma db push
```

### "JWT Secret not configured"
```bash
# Generar nuevo secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Agregar a .env
JWT_SECRET=el_resultado_de_arriba
```

### "Table doesn't exist"
```bash
# Aplicar schema
npm run db:push
```

### "Cannot find module '@prisma/client'"
```bash
# Regenerar client
npm run db:generate
```

---

## 📝 Scripts NPM

```bash
npm run dev          # Desarrollo (auto-reload)
npm start            # Producción
npm run db:push      # Aplicar schema
npm run db:studio    # UI visual
npm run db:generate  # Regenerar client
npm run db:seed      # Crear usuarios demo
```

---

## 🔐 Seguridad Best Practices

### En Desarrollo
```
✅ Usar .env para secrets
✅ .env en .gitignore
✅ CORS abierto a localhost
✅ Logs detallados de errores
```

### En Producción
```
✅ HTTPS obligatorio
✅ CORS restringido a tu dominio
✅ JWT_SECRET fuerte (32+ bytes)
✅ API keys encriptadas en DB
✅ Rate limiting (implementar)
✅ Logs sin datos sensibles
✅ Usar variables de entorno del host
```

---

## 📊 Estructura del Proyecto

```
backend/
├── package.json
├── .env.example
├── .env (crear manualmente)
├── prisma/
│   └── schema.prisma
└── src/
    ├── server.js
    ├── seed.js
    ├── middleware/
    │   └── auth.js
    └── routes/
        ├── auth.js
        ├── portfolios.js
        └── settings.js
```

---

## 🎯 Próximos Pasos

Después del setup:

1. ✅ Iniciar servidor: `npm run dev`
2. ✅ Verificar: `http://localhost:3000/health`
3. ✅ Abrir frontend: `public/login.html`
4. ✅ Login con credenciales demo
5. ✅ Dashboard carga con datos de DB

---

**Versión**: 1.0.0  
**Base de Datos**: PostgreSQL (Neon recomendado)  
**ORM**: Prisma  
**Auth**: JWT + bcrypt
