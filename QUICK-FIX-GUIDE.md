# ⚡ GUÍA RÁPIDA DE CORRECCIONES

**Fecha:** 13 de Enero, 2026  
**Tiempo total estimado:** 40 minutos  
**Objetivo:** Completar despliegue al 100%

---

## 🎯 CORRECCIONES PRIORITARIAS (4 tareas)

### ✅ 1. Corregir Routing de Vercel (5 minutos)

**Problema:** `/login` y `/dashboard` retornan 404.

**Solución:**

```bash
# 1. Editar vercel.json
nano /vercel/sandbox/vercel.json
```

**Agregar estas rutas en el array "routes" (antes de las rutas existentes):**

```json
{
  "version": 2,
  "buildCommand": "npx tailwindcss -i ./public/assets/css/input.css -o ./public/assets/css/output.css --minify",
  "outputDirectory": "public",
  "routes": [
    {
      "src": "/login",
      "dest": "/login.html"
    },
    {
      "src": "/dashboard",
      "dest": "/index.html"
    },
    {
      "src": "/assets/css/(.*)",
      "dest": "/assets/css/$1",
      "headers": {
        "Content-Type": "text/css; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/assets/js/(.*)",
      "dest": "/assets/js/$1",
      "headers": {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/",
      "dest": "/login.html"
    }
  ]
}
```

**Commit y deploy:**

```bash
cd /vercel/sandbox
git add vercel.json
git commit -m "fix: Add /login and /dashboard routes to vercel.json"
git push origin main
```

**Verificar (esperar ~1 minuto):**

```bash
curl -I https://sv-portfolio-dashboard.vercel.app/login
# Debe retornar: 200 OK
```

---

### ✅ 2. Corregir CORS en Render (10 minutos)

**Problema:** `ALLOWED_ORIGINS` puede tener trailing slash.

**Solución:**

1. **Ir a Render Dashboard:**
   ```
   https://dashboard.render.com
   ```

2. **Seleccionar servicio:**
   - Click en: `sv-portfolio-api`

3. **Ir a Environment:**
   - Click en: **Environment** (menú izquierdo)

4. **Editar ALLOWED_ORIGINS:**
   - Buscar: `ALLOWED_ORIGINS`
   - Click en: ✏️ (editar)
   - **Valor actual:** `https://sv-portfolio-dashboard.vercel.app/`
   - **Cambiar a:** `https://sv-portfolio-dashboard.vercel.app`
   - Click: **Save**

5. **Esperar redeploy:**
   - Render redeploys automáticamente (~3-5 min)
   - Ver progreso en tab **Events**

**Verificar:**

```bash
# Test CORS desde frontend
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://sv-portfolio-dashboard.vercel.app" \
  -d '{"username":"admin","password":"Svernis1"}' \
  -v 2>&1 | grep -i "access-control"

# Debe mostrar:
# access-control-allow-origin: https://sv-portfolio-dashboard.vercel.app
```

---

### ✅ 3. Habilitar Background Jobs (10 minutos)

**Problema:** Actualización automática de precios deshabilitada.

**Solución:**

1. **Ir a Render Dashboard:**
   ```
   https://dashboard.render.com
   ```

2. **Seleccionar servicio:**
   - Click en: `sv-portfolio-api`

3. **Ir a Environment:**
   - Click en: **Environment** (menú izquierdo)

4. **Agregar nueva variable:**
   - Click en: **Add Environment Variable**
   - **Key:** `ENABLE_BACKGROUND_JOBS`
   - **Value:** `true`
   - Click: **Save**

5. **Esperar redeploy:**
   - Render redeploys automáticamente (~3-5 min)
   - Ver progreso en tab **Events**

**Verificar:**

1. **Ver logs en Render:**
   - Click en: **Logs** (menú izquierdo)
   - Buscar: `"Background scheduler started"`
   - Debe aparecer después del redeploy

2. **Test desde API:**
   ```bash
   curl https://sv-portfolio-api.onrender.com/health
   # Debe retornar: {"status":"ok","version":"3.0","timestamp":"..."}
   ```

---

### ✅ 4. Configurar UptimeRobot (15 minutos)

**Problema:** Render Free tier duerme después de 15 min de inactividad.

**Solución:**

1. **Crear cuenta en UptimeRobot:**
   ```
   https://uptimerobot.com/signUp
   ```
   - Email: tu@email.com
   - Password: (crear)
   - Click: **Sign Up**

2. **Verificar email:**
   - Revisar inbox
   - Click en link de verificación

3. **Agregar monitor:**
   - Click en: **+ Add New Monitor**
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** `SV Portfolio API`
   - **URL:** `https://sv-portfolio-api.onrender.com/health`
   - **Monitoring Interval:** `5 minutes`
   - Click: **Create Monitor**

4. **Configurar alertas (opcional):**
   - Click en: **Alert Contacts**
   - Agregar email para notificaciones
   - Click: **Create Alert Contact**

**Verificar:**

- Dashboard de UptimeRobot debe mostrar:
  - Status: **Up**
  - Response Time: ~200-500ms
  - Uptime: 100%

**Beneficio:** Backend se mantiene activo 24/7, sin cold starts.

---

## 🧪 VERIFICACIÓN FINAL (5 minutos)

### Test 1: Frontend Routing

```bash
# Test root
curl -I https://sv-portfolio-dashboard.vercel.app/
# Esperado: 200 OK

# Test /login
curl -I https://sv-portfolio-dashboard.vercel.app/login
# Esperado: 200 OK

# Test /dashboard
curl -I https://sv-portfolio-dashboard.vercel.app/dashboard
# Esperado: 200 OK
```

