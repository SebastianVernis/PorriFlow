# 🚀 Guía Completa de Deploy - Render + Vercel (100% Gratis)

## 🎯 Overview

Deploy completo en plataformas gratuitas:
- **Database**: Neon (PostgreSQL serverless)
- **Backend**: Render (Node.js API)
- **Frontend**: Vercel (Static hosting)

**💰 Costo total: $0/mes**

---

## ⏱️ Tiempo Estimado

```
Neon setup:    5 minutos
Render setup:  10 minutos
Vercel setup:  5 minutos
Verificación:  5 minutos
─────────────────────────
TOTAL:         25 minutos
```

---

## 📋 Checklist de Prerequisitos

```
[ ] Cuenta GitHub (conectar repos)
[ ] Cuenta Neon (https://neon.tech)
[ ] Cuenta Render (https://render.com)
[ ] Cuenta Vercel (https://vercel.com)
[ ] Código subido a GitHub
[ ] Terminal abierta
```

---

## 🗄️ FASE 1: Base de Datos (Neon)

### Paso 1.1: Crear Proyecto

```
1. https://console.neon.tech
2. Click: "New Project"
3. Configurar:
   ┌─────────────────────────────────┐
   │ Project name: sv-portfolio      │
   │ Region: US East (Ohio)          │
   │ PostgreSQL: 16                  │
   │ Compute: Autoscaling (default)  │
   └─────────────────────────────────┘
4. Click: "Create Project"
```

### Paso 1.2: Copiar Connection String

```
1. Dashboard aparece automáticamente
2. Sección "Connection Details"
3. Copy: "Connection string"

Ejemplo:
postgresql://username:ep12abc_p34def@ep-cool-name-12345678.us-east-2.aws.neon.tech/neondb?sslmode=require

4. ⚠️ GUARDAR EN UN LUGAR SEGURO
   Necesitarás esto en Render
```

### Paso 1.3: Verificar Proyecto

```
1. Click: "Tables" (menú lateral)
2. Debe estar vacío (normal)
3. Prisma creará las tablas después
```

**✅ Checkpoint 1**: Connection string copiado

---

## 🖥️ FASE 2: Backend API (Render)

### Paso 2.1: Preparar Código

```bash
# En tu terminal local
cd /home/sebastianvernis/inversion

# Verificar que tienes render.yaml
ls backend/render.yaml
# Debe existir ✓

# Si no tienes Git inicializado:
git init
git add .
git commit -m "Initial commit"

# Crear repo en GitHub:
# 1. https://github.com/new
# 2. Nombre: sv-portfolio
# 3. Private o Public
# 4. Create repository

# Conectar y subir:
git remote add origin https://github.com/TU_USUARIO/sv-portfolio.git
git branch -M main
git push -u origin main
```

### Paso 2.2: Crear Web Service

```
1. https://dashboard.render.com
2. Click: "New +" (arriba derecha)
3. Select: "Web Service"
4. Click: "Build and deploy from a Git repository"
5. Connect: GitHub (si es primera vez)
6. Select: Tu repo "sv-portfolio"
7. Click: "Connect"
```

### Paso 2.3: Configurar Service

```
Configuración:

┌─────────────────────────────────────────┐
│ Name: sv-portfolio-api                  │
│ Region: Oregon (US West)                │
│ Branch: main                            │
│ Root Directory: backend                 │
│ Runtime: Node                           │
│ Build Command: npm install && npx prisma generate │
│ Start Command: npm start                │
│ Plan: Free                              │
└─────────────────────────────────────────┘
```

### Paso 2.4: Variables de Entorno

```
Click: "Advanced" → "Add Environment Variable"

Agregar:

1. DATABASE_URL
   Value: [Pegar tu Neon connection string completo]
   
2. JWT_SECRET
   Click: "Generate Value" (Render lo crea random)
   
3. NODE_ENV
   Value: production
   
4. ALLOWED_ORIGINS
   Value: https://sv-portfolio.vercel.app
   (Actualizarás esto después con tu URL real de Vercel)
   
5. SESSION_EXPIRY
   Value: 7d
```

### Paso 2.5: Deploy

```
1. Click: "Create Web Service"
2. Esperar build (~3-5 minutos)
3. Ver logs en tiempo real
4. Cuando veas: "✅ Ready to accept connections"
5. ¡Backend está live!
```

**Tu backend URL será**:
```
https://sv-portfolio-api.onrender.com
```

### Paso 2.6: Inicializar DB

```
IMPORTANTE: Ejecutar seed para crear usuarios demo

Método 1: Desde Render Shell
1. Dashboard → Tu servicio → "Shell" (menú lateral)
2. Ejecutar:
   npm run db:seed
3. Ver output:
   ✅ Demo user created
   ✅ Admin user created

Método 2: Desde tu terminal (si tienes DATABASE_URL)
1. cd backend
2. export DATABASE_URL="tu_neon_url"
3. npm run db:seed
```

