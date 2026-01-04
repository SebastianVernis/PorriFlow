# 🚀 Deploy Guide - Render (Backend) + Vercel (Frontend)

## 🎯 Arquitectura de Deploy

```
┌─────────────────────────────────────────────┐
│  FRONTEND (Vercel - Free Tier)              │
│  https://sv-portfolio.vercel.app            │
│  ├─ public/login.html                              │
│  ├─ public/index.html                        │
│  └─ assets/                                 │
└─────────────────────────────────────────────┘
                    ↓ HTTPS
┌─────────────────────────────────────────────┐
│  BACKEND (Render - Free Tier)               │
│  https://sv-portfolio-api.onrender.com      │
│  ├─ Express API                             │
│  ├─ JWT Auth                                │
│  └─ Prisma ORM                              │
└─────────────────────────────────────────────┘
                    ↓ PostgreSQL
┌─────────────────────────────────────────────┐
│  DATABASE (Neon - Free Tier)                │
│  PostgreSQL 16                              │
│  ├─ 0.5 GB storage                          │
│  ├─ Serverless                              │
│  └─ Auto-scaling                            │
└─────────────────────────────────────────────┘

💰 COSTO TOTAL: $0/mes (100% GRATIS)
```

---

## 📋 Prerequisitos

```
✅ Cuenta GitHub (para conectar repos)
✅ Cuenta Neon (base de datos) - https://neon.tech
✅ Cuenta Render (backend) - https://render.com
✅ Cuenta Vercel (frontend) - https://vercel.com

Tiempo total: ~30 minutos
```

---

## 🗄️ PASO 1: Setup Base de Datos (Neon)

### 1.1 Crear Proyecto Neon

```
1. Ir a: https://console.neon.tech
2. Click: "New Project"
3. Configurar:
   - Name: sv-portfolio
   - Region: US East (Ohio) - aws-us-east-2
   - PostgreSQL: 16
   - Compute: 0.25 vCPU (free tier)
4. Click: "Create Project"
```

### 1.2 Obtener Connection String

```
1. Dashboard → "Connection Details"
2. Copy: Connection string
3. Formato:
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

4. Guardar para después (necesitarás esto en Render)
```

### 1.3 Crear Base de Datos

```sql
-- En Neon SQL Editor (opcional - ya existe "neondb")
-- O renombrar en connection string
```

**✅ Neon listo** - Connection string copiado

---

## 🖥️ PASO 2: Deploy Backend (Render)

### 2.1 Preparar Repositorio

```bash
# En tu máquina local
cd /home/sebastianvernis/inversion

# Inicializar Git (si no está)
git init

# Agregar archivos
git add .
git commit -m "Initial commit - SV Portfolio v3.0"

# Crear repo en GitHub
# Ir a: https://github.com/new
# Nombre: sv-portfolio-backend
# Visibilidad: Private (recomendado) o Public

# Push
git remote add origin https://github.com/TU_USUARIO/sv-portfolio-backend.git
git branch -M main
git push -u origin main
```

### 2.2 Crear Web Service en Render

```
1. Ir a: https://dashboard.render.com
2. Click: "New +" → "Web Service"
3. Conectar: Tu repo de GitHub
4. Configurar:

   Name: sv-portfolio-api
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npx prisma generate
   Start Command: npm start
   Plan: Free

5. Click: "Advanced" → Add Environment Variables:
```

**Variables de Entorno en Render**:

```bash
# Obligatorias
DATABASE_URL = tu_neon_connection_string_completo
JWT_SECRET = (click "Generate" para random)
NODE_ENV = production

# Opcionales
PORT = 3000
ALLOWED_ORIGINS = https://sv-portfolio.vercel.app
SESSION_EXPIRY = 7d
```

```
6. Click: "Create Web Service"
7. Esperar deploy (~3-5 min)
```

### 2.3 Inicializar Base de Datos

```
Después del primer deploy:

1. En Render Dashboard → Tu servicio
2. Click: "Shell" (en el menú lateral)
3. Ejecutar:
   cd backend
   npm run db:push
   npm run db:seed
   exit

4. Verificar:
   - Ir a Neon Dashboard
   - Ver tablas creadas
   - Verificar usuarios demo
```

### 2.4 Verificar Backend

```bash
# Tu URL será algo como:
https://sv-portfolio-api.onrender.com

# Test en navegador:
https://sv-portfolio-api.onrender.com/health

# Debe retornar:
{
  "status": "ok",
  "version": "3.0",
  "timestamp": "2026-01-04T..."
}
```

