# 🚀 Despliegue en Render - Guía Completa

## 📋 Requisitos Previos

- Cuenta en [Render](https://render.com)
- Cuenta en [Neon](https://neon.tech) o base de datos PostgreSQL
- Repositorio GitHub con el código

## 🗄️ Paso 1: Configurar Base de Datos

### Opción A: Neon (Recomendado - Gratis)

1. Ve a [Neon Console](https://console.neon.tech)
2. Crea un nuevo proyecto: "SV Portfolio"
3. Copia la connection string:
   ```
   postgresql://user:pass@host.neon.tech/database?sslmode=require
   ```

### Opción B: Render PostgreSQL

1. En Render Dashboard → New → PostgreSQL
2. Nombre: `sv-portfolio-db`
3. Plan: Free
4. Copia la Internal Database URL

## 🌐 Paso 2: Desplegar Backend en Render

### Crear Web Service

1. **Dashboard → New → Web Service**

2. **Conectar Repositorio:**
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `inversion`
   - Root Directory: `backend`

3. **Configuración Básica:**
   ```
   Name: sv-portfolio-backend
   Region: Oregon (US West) - más cercano
   Branch: master (o main)
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npx prisma generate && npx prisma migrate deploy
   Start Command: npm start
   ```

4. **Plan:**
   - Free (512 MB RAM, se apaga después de 15 min de inactividad)

### Configurar Variables de Entorno

En el dashboard del servicio → Environment:

**Variables Obligatorias:**

```bash
# Database
DATABASE_URL = postgresql://neondb_owner:npg_EoF8PTBdMXA2@ep-shy-wind-ah6eilaz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Security (⚠️ CAMBIAR EN PRODUCCIÓN)
JWT_SECRET = 89a7c3f2e5b8d1a6f3c9e2b7d4a8f1c5e9b3d7a2f6c8e1b5d9a3f7c2e6b8d4a1

# Server
NODE_ENV = production
PORT = 3000

# CORS (⚠️ ACTUALIZAR con tu dominio frontend)
ALLOWED_ORIGINS = https://tu-frontend.vercel.app,https://tu-frontend.onrender.com

# Session
SESSION_EXPIRY = 7d
```

**Variables Opcionales:**

```bash
# Background Jobs (activar si necesitas workers)
ENABLE_BACKGROUND_JOBS = false

# API Keys (opcional - sistema funciona sin ellas)
FINNHUB_API_KEY = tu_key_aqui
SENTIMENT_API_KEY = tu_key_aqui
SENTIMENT_API_PROVIDER = api-ninjas
```

### Generar Nuevo JWT Secret (Recomendado)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🎨 Paso 3: Desplegar Frontend

### Opción A: Vercel (Recomendado)

1. Ve a [Vercel](https://vercel.com)
2. New Project → Import Git Repository
3. Selecciona tu repositorio
4. **Configuración:**
   ```
   Root Directory: public
   Build Command: (dejar vacío - es estático)
   Output Directory: .
   Install Command: npm install (si tienes package.json)
   ```

5. **Variables de Entorno:**
   ```
   VITE_API_URL = https://sv-portfolio-backend.onrender.com
   ```

6. Deploy

### Opción B: Render Static Site

1. Dashboard → New → Static Site
2. Conectar repositorio
3. **Configuración:**
   ```
   Name: sv-portfolio-frontend
   Root Directory: public
   Build Command: (vacío)
   Publish Directory: .
   ```

## 🔗 Paso 4: Conectar Frontend con Backend

Una vez desplegado el backend, Render te dará una URL:
```
https://sv-portfolio-backend.onrender.com
```

### Actualizar Frontend

En `public/assets/js/auth.js`, actualiza:

```javascript
const API_BASE_URL = 'https://sv-portfolio-backend.onrender.com';
```

### Actualizar CORS en Backend

En Render → Environment, actualiza `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS = https://tu-frontend.vercel.app,https://tu-frontend.onrender.com
```

## ✅ Paso 5: Verificar Despliegue

### Test Backend

Visita:
```
https://sv-portfolio-backend.onrender.com/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2026-01-11T..."
}
```

### Test Frontend

1. Abre tu frontend
2. Intenta registrarte/login
3. Verifica que las noticias se cargan
4. Revisa la consola de desarrollador para errores

## 🐛 Troubleshooting

### Error: "CORS blocked"

**Solución:**
- Verifica que `ALLOWED_ORIGINS` incluye tu dominio frontend
- Asegúrate de usar HTTPS (no HTTP)
- Render redeploy después de cambiar variables

### Error: "Database connection failed"

**Solución:**
- Verifica `DATABASE_URL` en Render Environment
- Asegúrate que incluye `?sslmode=require`
- Verifica que Neon database está activa

### Error: "Service unavailable" (Free tier)

**Causa:** Render free tier se apaga después de 15 min sin uso

**Solución:**
- Primera petición toma ~30-60 segundos (cold start)
- Considera upgrade a Starter plan ($7/mes) para always-on
- O implementa ping service para mantenerlo activo

### Backend tarda en responder

**Causa:** Cold start en free tier

**Soluciones:**
1. **Implementar keep-alive:**
   ```javascript
   // En frontend
   setInterval(async () => {
     await fetch('https://tu-backend.onrender.com/api/health');
   }, 14 * 60 * 1000); // Cada 14 minutos
   ```

2. **Usar cron-job.org** (gratis):
   - Crea job que haga ping cada 10 minutos
   - URL: `https://tu-backend.onrender.com/api/health`

## 📊 Monitoreo

### Logs en Render

Dashboard → Logs → Ver output del servidor

### Métricas

Dashboard → Metrics → CPU, Memory, Response time

## 🔒 Seguridad en Producción

✅ **Checklist:**

- [ ] JWT_SECRET único y aleatorio (32+ caracteres)
- [ ] ALLOWED_ORIGINS configurado correctamente
- [ ] DATABASE_URL con `sslmode=require`
- [ ] NODE_ENV=production
- [ ] API Keys en variables de entorno (no hardcoded)
- [ ] Rate limiting activado (ya incluido en el código)
- [ ] HTTPS only (Render lo hace automáticamente)

## 💰 Costos

### Free Tier

- **Render:** 750 horas gratis/mes (suficiente para 1 servicio)
- **Neon:** 0.5 GB almacenamiento, 1 proyecto gratis
- **Total:** $0/mes

### Limitaciones Free Tier

- Backend se apaga después de 15 min inactividad
- 512 MB RAM
- Cold start de ~30-60 segundos
- Shared CPU

### Upgrade Recomendado

Si tienes tráfico constante:
- **Render Starter:** $7/mes (always-on, 512 MB RAM)
- **Render Standard:** $25/mes (2 GB RAM, mejor performance)
- **Neon Scale:** $19/mes (10 GB almacenamiento, mejor performance)

## 🚀 Optimizaciones

### 1. Habilitar Caching

Ya implementado en el código:
- Cache de precios (5 minutos)
- Cache de noticias (30 minutos)

### 2. Compress Responses

Ya incluido con `compression` middleware

### 3. Database Pooling

Ya configurado con Prisma connection pooling

## 📝 URLs de Ejemplo

Después del deploy tendrás:

```
Backend:  https://sv-portfolio-backend.onrender.com
Frontend: https://sv-portfolio.vercel.app
Database: ep-shy-wind-ah6eilaz-pooler.c-3.us-east-1.aws.neon.tech
```

## 🔄 Redeploy

### Automático (Recomendado)

Push a GitHub → Render detecta cambios → Redeploy automático

### Manual

Dashboard → Manual Deploy → Deploy latest commit

## 📞 Soporte

- [Render Docs](https://render.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Prisma Docs](https://www.prisma.io/docs)

---

**¡Listo!** Tu aplicación debería estar corriendo en producción 🎉