### Paso 2.7: Verificar Backend

```bash
# Test 1: Health
curl https://sv-portfolio-api.onrender.com/health

# Test 2: Login
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123456"}'

# Ambos deben funcionar ✅
```

**✅ Checkpoint 2**: Backend en Render funcionando

---

## 🌐 FASE 3: Frontend (Vercel)

### Paso 3.1: Actualizar API URL

```bash
# En tu máquina local

# Editar public/login.html
nano public/login.html  # o tu editor preferido

# Buscar línea ~140:
const API_BASE_URL = localStorage.getItem('sv_api_url') || 'http://localhost:3000';

# Cambiar a:
const API_BASE_URL = localStorage.getItem('sv_api_url') || 'https://sv-portfolio-api.onrender.com';

# Guardar y cerrar
```

```bash
# Editar assets/js/auth.js
nano assets/js/auth.js

# Línea 6, cambiar:
const API_BASE_URL = localStorage.getItem('sv_api_url') || 'https://sv-portfolio-api.onrender.com';

# Guardar
```

```bash
# Commit cambios
git add .
git commit -m "Update API URL for production"
git push origin main
```

### Paso 3.2: Deploy en Vercel

```
1. https://vercel.com/new
2. Import: "Import Git Repository"
3. Select: Tu repo de GitHub
4. Click: "Import"
5. Configurar:

┌─────────────────────────────────────────┐
│ Project Name: sv-portfolio              │
│ Framework Preset: Other                 │
│ Root Directory: ./                      │
│ Build Command: (dejar vacío)            │
│ Output Directory: (dejar vacío)         │
│ Install Command: (dejar vacío)          │
└─────────────────────────────────────────┘

6. Environment Variables: (ninguna necesaria)
7. Click: "Deploy"
8. Esperar ~1 minuto
```

### Paso 3.3: Obtener URL de Vercel

```
Deploy completo → Vercel muestra:

┌─────────────────────────────────────────┐
│ 🎉 Deployment Ready                     │
│                                         │
│ https://sv-portfolio-abc123.vercel.app  │
│                                         │
│ [Visit] [Copy URL]                      │
└─────────────────────────────────────────┘

Copiar esta URL ← LA NECESITARÁS
```

### Paso 3.4: Actualizar CORS en Render

```
1. Render Dashboard → sv-portfolio-api
2. Environment (menú lateral)
3. Buscar: ALLOWED_ORIGINS
4. Edit → Cambiar a:
   https://sv-portfolio-abc123.vercel.app
   
   (Usar tu URL real de Vercel)
   
5. Save Changes
6. Render auto-redeploys (~1-2 min)
```

**✅ Checkpoint 3**: Frontend en Vercel funcionando

---

## ✅ FASE 4: Verificación Completa

### Método 1: Herramienta Automática

```bash
# Abrir herramienta de verificación
open tests/verify-deploy.html  # Mac
xdg-open tests/verify-deploy.html  # Linux
start tests/verify-deploy.html  # Windows

# O en navegador:
# file:///home/sebastianvernis/inversion/tests/verify-deploy.html

Pasos:
1. Ingresar URL de backend y frontend
2. Click cada botón de test
3. Ver resumen final
4. ✅ Todos los tests deben pasar
```

### Método 2: Manual

```
Test 1: Backend Health
→ https://sv-portfolio-api.onrender.com/health
→ Debe mostrar: {"status":"ok"...}

Test 2: Frontend Access
→ https://sv-portfolio-abc123.vercel.app
→ Debe mostrar: Login page

Test 3: Login Completo
→ Abrir frontend
→ Login: demo / demo123456
→ Debe redirigir a dashboard
→ Dashboard debe cargar datos

Test 4: Persistencia
→ Crear posición de prueba
→ Refrescar página (F5)
→ Posición debe seguir ahí

Test 5: Multi-dispositivo
→ Abrir en otro navegador/dispositivo
→ Login con mismo usuario
→ Debe ver mismos datos

✅ Si todos pasan: Deploy exitoso
```

---

## 🎛️ Configuración Avanzada

### Custom Domain (Opcional)

**En Vercel**:
```
1. Settings → Domains
2. Add: portfolio.tudominio.com
3. Configurar DNS:
   Type: CNAME
   Name: portfolio
   Value: cname.vercel-dns.com
4. Esperar propagación (~5-30 min)
5. SSL automático ✅
```

**En Render** (Requiere plan de pago):
```
Render free tier no soporta custom domains
Usar: sv-portfolio-api.onrender.com
```

### Environment Switching

**Desarrollo**:
```javascript
// public/login.html y auth.js
const API_BASE_URL = localStorage.getItem('sv_api_url') || 
    (window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://sv-portfolio-api.onrender.com');
```