**✅ Backend en Render listo**

---

## 🌐 PASO 3: Deploy Frontend (Vercel)

### 3.1 Preparar Frontend

**Actualizar URL del API en public/login.html**:

```html
<!-- En public/login.html, línea ~140 -->
<script>
    // Cambiar:
    const API_BASE_URL = localStorage.getItem('sv_api_url') || 'http://localhost:3000';
    
    // Por:
    const API_BASE_URL = localStorage.getItem('sv_api_url') || 'https://sv-portfolio-api.onrender.com';
</script>
```

**Actualizar auth.js**:

```javascript
// En assets/js/auth.js, línea 6
const API_BASE_URL = localStorage.getItem('sv_api_url') || 'https://sv-portfolio-api.onrender.com';
```

**Commit cambios**:

```bash
git add .
git commit -m "Update API URL for production"
git push
```

### 3.2 Deploy en Vercel

```
1. Ir a: https://vercel.com/new
2. Import: Tu repositorio de GitHub
3. Configurar:

   Project Name: sv-portfolio
   Framework Preset: Other
   Root Directory: ./
   Build Command: (dejar vacío)
   Output Directory: (dejar vacío)

4. Environment Variables: (ninguna necesaria)

5. Click: "Deploy"
6. Esperar ~1-2 minutos
```

### 3.3 Configurar Dominio

```
1. Deploy completo → Vercel te da URL:
   https://sv-portfolio-xyz123.vercel.app

2. (Opcional) Configurar dominio custom:
   Settings → Domains → Add Domain
   Ejemplo: portfolio.tudominio.com
```

### 3.4 Actualizar CORS en Backend

```
1. Ir a: Render Dashboard → Tu servicio
2. Environment → ALLOWED_ORIGINS
3. Agregar tu URL de Vercel:
   https://sv-portfolio-xyz123.vercel.app

4. Guardar → Auto-redeploy
```

**✅ Frontend en Vercel listo**

---

## ✅ PASO 4: Verificación Final

### 4.1 Test Backend

```bash
# Health check
curl https://sv-portfolio-api.onrender.com/health

# Login test
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123456"}'

# Debe retornar token
```

### 4.2 Test Frontend

```
1. Abrir: https://sv-portfolio-xyz123.vercel.app
2. Debe mostrar login page
3. Login con: demo / demo123456
4. Debe redirigir a dashboard
5. Dashboard debe cargar datos
6. Crear posición de prueba
7. Refrescar página → Datos persisten
```

### 4.3 Checklist Completo

```
Backend (Render):
[ ] Health endpoint responde
[ ] Login funciona
[ ] Retorna token válido
[ ] Prisma conectado a Neon
[ ] Usuarios demo existen
[ ] CORS configurado

Frontend (Vercel):
[ ] Login page carga
[ ] Puede hacer login
[ ] Redirige a dashboard
[ ] Dashboard carga datos de API
[ ] Puede crear portafolios
[ ] Puede agregar posiciones
[ ] Datos persisten después de refresh

Database (Neon):
[ ] Proyecto activo
[ ] Tablas creadas
[ ] Usuarios existen
[ ] Connection string correcto
```

---

## 🎛️ Configuración de Render (Detalles)

### Free Tier Limits

```
✅ 750 horas/mes (suficiente para 1 servicio 24/7)
✅ 512 MB RAM
✅ 0.1 vCPU
⚠️ Se duerme después de 15 min sin uso
⚠️ Primera request después de dormir: ~30 seg

Optimizaciones:
1. Health check cada 14 min (evita sleep)
2. Lazy loading de Prisma
3. Conexión eficiente a DB
```

### Keep-Alive Script (Opcional)

```bash
# Crear en tu máquina local: keep-alive.sh
#!/bin/bash
while true; do
    curl https://sv-portfolio-api.onrender.com/health
    sleep 840  # 14 minutos
done

# Ejecutar en background
nohup ./keep-alive.sh &
```

O usar servicio gratuito: https://uptimerobot.com/

### Variables de Entorno Render