### Test 2: Backend Health

```bash
curl https://sv-portfolio-api.onrender.com/health
# Esperado: {"status":"ok","version":"3.0","timestamp":"..."}
```

### Test 3: Login Funcional

```bash
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Svernis1"}'

# Esperado: {"token":"...","user":{...}}
```

### Test 4: CORS

```bash
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://sv-portfolio-dashboard.vercel.app" \
  -d '{"username":"admin","password":"Svernis1"}' \
  -v 2>&1 | grep -i "access-control"

# Esperado: access-control-allow-origin: https://sv-portfolio-dashboard.vercel.app
```

### Test 5: Frontend End-to-End

1. **Abrir en navegador:**
   ```
   https://sv-portfolio-dashboard.vercel.app
   ```

2. **Login:**
   - Usuario: `admin`
   - Password: `Svernis1`
   - Click: **Iniciar Sesión**

3. **Verificar:**
   - ✅ Redirige a dashboard
   - ✅ Muestra portfolios
   - ✅ Gráficos se cargan
   - ✅ Puede agregar posiciones

4. **Test persistencia:**
   - Agregar una posición de prueba
   - Refrescar página (F5)
   - ✅ Posición sigue ahí

5. **Test multi-dispositivo:**
   - Abrir en otro navegador/dispositivo
   - Login con mismo usuario
   - ✅ Ver los mismos datos

---

## ✅ CHECKLIST DE COMPLETITUD

### Antes de las Correcciones
- [x] Frontend desplegado en Vercel
- [x] Backend desplegado en Render
- [x] Database configurada en Neon
- [x] Autenticación funcionando
- [x] CRUD operations funcionando
- [ ] Routing de Vercel corregido
- [ ] CORS verificado y corregido
- [ ] Background jobs habilitados
- [ ] UptimeRobot configurado

### Después de las Correcciones
- [x] Frontend desplegado en Vercel
- [x] Backend desplegado en Render
- [x] Database configurada en Neon
- [x] Autenticación funcionando
- [x] CRUD operations funcionando
- [x] Routing de Vercel corregido ✅
- [x] CORS verificado y corregido ✅
- [x] Background jobs habilitados ✅
- [x] UptimeRobot configurado ✅

**RESULTADO:** 🎉 **DESPLIEGUE 100% COMPLETO**

---

## 📊 RESUMEN DE CAMBIOS

| Tarea | Archivo/Servicio | Cambio | Tiempo |
|-------|------------------|--------|--------|
| 1. Routing | `vercel.json` | Agregar rutas `/login` y `/dashboard` | 5 min |
| 2. CORS | Render Dashboard | Remover trailing slash de `ALLOWED_ORIGINS` | 10 min |
| 3. Background Jobs | Render Dashboard | Agregar `ENABLE_BACKGROUND_JOBS=true` | 10 min |
| 4. UptimeRobot | UptimeRobot.com | Crear monitor para health endpoint | 15 min |

**TOTAL:** 40 minutos

---

## 🎯 PRÓXIMOS PASOS (Opcional)

Después de completar estas correcciones, considera:

1. **Testing end-to-end completo** (30 min)
2. **Documentar API con Swagger** (2 hrs)
3. **Implementar rate limiting** (30 min)
4. **Agregar logging estructurado** (1 hr)

Ver: `PENDIENTES-DEPLOY.md` para más detalles.

---

## 🆘 TROUBLESHOOTING

### Si Vercel no redeploys automáticamente:

```bash
# Forzar redeploy
cd /vercel/sandbox
git commit --allow-empty -m "trigger: Force Vercel redeploy"
git push origin main
```

### Si Render no redeploys después de cambiar variables:

1. Ir a: https://dashboard.render.com
2. Seleccionar: `sv-portfolio-api`
3. Click en: **Manual Deploy** (arriba a la derecha)
4. Seleccionar: **Deploy latest commit**
5. Click: **Deploy**

### Si UptimeRobot no detecta el servicio:

1. Verificar URL manualmente:
   ```bash
   curl https://sv-portfolio-api.onrender.com/health
   ```
2. Si funciona, esperar 5 minutos
3. Refrescar dashboard de UptimeRobot

### Si login no funciona después de correcciones:

1. Abrir DevTools (F12)
2. Ir a: **Console**
3. Buscar errores de CORS
4. Verificar que `ALLOWED_ORIGINS` esté correcto en Render
5. Verificar que no haya espacios extras

---

## 📞 SOPORTE

### Dashboards
- **Vercel:** https://vercel.com/dashboard
- **Render:** https://dashboard.render.com
- **Neon:** https://console.neon.tech
- **UptimeRobot:** https://uptimerobot.com/dashboard

### Logs
- **Vercel Logs:** Dashboard → Project → Deployments → [Latest] → Logs
- **Render Logs:** Dashboard → Service → Logs (real-time)
- **Neon Logs:** Console → Project → Monitoring

### Documentación
- **Vercel Routing:** https://vercel.com/docs/concepts/projects/project-configuration#routes
- **Render Environment:** https://render.com/docs/environment-variables
- **UptimeRobot API:** https://uptimerobot.com/api/

---

**¡Listo para completar el despliegue al 100%!** 🚀

**Tiempo total:** 40 minutos  
**Dificultad:** Fácil  
**Resultado:** Sistema 100% funcional y optimizado