**Múltiples Ambientes**:
```
Production: https://sv-portfolio-api.onrender.com
Staging: https://sv-portfolio-api-staging.onrender.com
Development: http://localhost:3000
```

---

## 🔄 CI/CD Automático

### Ya Configurado ✅

```
GitHub Push (main branch)
    ↓
Render detecta cambios
    ├─ Build automático
    ├─ Tests (si existen)
    ├─ Deploy
    └─ ~2-3 min
    ↓
Vercel detecta cambios
    ├─ Build automático
    ├─ Deploy to CDN
    └─ ~30 seg
    ↓
✅ Ambos deployados automáticamente
```

**No necesitas hacer nada extra** - Solo push a GitHub

---

## 🐛 Troubleshooting Deploy

### "Render build fails - Prisma error"

```bash
Error: @prisma/client not generated

Fix:
1. Verificar package.json tiene:
   "postinstall": "npx prisma generate"
2. Verificar Build Command en Render:
   npm install && npx prisma generate
3. Re-deploy
```

### "Database connection failed"

```bash
Error: Can't reach database server

Fix:
1. Verificar Neon project está activo
2. Verificar DATABASE_URL en Render es exacto
3. Debe terminar en: ?sslmode=require
4. Test en Render Shell:
   npx prisma db push
```

### "CORS error en frontend"

```bash
Error: blocked by CORS policy

Fix:
1. Render → Environment
2. ALLOWED_ORIGINS debe incluir tu Vercel URL exacta
3. Formato: https://sv-portfolio-abc123.vercel.app
4. No trailing slash
5. Save → Esperar redeploy
```

### "Render service sleeps"

```bash
Síntoma: Primera request toma 30+ segundos

Soluciones:
1. UptimeRobot (gratis):
   - https://uptimerobot.com
   - Monitor cada 5 min
   - Evita sleep

2. Aceptar delay ocasional (free tier)

3. Upgrade a Render paid ($7/mes)
```

### "Vercel deployment failed"

```bash
Causa común: Configuración incorrecta

Fix:
1. Verificar vercel.json existe
2. Framework Preset: Other
3. Build/Output: Dejar vacío
4. Re-deploy
```

---

## 📊 Monitoreo Post-Deploy

### Render Dashboard

```
Métricas disponibles:
├─ CPU usage
├─ Memory usage
├─ Response time
├─ Request volume
└─ Errors

Alerts:
└─ Email cuando servicio cae
```

### Vercel Analytics

```
Métricas gratis:
├─ Page views
├─ Visitors
├─ Top pages
└─ Devices

Analytics Pro ($20/mes):
├─ Real User Monitoring
├─ Web Vitals
└─ Custom events
```

### Neon Monitoring

```
Dashboard muestra:
├─ Storage used
├─ Compute hours
├─ Active connections
└─ Query performance

Gratis en free tier ✅
```

---

## 🔐 Seguridad en Producción

### Checklist de Seguridad

```
Backend (Render):
[✓] HTTPS enforced automáticamente
[✓] Environment variables seguras
[✓] JWT_SECRET generado random
[✓] CORS configurado correctamente
[✓] Passwords hasheados (bcrypt)
[✓] Input validation
[✓] No logs de passwords

Frontend (Vercel):
[✓] HTTPS automático
[✓] Security headers (vercel.json)
[✓] No API keys en código
[✓] XSS protection
[✓] CDN global

Database (Neon):
[✓] SSL/TLS required
[✓] Isolated compute
[✓] Daily backups
[✓] Connection pooling
```

### Hardening Adicional (Opcional)

**Rate Limiting**:
```javascript
// Agregar a backend/package.json
"express-rate-limit": "^7.1.5"

// En server.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100 // límite de requests
});

app.use('/api/', limiter);
```

**Helmet.js**:
```bash
npm install helmet

// En server.js
import helmet from 'helmet';
app.use(helmet());
```

---

## 🎯 URLs Finales de Producción

### Estructura

```
┌──────────────────────────────────────────────┐
│  FRONTEND (Vercel)                           │
│  https://sv-portfolio.vercel.app             │
├──────────────────────────────────────────────┤
│  /                    → public/login.html           │
│  /dashboard           → public/index.html     │
│  /assets/js/auth.js   → Auth module          │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  BACKEND (Render)                            │
│  https://sv-portfolio-api.onrender.com       │
├──────────────────────────────────────────────┤
│  /health              → Status check         │
│  /api/auth/login      → Login                │
│  /api/auth/register   → Register             │
│  /api/portfolios      → CRUD portfolios      │
│  /api/settings        → User settings        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  DATABASE (Neon)                             │
│  ep-xxx.us-east-2.aws.neon.tech              │
├──────────────────────────────────────────────┤
│  neondb                                      │
│  ├─ users                                    │
│  ├─ portfolios                               │
│  ├─ positions                                │
│  └─ user_settings                            │
└──────────────────────────────────────────────┘
```