```
DATABASE_URL (Required)
├─ De Neon connection string
├─ Formato: postgresql://user:pass@host/db?sslmode=require
└─ IMPORTANTE: Incluir ?sslmode=require

JWT_SECRET (Required)
├─ Click "Generate" en Render
└─ O crear: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

NODE_ENV (Required)
└─ Valor: production

ALLOWED_ORIGINS (Recommended)
├─ URLs separadas por coma
└─ Ejemplo: https://sv-portfolio.vercel.app,https://sv-portfolio-*.vercel.app

PORT (Optional)
└─ Render lo asigna automáticamente, pero puedes usar 3000

SESSION_EXPIRY (Optional)
└─ Default: 7d
```

---

## 🌐 Configuración de Vercel (Detalles)

### Free Tier Limits

```
✅ Unlimited deployments
✅ 100 GB bandwidth/mes
✅ Serverless functions (no usamos)
✅ Auto SSL/HTTPS
✅ Global CDN
✅ Sin límite de requests

Perfecto para frontend estático ✅
```

### Build Settings

```
Framework Preset: Other
Build Command: (ninguno - es HTML estático)
Output Directory: (ninguno)
Install Command: (ninguno)

Root Directory: ./
```

### Environment Variables (Ninguna Necesaria)

```
Frontend es 100% estático
API URL está hardcoded en el código
```

### Custom Domains (Opcional)

```
1. Vercel Dashboard → Settings → Domains
2. Add Domain: portfolio.tudominio.com
3. Configurar DNS (Vercel te da instrucciones)
4. Esperar propagación (~5 min)
5. SSL automático ✅
```

---

## 🔧 Optimizaciones para Free Tier

### Backend (Render)

**1. Conexión Eficiente a DB**:

```javascript
// src/server.js - Ya optimizado
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
```

**2. Health Check Optimizado**:

```javascript
// Lightweight health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' }); // No query a DB
});
```

**3. Lazy Loading**:

```javascript
// Solo importar Prisma cuando se necesita
let prisma;
function getPrisma() {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
}
```

### Frontend (Vercel)

**1. Optimizar Assets**:

Ya usa CDN para:
- ✅ Tailwind CSS
- ✅ Chart.js
- ✅ Font Awesome

**2. Cache Strategy**:

```html
<!-- En public/index.html -->
<meta http-equiv="Cache-Control" content="public, max-age=3600">
```

**3. Loading States**:

```javascript
// Mostrar loader mientras API responde
// Ya implementado en el código
```

---

## 📊 Configuración de Neon

### Free Tier Limits

```
✅ 0.5 GB storage
✅ 1 proyecto
✅ Branches ilimitadas (para testing)
✅ Serverless (paga solo por uso)
✅ Auto-suspend después de 5 min inactividad
✅ Auto-wake en primera query

Perfecto para este proyecto ✅
```

### Optimizaciones Neon

**1. Connection Pooling** (Ya incluido en URL):

```bash
# Neon usa PgBouncer automáticamente
# Connection string ya optimizado
?sslmode=require&pgbouncer=true
```

**2. Indexes** (Ya en schema):

```prisma
@@index([userId])    // En Portfolio
@@index([portfolioId]) // En Position
@@index([ticker])      // En Position
```

**3. Cascade Deletes** (Ya configurado):

```prisma
onDelete: Cascade  // Limpia automáticamente
```

---

## 🔐 Seguridad en Producción

### Backend (Render)

```javascript
// Ya implementado en código:

✅ HTTPS obligatorio (Render lo fuerza)
✅ CORS restringido a Vercel domain
✅ JWT con expiración
✅ Passwords hasheados (bcrypt)
✅ Input validation
✅ Error handling sin leaks
✅ Environment variables
```

### Frontend (Vercel)

```javascript
// vercel.json ya incluye:

✅ Security headers
✅ XSS Protection
✅ No-sniff
✅ Frame protection
✅ HTTPS automático
```

### Database (Neon)

```
✅ SSL/TLS obligatorio
✅ Automatic backups (daily)
✅ Point-in-time recovery
✅ IP allowlist (opcional)
✅ Isolated compute
```

---

## 🚀 Deploy Automatizado

### Script de Deploy Completo

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying SV Portfolio Dashboard..."

# 1. Update code
git add .
git commit -m "Deploy $(date +%Y-%m-%d)"
git push origin main

# 2. Backend redeploys automáticamente en Render
echo "⏳ Backend deploying on Render..."
echo "   URL: https://dashboard.render.com"

# 3. Frontend redeploys automáticamente en Vercel
echo "⏳ Frontend deploying on Vercel..."
echo "   URL: https://vercel.com/dashboard"

