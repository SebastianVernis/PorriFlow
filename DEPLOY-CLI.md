# 🚀 Deploy desde CLI - Guía Rápida

## ⚡ Deploy Completo en 3 Comandos

```bash
# 1. Setup inicial (si no lo hiciste)
./scripts/setup.sh

# 2. Deploy frontend a Vercel
vercel --prod

# 3. Configurar backend en Render
# (Sigue instrucciones en pantalla)
./scripts/deploy-render.sh
```

**Tiempo total: ~10 minutos**

---

## 📋 Prerequisitos

### Instalar CLIs

```bash
# Vercel CLI (si no está instalado)
npm install -g vercel

# Verificar
vercel --version

# Login a Vercel
vercel login
```

**Render**: No tiene CLI oficial, usamos el dashboard  
(Pero el deploy es automático desde GitHub)

---

## 🌐 DEPLOY FRONTEND (Vercel CLI)

### Comando Único

```bash
# Desde la raíz del proyecto
vercel --prod
```

### Proceso Interactivo

```
Vercel CLI preguntará:

? Set up and deploy "~/inversion"? [Y/n] 
→ Y

? Which scope do you want to deploy to? 
→ [Tu cuenta]

? Link to existing project? [y/N] 
→ N (primera vez)

? What's your project's name? 
→ sv-portfolio

? In which directory is your code located? 
→ ./ (dejar como está)

? Want to override the settings? [y/N] 
→ N

🔍 Inspect: https://vercel.com/...
✅ Production: https://sv-portfolio-xyz.vercel.app
```

### URL Final

Vercel te da una URL como:
```
https://sv-portfolio-abc123.vercel.app
```

**Copia esta URL** - la necesitarás para CORS en Render

---

## 🖥️ DEPLOY BACKEND (Render + GitHub)

### Opción A: Script Automático (Recomendado)

```bash
./scripts/deploy-render.sh
```

Sigue las instrucciones en pantalla.

### Opción B: Manual

#### 1. Subir a GitHub

```bash
# Si no lo hiciste
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/sv-portfolio.git
git push -u origin main
```

#### 2. Crear Web Service en Render

```
1. https://dashboard.render.com/create?type=web

2. Connect GitHub repo

3. Configurar:
   Name: sv-portfolio-api
   Region: Oregon
   Branch: main
   Root Directory: backend
   Build: npm install && npx prisma generate
   Start: npm start
   Plan: Free

4. Environment Variables:
   DATABASE_URL = postgresql://...neon.tech/...
   JWT_SECRET = [Generate]
   NODE_ENV = production
   ALLOWED_ORIGINS = https://sv-portfolio-abc123.vercel.app

5. Create Web Service

6. Esperar deploy (~3-5 min)
```

#### 3. Inicializar Database

```bash
# En Render Dashboard → Shell

npm run db:push
npm run db:seed

# Verificar
curl https://tu-app.onrender.com/health
```

---

## 🔄 Actualizar CORS

### Después de Ambos Deploys

```
1. Render Dashboard → sv-portfolio-api
2. Environment → ALLOWED_ORIGINS
3. Edit → Pegar URL de Vercel:
   https://sv-portfolio-abc123.vercel.app
4. Save Changes (auto-redeploy ~1 min)
```

---

## ✅ Verificación

### Health Check

```bash
# Backend
curl https://sv-portfolio-api.onrender.com/health

# Esperado:
{
  "status": "ok",
  "version": "3.0",
  "timestamp": "..."
}
```

### Test Login

```bash
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123456"}'

# Esperado:
{
  "message": "Login successful",
  "token": "eyJ...",
  "user": {...}
}
```

### Test Frontend

```
1. Abrir: https://sv-portfolio-abc123.vercel.app
2. Login: demo / demo123456
3. Debe cargar dashboard
4. Crear posición de prueba
5. Refrescar → Datos persisten
```

### Herramienta Automática

```bash
open tests/verify-deploy.html

# Ingresar:
# - Backend URL: https://sv-portfolio-api.onrender.com
# - Frontend URL: https://sv-portfolio-abc123.vercel.app

# Ejecutar todos los tests
# Ver resumen
```

---

## 🔧 Comandos Útiles de Vercel CLI

```bash
# Deploy a producción
vercel --prod

# Deploy a preview (staging)
vercel

# Ver deployments
vercel ls

# Ver logs
vercel logs

# Ver información del proyecto
vercel inspect

# Eliminar deployment
vercel remove [deployment-url]

# Configurar dominios
vercel domains add tudominio.com

# Ver aliases
vercel alias ls

# Configurar variables de entorno
vercel env add

# Pull configuración
vercel pull
```

---

## 🔄 Re-Deploy (Actualizar)

### Frontend (Vercel)

```bash
# Hacer cambios en public/ o assets/
git add .
git commit -m "Update frontend"
git push

# Vercel detecta automáticamente y redeploys
# O manual:
vercel --prod
```

### Backend (Render)

```bash
# Hacer cambios en backend/
git add .
git commit -m "Update backend"
git push

# Render detecta automáticamente y redeploys
# Ver progreso en: https://dashboard.render.com
```

---

## 🎯 Deploy Completo Paso a Paso

