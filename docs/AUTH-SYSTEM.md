# 🔐 Sistema de Autenticación - SV Portfolio v3.0

## 🎯 Overview

Sistema completo de autenticación con:
- ✅ Backend Node.js + Express
- ✅ Base de datos PostgreSQL (Neon)
- ✅ ORM Prisma
- ✅ JWT Authentication
- ✅ Password hashing (bcrypt)
- ✅ Multi-usuario
- ✅ Datos por usuario en DB

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────┐
│  FRONTEND (HTML + JavaScript)               │
├─────────────────────────────────────────────┤
│  public/login.html                                 │
│  ├─ Login form                              │
│  └─ Register form                           │
│                                             │
│  public/index.html                           │
│  ├─ Protected (requiere auth)               │
│  ├─ Carga datos desde API                   │
│  └─ assets/js/auth.js (módulo auth)         │
└─────────────────────────────────────────────┘
                    ↕ HTTP/JSON
┌─────────────────────────────────────────────┐
│  BACKEND API (Node.js + Express)            │
├─────────────────────────────────────────────┤
│  Routes:                                    │
│  ├─ /api/auth (login, register)             │
│  ├─ /api/portfolios (CRUD)                  │
│  └─ /api/settings (config)                  │
│                                             │
│  Middleware:                                │
│  └─ authMiddleware (JWT validation)         │
└─────────────────────────────────────────────┘
                    ↕ Prisma ORM
┌─────────────────────────────────────────────┐
│  DATABASE (PostgreSQL - Neon)               │
├─────────────────────────────────────────────┤
│  Tables:                                    │
│  ├─ users                                   │
│  ├─ portfolios                              │
│  ├─ positions                               │
│  ├─ user_settings                           │
│  ├─ price_cache (opcional)                  │
│  └─ historical_data (opcional)              │
└─────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Autenticación

### 1. Registro

```
Usuario → public/login.html (form registro)
    ↓
Backend → Validar datos
    ↓
Backend → Hash password (bcrypt)
    ↓
Database → Crear user + portfolio default + settings
    ↓
Backend → Generar JWT token
    ↓
Frontend → Guardar token en localStorage
    ↓
Redirect → public/index.html
```

### 2. Login

```
Usuario → public/login.html (form login)
    ↓
Backend → Buscar user por username/email
    ↓
Backend → Verificar password (bcrypt.compare)
    ↓
Backend → Generar JWT token
    ↓
Frontend → Guardar token en localStorage
    ↓
Redirect → public/index.html
```

### 3. Acceso a Dashboard

```
Usuario → public/index.html
    ↓
Frontend → Verificar token existe
    ↓
Frontend → Cargar datos con apiRequest()
    ↓
Backend → Validar token (JWT)
    ↓
Backend → Retornar datos del usuario
    ↓
Frontend → Renderizar dashboard
```

---

## 💻 Integración en Frontend

### Modificar public/index.html

**1. Agregar script de auth en `<head>`:**

```html
<script type="module" src="assets/js/auth.js"></script>
```

**2. Agregar en `<script>` principal:**

```javascript
// Al inicio del script
import { checkAuth, logout, portfolioAPI, settingsAPI } from './assets/js/auth.js';

// En window.onload, antes de todo:
window.onload = async () => {
    // Verificar autenticación
    const auth = checkAuth();
    if (!auth) return; // Redirige a login si no está autenticado
    
    // Cargar datos desde API en lugar de localStorage
    const { portfolios: apiPortfolios } = await portfolioAPI.getAll();
    
    // Transformar a formato del dashboard
    portfolios = {};
    apiPortfolios.forEach(pf => {
        portfolios[pf.id] = {
            name: pf.name,
            positions: pf.positions
        };
    });
    
    // Si hay portafolio default, usarlo
    const defaultPf = apiPortfolios.find(p => p.isDefault);
    if (defaultPf) {
        currentPortfolioId = defaultPf.id;
    }
    
    // ... resto del código existente
};
```

**3. Actualizar funciones de guardado:**