echo ""
echo "✅ Deployment initiated!"
echo "📊 Backend: https://sv-portfolio-api.onrender.com"
echo "🌐 Frontend: https://sv-portfolio.vercel.app"
echo ""
echo "⏱️ Tiempo estimado: 2-3 minutos"
```

```bash
# Hacer ejecutable
chmod +x deploy.sh

# Usar
./deploy.sh
```

---

## 🔄 CI/CD Automático

### Render

```yaml
# Ya configurado en render.yaml

Auto-deploy cuando:
✅ Push a main
✅ Cambios en /backend/
✅ Health check pasa

Build:
1. npm install
2. npx prisma generate
3. npm start

Tiempo: ~2-3 min
```

### Vercel

```json
// Ya configurado en vercel.json

Auto-deploy cuando:
✅ Push a main
✅ Cambios en HTML/JS/CSS
✅ Pull request (preview)

Build:
1. Copy static files
2. Deploy to CDN

Tiempo: ~30 seg
```

---

## 🧪 Testing Post-Deploy

### Backend Health Check

```bash
# Test 1: Health endpoint
curl https://sv-portfolio-api.onrender.com/health

# Esperado:
{
  "status": "ok",
  "version": "3.0",
  "timestamp": "2026-01-04T..."
}
```

### Backend Auth Test

```bash
# Test 2: Login
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123456"}'

# Esperado:
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {...}
}
```

### Frontend Test

```
1. Abrir: https://sv-portfolio.vercel.app
2. Debe mostrar login page
3. Login: demo / demo123456
4. Debe cargar dashboard
5. Crear posición de prueba
6. Refrescar → Datos persisten
7. Logout → Volver a login
8. Login otra vez → Datos siguen ahí
```

---

## ⚙️ Configuración CORS Detallada

### En Render (Backend)

```bash
# Environment Variable
ALLOWED_ORIGINS=https://sv-portfolio.vercel.app,https://sv-portfolio-git-*.vercel.app

# Esto permite:
✅ Production URL
✅ Preview deployments
✅ Branch previews
```

### En código (server.js)

```javascript
// Ya configurado:
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
```

### Para Development Local

```bash
# En backend/.env local
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5500
```

---

## 🔄 Actualización y Mantenimiento

### Actualizar Backend

```bash
# Local
git add backend/
git commit -m "Update backend"
git push

# Render auto-deploys
# Ver progreso en: https://dashboard.render.com
# Tiempo: ~2-3 min
```

### Actualizar Frontend

```bash
# Local
git add *.html assets/
git commit -m "Update frontend"
git push

# Vercel auto-deploys
# Ver progreso en: https://vercel.com/dashboard
# Tiempo: ~30 seg
```

### Actualizar Schema de DB

```bash
# 1. Modificar prisma/schema.prisma
# 2. Commit y push
# 3. En Render Shell:
npm run db:push

# 4. Verificar en Neon
```

---

## 💰 Costos y Límites (Free Tier)

### Render Free

```
✅ Límites:
- 750 horas/mes (31 días × 24 h = 744 h) ✅
- 512 MB RAM (suficiente)
- Sleep después 15 min inactividad
- 100 GB bandwidth/mes
- Build: 500 min/mes

⚠️ Limitaciones:
- Primera request post-sleep: ~30 seg
- No custom domains en free
- 1 web service free por cuenta

Soluciones:
- Keep-alive (UptimeRobot gratuito)
- O aceptar 30 seg delay ocasional
```

### Vercel Free

```
✅ Límites:
- Deployments ilimitados
- 100 GB bandwidth/mes
- 100 builds/día
- Serverless functions: 100 GB-hours/mes
- 1000 serverless invocations/día

⚠️ Limitaciones:
- No server-side logic (ok, usamos Render)
- 1 concurrent build

Perfecto para frontend estático ✅
```

### Neon Free

```
✅ Límites:
- 0.5 GB storage
- 1 proyecto
- 191.9 compute hours/mes
- Auto-suspend después 5 min

⚠️ Limitaciones:
- Sin backups manuales (solo automáticos)
- Sin point-in-time recovery exacto

Para este proyecto: ✅ Más que suficiente
```

**💰 TOTAL: $0/mes**

---

## 📊 Monitoreo

### UptimeRobot (Gratis)

```
1. Ir a: https://uptimerobot.com
2. Crear cuenta
3. Add Monitor:
   - Type: HTTP(s)
   - URL: https://sv-portfolio-api.onrender.com/health
   - Interval: 5 minutos
   - Name: SV Portfolio API