---

## 🔄 Workflow de Updates

### Update Backend

```bash
# 1. Hacer cambios en backend/
vim backend/src/server.js

# 2. Commit y push
git add backend/
git commit -m "Update API endpoint"
git push

# 3. Render detecta y redeploys automáticamente
# Ver en: https://dashboard.render.com
# Tiempo: ~2-3 min
```

### Update Frontend

```bash
# 1. Hacer cambios en HTML/JS
vim public/index.html

# 2. Commit y push
git add *.html assets/
git commit -m "Update dashboard UI"
git push

# 3. Vercel detecta y redeploys automáticamente
# Ver en: https://vercel.com/dashboard
# Tiempo: ~30 seg
```

### Update Database Schema

```bash
# 1. Modificar schema
vim backend/prisma/schema.prisma

# 2. Push local para verificar
cd backend
npm run db:push

# 3. Commit y push
git add prisma/schema.prisma
git commit -m "Update database schema"
git push

# 4. En Render Shell (después de redeploy):
npm run db:push

# ⚠️ Puede causar pérdida de datos
# Usar migraciones en producción seria
```

---

## 💡 Tips de Optimización

### Render Free Tier

**1. Evitar Sleep**:
```bash
# UptimeRobot monitor cada 5 min
# O aceptar ~30 seg delay en primera request
```

**2. Optimize Cold Starts**:
```javascript
// Ya implementado en código:
- Prisma Client cached
- Minimal dependencies
- Fast startup
```

**3. Efficient Queries**:
```javascript
// Usar select para campos específicos
await prisma.user.findMany({
    select: { id: true, email: true }  // No traer todo
});

// Usar include solo cuando necesario
```

### Vercel Free Tier

**1. CDN Cache**:
```html
<!-- Ya configurado -->
<meta http-equiv="Cache-Control" content="public, max-age=3600">
```

**2. Minimize Assets**:
```
✅ Usa CDN para Tailwind, Chart.js, FontAwesome
✅ No bundling necesario
✅ Static files son gratis
```

### Neon Free Tier

**1. Connection Pooling**:
```bash
# Ya incluido en connection string
?pgbouncer=true
```

**2. Efficient Indexes**:
```prisma
// Ya configurado en schema
@@index([userId])
@@index([portfolioId])
```

---

## 📈 Escalabilidad

### Cuando Necesites Upgrade

**Señales**:
```
❌ Render sleep molesta a usuarios
❌ >100 usuarios activos
❌ >100 GB bandwidth/mes en Vercel
❌ >0.5 GB data en Neon
❌ Necesitas custom domain en backend
```

**Costos de Upgrade**:
```
Render Starter: $7/mes
├─ No sleep
├─ Custom domain
└─ 512 MB RAM

Vercel Pro: $20/mes
├─ Analytics avanzado
├─ Sin límites de bandwidth
└─ Preview deployments ilimitados

Neon Pro: $19/mes
├─ 10 GB storage
├─ Point-in-time recovery
└─ Read replicas

Total si upgradeas todo: $46/mes
```

---

## 🎉 Deploy Completado

### Verificación Final

```bash
# Abrir verify tool
open tests/verify-deploy.html

# O manual:
1. ✅ Backend health: OK
2. ✅ Backend login: OK
3. ✅ Frontend loads: OK
4. ✅ CORS: OK
5. ✅ Data persists: OK

Si todos ✅ → Deploy exitoso 🎉
```

### Compartir con Usuarios

```
Tu app está en:
https://sv-portfolio-abc123.vercel.app

Usuarios pueden:
1. Registrarse (nuevo usuario)
2. O usar demo: demo / demo123456
3. Crear sus propios portafolios
4. Datos separados por usuario
5. Acceso desde cualquier dispositivo
```

---

## 📚 Recursos Adicionales

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Esta Guía**: `DEPLOY.md` (resumen ejecutivo)

---

## 🎯 Siguientes Pasos

```
[ ] Deploy completado ✅
[ ] Verificar todos los tests ✅
[ ] Crear tu propio usuario
[ ] Invitar otros usuarios (si aplica)
[ ] Configurar monitoring (UptimeRobot)
[ ] (Opcional) Custom domain
[ ] Disfrutar tu app en producción 🚀
```

---

**🎉 ¡Deployment Completo en Plataformas Gratuitas!**

**Backend**: Render Free Tier  
**Frontend**: Vercel Free Tier  
**Database**: Neon Free Tier  
**Costo**: $0/mes  
**Tiempo**: ~25 minutos  
**Status**: ✅ Production Ready