```javascript
// En saveAndRefresh() - Guardar a API
async function saveAndRefresh() {
    try {
        // Bulk update positions
        const updates = portfolio.map(p => ({
            ticker: p.ticker,
            currentPrice: p.currentPrice
        }));
        
        await portfolioAPI.bulkUpdatePrices(currentPortfolioId, updates);
        
        renderDashboard();
        updateAllVisualizations();
    } catch (error) {
        console.error('Error saving:', error);
        alert('Error al guardar cambios');
    }
}

// En createNewPortfolio()
async function createNewPortfolio() {
    const name = document.getElementById('new-portfolio-name').value.trim();
    if (!name) return;
    
    try {
        const { portfolio } = await portfolioAPI.create(name);
        
        // Agregar a estado local
        portfolios[portfolio.id] = {
            name: portfolio.name,
            positions: []
        };
        
        loadPortfolioSelector();
        renderPortfolioList();
        alert(`✅ Portafolio "${name}" creado`);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear portafolio');
    }
}
```

**4. Agregar botón de logout en header:**

```html
<!-- En el header, después de los botones -->
<div class="flex items-center gap-2 ml-4 pl-4 border-l border-slate-700">
    <span id="user-display" class="text-sm text-slate-300"></span>
    <button onclick="logout()" class="text-rose-400 hover:text-rose-300 transition-all">
        <i class="fa-solid fa-right-from-bracket"></i>
    </button>
</div>
```

---

## 🔑 Gestión de Usuarios

### Crear Usuario Manualmente

**Opción 1: Desde Prisma Studio**

```bash
npm run db:studio
```

1. Abrir `http://localhost:5555`
2. Click en tabla "User"
3. "Add Record"
4. **IMPORTANTE**: Password debe estar hasheado

Para hashear password:
```javascript
// En consola de Node.js
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('mipassword', 10);
console.log(hash);
// Copiar el hash a Prisma Studio
```

**Opción 2: Script SQL Directo**

```sql
-- En Neon SQL Editor o pgAdmin
INSERT INTO users (id, email, username, password, name, "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'user@example.com',
    'username',
    '$2a$10$hashed_password_here',  -- Generar con bcrypt
    'User Name',
    NOW(),
    NOW()
);

-- Crear settings para el usuario
INSERT INTO user_settings ("userId", "riskFreeRate", "marketVolatility", "annualTarget", "createdAt", "updatedAt")
VALUES (
    'user_id_here',
    4.5,
    15.0,
    20.0,
    NOW(),
    NOW()
);

-- Crear portafolio default
INSERT INTO portfolios ("userId", name, "isDefault", "createdAt", "updatedAt")
VALUES (
    'user_id_here',
    'Portafolio Principal',
    true,
    NOW(),
    NOW()
);
```

**Opción 3: Endpoint de Admin (Crear)**

```javascript
// En routes/auth.js, agregar:
router.post('/admin/create-user', async (req, res) => {
    // Verificar que quien llama es admin
    // Crear usuario
});
```

---

## 🔄 Sincronización de Datos

### LocalStorage → Database (Primera vez)

```javascript
// Ejecutar en consola del navegador después de login
async function syncToDatabase() {
    const token = localStorage.getItem('sv_auth_token');
    
    // 1. Obtener portafolios de localStorage
    const localPortfolios = JSON.parse(
        localStorage.getItem('sv_portfolios_unified') || '{}'
    );
    
    // 2. Subir cada portafolio
    for (const [localId, pf] of Object.entries(localPortfolios)) {
        if (localId === 'default') {
            // Actualizar el default existente
            const { portfolios } = await fetch('http://localhost:3000/api/portfolios', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(r => r.json());
            
            const defaultPf = portfolios.find(p => p.isDefault);
            
            // Agregar posiciones
            for (const pos of pf.positions) {
                await fetch(`http://localhost:3000/api/portfolios/${defaultPf.id}/positions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pos)
                });
            }
        } else {
            // Crear nuevo portafolio
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
    }
    
    console.log('✅ Sincronización completa');
    alert('Datos migrados a base de datos. Refresca la página.');
}

// Ejecutar
syncToDatabase();
```

---

## 🧪 Testing del Sistema

### Test Completo (Paso a Paso)

```bash
# 1. Backend
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev

# 2. Verificar servidor
curl http://localhost:3000/health
# Debe retornar: {"status":"ok","version":"3.0",...}

# 3. Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123456"}'
# Debe retornar token

# 4. Frontend
# Abrir public/login.html en navegador
# Login con: demo / demo123456
# Debe redirigir a public/index.html