### Comando por Comando

```bash
# 1. Setup inicial (si no lo hiciste)
./scripts/setup.sh

# 2. Generar datos de mercado
cd backend
npm run data:generate
npm run data:update  # Opcional, actualiza precios
cd ..

# 3. Commit todo
git add .
git commit -m "Ready for deploy"

# 4. Subir a GitHub
git push origin main

# 5. Deploy frontend
vercel login  # Primera vez
vercel --prod

# Copiar URL que te da Vercel

# 6. Configurar backend en Render
# https://dashboard.render.com/create?type=web
# Conectar GitHub repo
# Configurar según instrucciones arriba
# Environment: DATABASE_URL, JWT_SECRET, ALLOWED_ORIGINS
# Create Web Service

# 7. Inicializar DB en Render
# Shell → npm run db:push && npm run db:seed

# 8. Verificar
open tests/verify-deploy.html
```

**Tiempo: ~10-15 minutos**

---

## 📊 Estructura de Deploy

```
GitHub Repository
    ↓ Push
┌─────────────────────┐
│ Vercel              │ ← Detecta cambios automáticamente
│ Despliega: public/  │
│ URL: vercel.app     │
└─────────────────────┘

    ↓ Push
┌─────────────────────┐
│ Render              │ ← Detecta cambios automáticamente
│ Despliega: backend/ │
│ URL: onrender.com   │
└─────────────────────┘
    ↓ Conecta
┌─────────────────────┐
│ Neon                │
│ PostgreSQL 16       │
│ Serverless          │
└─────────────────────┘
```

---

## 🔐 Variables de Entorno

### Vercel (Frontend)

**No necesita variables de entorno**  
(Frontend es 100% estático, API URL está en el código)

### Render (Backend)

**Obligatorias**:
```
DATABASE_URL        → De Neon console
JWT_SECRET          → Generate en Render
NODE_ENV            → production
```

**Recomendadas**:
```
ALLOWED_ORIGINS     → URL de Vercel
SESSION_EXPIRY      → 7d
PORT                → 3000 (Render lo asigna auto)
```

---

## 🐛 Troubleshooting

### "Vercel command not found"

```bash
npm install -g vercel
vercel login
```

### "Render deploy fails"

```
Ver logs en: Dashboard → Service → Logs

Común:
- Prisma no genera: Agregar a Build Command
- DATABASE_URL vacío: Configurar en Environment
- Build timeout: Contactar Render support
```

### "CORS error"

```
Fix:
1. Render → Environment → ALLOWED_ORIGINS
2. Debe ser EXACTA tu URL de Vercel
3. Sin trailing slash
4. Save → Esperar redeploy
```

### "Database not found"

```bash
# En Render Shell:
npm run db:push
npm run db:seed

# Verificar en Neon console que las tablas existan
```

---

## 📝 Checklist de Deploy

```
Pre-Deploy:
[ ] Git inicializado
[ ] Código en GitHub
[ ] backend/render.yaml existe
[ ] vercel.json existe
[ ] .gitignore correcto
[ ] market-data generado

Deploy Frontend (Vercel):
[ ] vercel CLI instalado
[ ] vercel login completado
[ ] vercel --prod ejecutado
[ ] URL de Vercel copiada
[ ] Frontend accesible

Deploy Backend (Render):
[ ] Web Service creado
[ ] GitHub conectado
[ ] Environment variables configuradas
[ ] Deploy completado
[ ] db:push ejecutado
[ ] db:seed ejecutado
[ ] Health endpoint responde

Verificación:
[ ] tests/verify-deploy.html todos ✅
[ ] Login funciona
[ ] Dashboard carga datos
[ ] Datos persisten
[ ] CORS sin errores
```

---

## 🎯 URLs Finales

```
Frontend:  https://sv-portfolio-abc123.vercel.app
           https://sv-portfolio-abc123.vercel.app/login
           https://sv-portfolio-abc123.vercel.app/dashboard

Backend:   https://sv-portfolio-api.onrender.com
           https://sv-portfolio-api.onrender.com/health
           https://sv-portfolio-api.onrender.com/api/auth/login

Database:  https://console.neon.tech
           (No URL pública, solo para admin)

GitHub:    https://github.com/TU_USUARIO/sv-portfolio
```

---

## 🎉 Deploy Exitoso

### Próximos Pasos

```
1. ✅ Compartir URL de Vercel con usuarios
2. ✅ Usuarios se registran en /login
3. ✅ Cada usuario tiene sus portafolios
4. ✅ Datos sincronizados en cloud
5. ✅ Acceso desde cualquier dispositivo
```

### Mantenimiento

```
Updates:
  git add .
  git commit -m "Update"
  git push
  → Auto-deploy en Vercel y Render

Monitoreo:
  - Vercel Analytics (gratis)
  - Render logs (dashboard)
  - Neon metrics (console)

Costos:
  $0/mes con free tiers ✅
```

---

**🚀 Deploy desde CLI completado**

**Script principal**: `./scripts/deploy-cli.sh`  
**Verificación**: `tests/verify-deploy.html`  
**Guía completa**: `docs/DEPLOY-GUIDE.md`
