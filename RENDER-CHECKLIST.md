# 🔧 Checklist de Configuración Render

**Fecha:** 8 de Enero, 2026  
**Servicio:** sv-portfolio-api  
**URL:** https://sv-portfolio-api.onrender.com

---

## ⚠️ Variables de Entorno Requeridas en Render

Debes configurar estas variables en el **Dashboard de Render** → **Environment**:

### 1. DATABASE_URL (CRÍTICO)
```bash
postgresql://neondb_owner:npg_EoF8PTBdMXA2@ep-shy-wind-ah6eilaz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```
- ✅ Conexión validada localmente
- ⚠️ Verificar en Render Dashboard

### 2. JWT_SECRET (CRÍTICO)
```bash
89a7c3f2e5b8d1a6f3c9e2b7d4a8f1c5e9b3d7a2f6c8e1b5d9a3f7c2e6b8d4a1
```
- ✅ Generado con crypto
- ⚠️ Debe ser el mismo que local

### 3. NODE_ENV
```bash
production
```

### 4. PORT
```bash
10000
```
- ℹ️ Render usa este puerto por defecto

### 5. ALLOWED_ORIGINS
```bash
https://sv-portfolio-dashboard.vercel.app,http://localhost:3000
```
- ⚠️ CRÍTICO para CORS
- Debe incluir el dominio de Vercel

### 6. SESSION_EXPIRY
```bash
7d
```

### 7. ENABLE_BACKGROUND_JOBS
```bash
true
```
- Para actualización de precios y noticias

---

## 📋 Estado Actual

### ✅ Configurado Localmente
- [x] DATABASE_URL
- [x] JWT_SECRET
- [x] ALLOWED_ORIGINS
- [x] SESSION_EXPIRY
- [x] Usuarios creados en DB

### ⚠️ Pendiente Verificar en Render
- [ ] Variables de entorno en Dashboard
- [ ] Health check endpoint
- [ ] Conexión a Neon desde Render
- [ ] CORS configurado correctamente

---

## 🚀 Pasos para Configurar Render

### 1. Acceder al Dashboard
```
https://dashboard.render.com
```

### 2. Seleccionar servicio
```
sv-portfolio-api
```

### 3. Ir a Environment
```
Dashboard → sv-portfolio-api → Environment
```

### 4. Agregar/Verificar cada variable
```
+ Add Environment Variable

Key: DATABASE_URL
Value: postgresql://neondb_owner:npg_EoF8PTBdMXA2@ep-shy-wind-ah6eilaz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

[Repetir para cada variable]
```

### 5. Guardar y Redeploy
```
Save Changes → Manual Deploy (si necesario)
```

---

## 🧪 Pruebas Después de Deploy

### 1. Health Check
```bash
# Debe responder con:
# {"status":"ok","version":"3.0","timestamp":"..."}

curl https://sv-portfolio-api.onrender.com/health
```

### 2. Test Login
```bash
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Svernis1"}'

# Debe responder con token y user
```

### 3. Test desde Frontend
```
1. Abrir: https://sv-portfolio-dashboard.vercel.app/login
2. Usuario: admin
3. Password: Svernis1
4. Click "Iniciar Sesión"
5. Debe redirigir a dashboard
```

---

## 🔍 Troubleshooting

### Si el backend no responde:
1. Verificar logs en Render Dashboard → Logs
2. Buscar errores de conexión a DB
3. Verificar que DATABASE_URL sea correcto
4. Revisar que JWT_SECRET esté configurado

### Si da error CORS:
1. Verificar ALLOWED_ORIGINS incluya dominio de Vercel
2. Revisar que NO tenga espacios extras
3. Confirmar que esté separado por comas

### Si no puede conectar a DB:
1. Verificar que DATABASE_URL termine en ?sslmode=require
2. Probar conexión desde Render Shell:
   ```bash
   npm run prisma studio
   ```

---

## 📊 Estado de Usuarios en DB

Usuarios actualmente en Neon:
```
👤 admin@svportfolio.com
   Username: admin
   Password: Svernis1
   Settings: ✅ Configurados

👤 porrito@svportfolio.com
   Username: porrito
   Password: Selapeloalchispa1
   Settings: ✅ Configurados
```

---

## 🔗 Enlaces Importantes

- **Render Dashboard:** https://dashboard.render.com
- **Neon Console:** https://console.neon.tech
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Frontend Live:** https://sv-portfolio-dashboard.vercel.app
- **Backend Live:** https://sv-portfolio-api.onrender.com

---

## ✅ Checklist Final

Antes de considerar completado:
- [ ] Todas las variables de entorno configuradas en Render
- [ ] Health check responde OK
- [ ] Login funciona desde frontend
- [ ] CORS permite requests desde Vercel
- [ ] Datos persisten correctamente
- [ ] Logs no muestran errores

---

## 🎯 Próximo Paso

**Deploy a Vercel** con credenciales actualizadas en login.html
