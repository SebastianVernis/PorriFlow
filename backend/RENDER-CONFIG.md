# 🚀 Configuración de Render para SV Portfolio API

## 📋 Variables de Entorno Requeridas

Configura estas variables en **Render Dashboard → Environment**:

### 🔴 CRÍTICAS (Obligatorias)

```bash
# Database Connection (desde Neon)
DATABASE_URL="postgresql://neondb_owner:npg_EoF8PTBdMXA2@ep-shy-wind-ah6eilaz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# JWT Secret (IMPORTANTE: Usa el mismo valor de tu .env local)
JWT_SECRET="89a7c3f2e5b8d1a6f3c9e2b7d4a8f1c5e9b3d7a2f6c8e1b5d9a3f7c2e6b8d4a1"

# Environment
NODE_ENV="production"

# CORS - Tu dominio de Vercel
ALLOWED_ORIGINS="https://sv-portfolio-dashboard.vercel.app"

# Session
SESSION_EXPIRY="7d"
```

### 🟡 OPCIONALES (Recomendadas)

```bash
# Background Jobs
ENABLE_BACKGROUND_JOBS="true"

# Market Data APIs (si las usas)
FINNHUB_API_KEY="tu_finnhub_key"
ALPHA_VANTAGE_API_KEY="tu_alphavantage_key"
MARKETSTACK_API_KEY="tu_marketstack_key"
```

---

## 🔧 Configuración del Servicio

### Build Command
```bash
npm install && npx prisma generate
```

### Start Command
```bash
npx prisma db push --accept-data-loss && npm start
```

### Health Check Path
```
/health
```

### Port
- Render asigna automáticamente (usa `process.env.PORT`)
- Configurado como `10000` por defecto en render.yaml

---

## 📝 Pasos de Deployment

### 1. En Neon Console
- Ve a tu proyecto en https://console.neon.tech
- Copia la **Connection String** (pooler)
- Formato: `postgresql://user:password@host-pooler.neon.tech/database?sslmode=require`

### 2. En Render Dashboard
1. Ve a tu servicio → **Environment**
2. Agrega/actualiza cada variable
3. Click **Save Changes**
4. Render redesplegará automáticamente

### 3. Verificar Deployment
```bash
# Check health
curl https://sv-portfolio-api.onrender.com/health

# Expected response:
{
  "status": "ok",
  "version": "3.0",
  "timestamp": "2026-01-09T..."
}
```

### 4. Seed de Datos (Opcional)
Si necesitas crear usuarios demo en producción:

```bash
# En Render Dashboard → Shell
npm run db:seed
```

---

## ⚠️ Notas de Seguridad

### 🔒 IMPORTANTE
- **NUNCA** comitees el archivo `.env` al repositorio
- **ROTAR** credenciales si fueron expuestas públicamente
- Usar **secrets** de Render para datos sensibles

### 🔄 Rotar DATABASE_URL
Si tu connection string fue expuesta:
1. En Neon Console → Settings
2. Click **Reset Password**
3. Copia la nueva connection string
4. Actualiza en Render Environment

### 🔑 Regenerar JWT_SECRET
Si necesitas nuevo JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Luego actualiza en Render y haz que todos los usuarios reinicien sesión.

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
✅ Verifica que `DATABASE_URL` incluya `?sslmode=require`
✅ Confirma que uses la URL con `-pooler` (no la URL directa)

### Error: "Invalid JWT token"
✅ Asegúrate que `JWT_SECRET` sea idéntico entre local y producción

### Error: "CORS blocked"
✅ Verifica que `ALLOWED_ORIGINS` incluya tu dominio de Vercel exacto

### Cold Start (Primera petición lenta)
✅ Normal en Render Free Tier
✅ El servicio "duerme" después de 15 min de inactividad
✅ Primera petición toma ~30 segundos

---

## 📊 Monitoreo

### Logs en Tiempo Real
Render Dashboard → Logs

### Métricas
Render Dashboard → Metrics
- CPU Usage
- Memory Usage
- Request Count
- Response Time

### Database
Neon Console → Monitoring
- Connection Count
- Query Performance
- Storage Usage

---

## 🔄 CI/CD

### Auto-Deploy desde GitHub
El servicio se redesplega automáticamente cuando:
- Haces push a `main` (si está configurado)
- Actualizas variables de entorno
- Triggering manual desde Render Dashboard

### Deshabilitar Auto-Deploy
Render Dashboard → Settings → Auto-Deploy: Off

---

## 💡 Tips de Optimización

1. **Connection Pooling**: Ya configurado con `-pooler` de Neon
2. **Environment Variables**: Usar cache cuando sea posible
3. **Health Checks**: Mantener endpoint `/health` ligero
4. **Logs**: No loguear información sensible
5. **Background Jobs**: Solo habilitarlos si son necesarios (`ENABLE_BACKGROUND_JOBS=false` para ahorrar recursos)

---

## 📞 Soporte

- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Última actualización:** 2026-01-09  
**Versión:** 3.0  
**Autor:** Sebastian Vernis