Beneficio:
✅ Evita que Render se duerma
✅ Alertas si API cae
✅ Uptime statistics
```

### Render Logs

```
Dashboard → Service → Logs

Ver:
- Deploy logs
- Runtime logs
- Errors
- Requests

Útil para debugging
```

### Vercel Analytics

```
Dashboard → Project → Analytics

Ver:
- Page views
- Visitors
- Performance
- Geo distribution

Gratis con límites generosos
```

---

## 🔄 Rollback en Caso de Error

### Render

```
1. Dashboard → Service
2. "Events" → Ver deploys
3. Click en deploy anterior
4. "Redeploy"
```

### Vercel

```
1. Dashboard → Project
2. "Deployments" → Ver historia
3. Click en deployment anterior
4. "Promote to Production"
```

### Database (Neon)

```
1. Dashboard → Project
2. "Restore" → Point-in-time
3. Seleccionar timestamp
4. Restore

⚠️ Requiere plan de pago
En free: Solo daily backups
```

---

## 🎯 URLs Finales

### Producción

```
Frontend:  https://sv-portfolio.vercel.app
Backend:   https://sv-portfolio-api.onrender.com
Database:  ep-xxx.us-east-2.aws.neon.tech
Prisma:    npx prisma studio (local)

Login:     https://sv-portfolio.vercel.app/
Dashboard: https://sv-portfolio.vercel.app/dashboard
```

### Development

```
Frontend:  http://localhost:3000 (live server)
Backend:   http://localhost:3000
Database:  Same Neon (shared)
```

---

## 📝 Post-Deploy Checklist

```
[ ] Backend health check OK
[ ] Login funciona en producción
[ ] Dashboard carga datos
[ ] Crear/editar/eliminar portafolios funciona
[ ] Agregar/eliminar posiciones funciona
[ ] Análisis AI funciona (si Blackbox configurado)
[ ] Gráficos se renderizan
[ ] Tabs cambian correctamente
[ ] Logout funciona
[ ] Re-login funciona
[ ] Datos persisten entre sesiones
[ ] Multiple dispositivos sincronizados
[ ] CORS sin errores en consola
[ ] SSL/HTTPS activo
[ ] No warnings en consola
```

---

## 🆘 Troubleshooting Deploy

### "Render build fails"

```bash
# Ver logs en Render
# Común: Prisma no genera

Fix:
1. Verificar package.json tiene postinstall
2. Verificar DATABASE_URL configurado
3. Re-deploy
```

### "CORS error en frontend"

```bash
# Error: "blocked by CORS policy"

Fix:
1. Render → Environment
2. ALLOWED_ORIGINS = https://tu-vercel-url.vercel.app
3. Save (auto-redeploy)
```

### "Database connection failed"

```bash
Fix:
1. Verificar Neon project activo
2. Verificar DATABASE_URL exacto (con ?sslmode=require)
3. Test en Render Shell: npm run db:push
```

### "Login redirect loop"

```bash
# Frontend redirige constantemente

Fix:
1. Verificar API_BASE_URL correcto en public/login.html
2. Verificar API responde correctamente
3. Limpiar localStorage y reintentar
```

---

## 🎉 Deploy Exitoso

### URLs de Tu Deployment

```
🔐 Login: https://sv-portfolio.vercel.app
📊 Dashboard: https://sv-portfolio.vercel.app/dashboard
📡 API: https://sv-portfolio-api.onrender.com
🗄️ Database: Neon Dashboard

Usuarios demo:
  demo / demo123456
  admin / admin123456
```

### Compartir con Otros

```
1. Comparte URL de Vercel
2. Usuarios deben registrarse
3. Cada uno tiene sus propios portafolios
4. Datos aislados por usuario
```

---

## 📊 Resumen de Deploy

```
TIEMPO TOTAL: ~30 minutos

Pasos:
1. Neon setup         (5 min)
2. Render setup       (10 min)
3. Vercel setup       (5 min)
4. Testing            (5 min)
5. Optimizaciones     (5 min)

Resultado:
✅ Backend en Render (free)
✅ Frontend en Vercel (free)
✅ Database en Neon (free)
✅ HTTPS automático
✅ Auto-deploy en push
✅ Multi-usuario
✅ Datos persistentes

COSTO: $0/mes 🎉
```

---

**Siguiente**: Usuarios pueden acceder en `https://tu-vercel-url.vercel.app`

**Documentación completa**: `docs/AUTH-SYSTEM.md`