# 5. Verificar datos
# En public/index.html, abrir consola (F12)
# Debe mostrar portafolios cargados desde API
```

---

## 📊 Modelos de Datos

### User
```javascript
{
  id: "clu3...",
  email: "user@example.com",
  username: "username",
  password: "$2a$10$hashed...",  // Nunca retornado en API
  name: "User Name",
  createdAt: "2026-01-04T10:00:00.000Z",
  updatedAt: "2026-01-04T10:00:00.000Z"
}
```

### Portfolio
```javascript
{
  id: "clu3...",
  userId: "clu3...",
  name: "Portafolio Principal",
  description: "Mi estrategia conservadora",
  isDefault: true,
  createdAt: "2026-01-04T10:00:00.000Z",
  updatedAt: "2026-01-04T10:00:00.000Z",
  positions: [ /* array de posiciones */ ]
}
```

### Position
```javascript
{
  id: "clu3...",
  portfolioId: "clu3...",
  ticker: "AAPL",
  name: "Apple Inc.",
  sector: "Tecnología",
  isCrypto: false,
  shares: 10,
  avgCost: 150.00,
  currentPrice: 185.50,
  beta: 1.24,
  dgr: 7.5,
  dividendYield: 0.5,
  createdAt: "2026-01-04T10:00:00.000Z",
  updatedAt: "2026-01-04T10:00:00.000Z"
}
```

### UserSettings
```javascript
{
  id: "clu3...",
  userId: "clu3...",
  riskFreeRate: 4.5,
  marketVolatility: 15.0,
  annualTarget: 20.0,
  refreshInterval: 5,
  currency: "USD",
  marketstackKey: "xxx",      // Encriptado
  alphaVantageKey: "xxx",     // Encriptado
  blackboxKey: "xxx",         // Encriptado
  marketauxKey: "xxx"         // Encriptado
}
```

---

## 🔐 Seguridad Implementada

### Password Security
```
✅ bcrypt hashing (10 rounds)
✅ Salted automatically
✅ Never stored in plain text
✅ Never returned in API responses
✅ Min length: 6 characters
```

### JWT Security
```
✅ Signed with secret key
✅ Expires in 7 days
✅ Validated on every request
✅ Contains: userId + email
✅ Does NOT contain: password, sensitive data
```

### API Security
```
✅ CORS configured
✅ JWT validation middleware
✅ User-scoped queries (can't access other user's data)
✅ Input validation
✅ Error messages don't leak sensitive info
```

### Database Security
```
✅ API keys stored separately
✅ Not returned in GET requests
✅ User data isolated
✅ Cascade deletes (clean orphans)
✅ Indexes for performance
```

---

## 🎮 Flujo de Usuario

### Primera Vez (Registro)

```
1. Abrir: public/login.html
2. Click: Tab "Registrarse"
3. Llenar:
   - Email: tu@email.com
   - Usuario: tuusuario
   - Contraseña: 6+ caracteres
4. Submit
5. ✅ Cuenta creada automáticamente con:
   - Portafolio Principal (vacío)
   - Settings por defecto
6. Redirect → public/index.html
7. Dashboard listo para usar
```

### Usuarios Subsecuentes (Login)

```
1. Abrir: public/login.html
2. Ingresar:
   - Usuario o Email
   - Contraseña
3. Submit
4. ✅ Token generado
5. Redirect → public/index.html
6. Datos cargados desde DB
```

### Durante Uso del Dashboard

```
Todas las operaciones usan API:

Crear portafolio → POST /api/portfolios
Agregar posición → POST /api/portfolios/:id/positions
Eliminar posición → DELETE /api/portfolios/:id/positions/:pid
Actualizar precios → POST /api/portfolios/:id/positions/bulk-update
Cambiar settings → PUT /api/settings

✅ Todo se sincroniza automáticamente con DB
✅ Datos persisten entre sesiones
✅ Accesible desde cualquier dispositivo
```

---

## 🔧 Configuración Neon

### Paso a Paso

1. **Crear Cuenta**:
   - https://neon.tech
   - Signup (GitHub o Email)

2. **Crear Proyecto**:
   ```
   Nombre: sv-portfolio
   Región: us-east-2 (o la más cercana)
   PostgreSQL: 16 (latest)
   ```

3. **Obtener Connection String**:
   ```
   Dashboard → Project → Connection String
   
   Formato:
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/svportfolio?sslmode=require
   ```

4. **Configurar en Backend**:
   ```bash
   # backend/.env
   DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/svportfolio?sslmode=require"
   ```

5. **Inicializar DB**:
   ```bash
   cd backend
   npm run db:push
   npm run db:seed
   ```

6. **Verificar en Neon**:
   - Dashboard → Tables
   - Debe mostrar: users, portfolios, positions, etc.

---

## 🎯 Ventajas del Sistema con DB

### vs LocalStorage

| Aspecto | LocalStorage | Database (Neon) |
|---------|--------------|-----------------|
| Multi-usuario | ❌ | ✅ |
| Multi-dispositivo | ❌ | ✅ |
| Backup automático | ❌ | ✅ |
| Sincronización | ❌ | ✅ |
| Seguridad | ⚠️ Básica | ✅ Alta |
| Escalabilidad | ❌ | ✅ |
| Colaboración | ❌ | ✅ (futuro) |
| Límite de datos | ~5-10 MB | ∞ |

### Casos de Uso Nuevos

```
✅ Acceder desde trabajo y casa
✅ Compartir portafolio con asesor (futuro)
✅ Historial completo en DB
✅ Analytics agregados (futuro)
✅ Alertas por email (futuro)
✅ Mobile app con mismos datos
```

---

## 🔄 Migración Progresiva

### Estrategia Híbrida (Recomendada)

```javascript
// El dashboard puede funcionar en modo híbrido:

if (token exists) {
    // Modo DB: Cargar desde API
    portfolios = await portfolioAPI.getAll();
} else {
    // Modo Local: Usar localStorage
    portfolios = JSON.parse(localStorage.getItem('sv_portfolios_unified'));
}

// Ventajas:
✅ Funciona sin backend (desarrollo)
✅ Migración gradual
✅ Backwards compatible
```

---

## 📝 Scripts de Utilidad

### Reset Password (Admin)

```javascript
// backend/src/scripts/reset-password.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword(email, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
        where: { email },
        data: { password: hashed }
    });
    
    console.log(`✅ Password updated for ${email}`);
}

// Uso:
// node -e "import('./src/scripts/reset-password.js').then(m => m.resetPassword('user@email.com', 'newpass123'))"
```

### Listar Todos los Usuarios

```javascript
// backend/src/scripts/list-users.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users = await prisma.user.findMany({
    select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
        _count: {
            select: { portfolios: true }
        }
    }
});

console.table(users);
```

---

## 🎯 Próximas Mejoras (v3.1)

### Backend
```
[ ] Rate limiting (express-rate-limit)
[ ] Email verification
[ ] Password reset por email
[ ] OAuth (Google, GitHub)
[ ] Admin panel
[ ] API usage analytics
[ ] WebSocket para real-time updates
```

### Frontend
```
[ ] Recordar sesión (checkbox)
[ ] "Olvidé mi contraseña"
[ ] Profile settings page
[ ] Activity log
[ ] Export/Import portafolios
```

---

## 🆘 Troubleshooting

### "Cannot connect to database"
```
1. Verificar DATABASE_URL en .env
2. Verificar Neon project está activo
3. Test: npx prisma db push
4. Ver logs de Neon dashboard
```

### "Invalid token" en frontend
```
1. Token expiró (7 días)
2. Solución: Re-login
3. O verificar JWT_SECRET no cambió
```

### "User already exists"
```
1. Email o username ya registrado
2. Usar otro username/email
3. O hacer login con el existente
```

### "Prisma Client not generated"
```bash
npm run db:generate
```

---

## 📊 Estado Actual

```
✅ Backend API completo
✅ Prisma schema definido
✅ Authentication routes
✅ Portfolio routes
✅ Settings routes
✅ JWT middleware
✅ Seed script con usuarios demo
✅ Login page completa
✅ Auth module (assets/js/auth.js)
✅ Documentación completa

🔄 Pendiente:
- Integración completa en public/index.html
- Testing end-to-end
- Deploy a producción
```

---

## 🎓 Para Desarrolladores

### Agregar Nuevo Endpoint

```javascript
// backend/src/routes/custom.js
import express from 'express';
const router = express.Router();

router.get('/my-endpoint', async (req, res) => {
    // req.userId está disponible (de authMiddleware)
    res.json({ data: 'something' });
});

export default router;

// En server.js:
import customRoutes from './routes/custom.js';
app.use('/api/custom', authMiddleware, customRoutes);
```

### Agregar Campo a User

```prisma
// prisma/schema.prisma
model User {
    // ... campos existentes
    phone String?  // nuevo campo
}
```

```bash
# Aplicar cambio
npm run db:push
```

---

**Sistema de autenticación completo e integrado** ✅

**Archivos clave**:
- Backend: `backend/src/`
- Frontend: `public/login.html` + `assets/js/auth.js`
- Database: Neon PostgreSQL + Prisma

**Próximo paso**: Ejecutar `npm install` en `backend/` y seguir setup
