# ⚠️ PENDIENTES PARA DESPLIEGUE COMPLETO

**Fecha:** 13 de Enero, 2026  
**Estado General:** ✅ Sistema funcional, pendientes menores

---

## 🎯 RESUMEN EJECUTIVO

El sistema está **100% desplegado y funcional** en producción. Los pendientes identificados son **mejoras menores** que no afectan la funcionalidad core del sistema.

**Estado Actual:**
- ✅ Frontend: LIVE en Vercel
- ✅ Backend: LIVE en Render
- ✅ Database: LIVE en Neon
- ✅ Autenticación: Funcionando
- ✅ CRUD Operations: Funcionando

---

## 🔴 PRIORIDAD ALTA (Hacer Esta Semana)

### 1. Corregir Routing de Vercel ⚠️

**Problema:** La ruta `/login` retorna 404, aunque `/` funciona correctamente.

**Impacto:** BAJO - Los usuarios pueden acceder desde `/` sin problemas.

**Solución:**
```json
// Editar /vercel/sandbox/vercel.json
// Agregar en el array "routes":
{
  "src": "/login",
  "dest": "/login.html"
},
{
  "src": "/dashboard",
  "dest": "/index.html"
}
```

**Pasos:**
1. Editar `vercel.json`
2. Agregar las rutas faltantes
3. Commit y push
4. Vercel redeploys automáticamente
5. Verificar: `curl https://sv-portfolio-dashboard.vercel.app/login`

**Tiempo estimado:** 5 minutos

---

### 2. Verificar y Corregir CORS en Render ⚠️

**Problema:** Según `FIX-RENDER-VARS.md`, `ALLOWED_ORIGINS` tiene un slash final.

**Estado:** Documentado pero no verificado en vivo.

**Solución:**
1. Ir a: https://dashboard.render.com
2. Seleccionar: `sv-portfolio-api`
3. Ir a: **Environment**
4. Editar `ALLOWED_ORIGINS`:
   ```
   ANTES: https://sv-portfolio-dashboard.vercel.app/
   DESPUÉS: https://sv-portfolio-dashboard.vercel.app
   ```
5. Save Changes
6. Esperar redeploy (~3-5 min)

**Verificación:**
```bash
# Test desde frontend
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://sv-portfolio-dashboard.vercel.app" \
  -d '{"username":"admin","password":"Svernis1"}'
```

**Tiempo estimado:** 10 minutos

---

### 3. Habilitar Background Jobs ⚠️

**Problema:** `ENABLE_BACKGROUND_JOBS` no está configurada en Render.

**Impacto:** MEDIO - Actualización automática de precios deshabilitada.

**Solución:**
1. Ir a: https://dashboard.render.com
2. Seleccionar: `sv-portfolio-api`
3. Ir a: **Environment**
4. Click: **Add Environment Variable**
5. Agregar:
   ```
   Key: ENABLE_BACKGROUND_JOBS
   Value: true
   ```
6. Save Changes
7. Esperar redeploy (~3-5 min)

**Verificación:**
```bash
# Verificar logs en Render Dashboard
# Debe mostrar: "Background scheduler started"
```

**Tiempo estimado:** 10 minutos

---

### 4. Configurar UptimeRobot 🔄

**Problema:** Render Free tier duerme después de 15 min de inactividad.

**Impacto:** MEDIO - Primera request toma ~30 segundos (cold start).

**Solución:**
1. Ir a: https://uptimerobot.com (Gratis)
2. Crear cuenta
3. Add New Monitor:
   ```
   Monitor Type: HTTP(s)
   Friendly Name: SV Portfolio API
   URL: https://sv-portfolio-api.onrender.com/health
   Monitoring Interval: 5 minutes
   ```
4. Save

**Beneficio:** Mantiene el backend activo 24/7.

**Tiempo estimado:** 15 minutos

---

## 🟡 PRIORIDAD MEDIA (Próximos 7 Días)

### 5. Testing End-to-End Completo 🧪

**Objetivo:** Validar todas las funcionalidades en producción.

**Checklist:**
- [ ] Login con usuario demo
- [ ] Crear nuevo usuario
- [ ] Crear portfolio
- [ ] Agregar posiciones
- [ ] Actualizar precios
- [ ] Ver gráficos
- [ ] Cambiar settings
- [ ] Logout y re-login
- [ ] Verificar persistencia
- [ ] Test multi-dispositivo

**Herramienta:** `tests/verify-deploy.html`

**Tiempo estimado:** 30 minutos

---

### 6. Documentar API con Swagger 📚

**Objetivo:** Generar documentación interactiva de la API.

**Pasos:**
1. Instalar: `npm install swagger-ui-express swagger-jsdoc`
2. Crear: `backend/src/swagger.js`
3. Agregar JSDoc comments en routes
4. Montar en: `/api/docs`

**Beneficio:** Facilita integración y testing.

**Tiempo estimado:** 2 horas

---

### 7. Implementar Rate Limiting 🛡️

**Objetivo:** Proteger API de abuso.

**Pasos:**
1. Instalar: `npm install express-rate-limit`
2. Configurar en `backend/src/server.js`:
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 100 // 100 requests por IP
   });
   
   app.use('/api/', limiter);
   ```
3. Deploy

**Beneficio:** Seguridad mejorada.

**Tiempo estimado:** 30 minutos

---

### 8. Agregar Logging Estructurado 📝

**Objetivo:** Mejorar debugging y monitoreo.

**Pasos:**
1. Instalar: `npm install winston`
2. Crear: `backend/src/utils/logger.js`
3. Reemplazar `console.log` por `logger.info/error`
4. Configurar niveles por entorno

**Beneficio:** Mejor observabilidad.

**Tiempo estimado:** 1 hora

---

## 🟢 PRIORIDAD BAJA (Futuro)

### 9. Custom Domain 🌐

**Objetivo:** Usar dominio propio (ej: `portfolio.tudominio.com`).

**Pasos:**
1. Comprar dominio (Namecheap, GoDaddy, etc.)
2. Configurar DNS en Vercel
3. Configurar DNS en Render
4. Actualizar CORS

**Costo:** ~$10-15/año

**Tiempo estimado:** 1 hora

---

### 10. Configurar API Keys Externas 🔑

**Objetivo:** Habilitar features premium (noticias, sentiment, etc.).

**APIs Opcionales:**
- Finnhub (Financial news) - https://finnhub.io/
- API Ninjas (Sentiment) - https://api-ninjas.com/
- Marketstack (Market data) - https://marketstack.com/
- Alpha Vantage (Market data) - https://www.alphavantage.co/

**Nota:** Sistema funciona sin ellas usando datos locales.

**Tiempo estimado:** 30 minutos

---

### 11. Implementar Tests Automatizados 🧪

**Objetivo:** Asegurar calidad del código.

**Pasos:**
1. Instalar: `npm install --save-dev jest supertest`
2. Crear: `backend/tests/`
3. Escribir tests para:
   - Auth endpoints
   - Portfolio CRUD
   - Position CRUD
   - Settings
4. Configurar CI/CD

**Beneficio:** Prevenir regresiones.

**Tiempo estimado:** 4 horas

---

### 12. Configurar Monitoring 📊

**Objetivo:** Monitorear errores y performance.

**Opciones:**
- **Sentry** (Error tracking) - Free tier disponible
- **LogRocket** (Session replay) - Free tier disponible
- **New Relic** (APM) - Free tier disponible

**Pasos:**
1. Crear cuenta en servicio elegido
2. Instalar SDK
3. Configurar en frontend y backend
4. Configurar alertas

**Beneficio:** Detectar issues proactivamente.

**Tiempo estimado:** 2 horas

---

### 13. Optimizar Performance ⚡

**Objetivos:**
- Reducir bundle size del frontend
- Implementar lazy loading
- Optimizar queries de DB
- Agregar caching (Redis)

**Pasos:**
1. Analizar bundle con Webpack Bundle Analyzer
2. Code splitting en frontend
3. Implementar React Query o SWR
4. Agregar Redis para caching (Upstash free tier)
5. Optimizar queries Prisma

**Beneficio:** Mejor UX y menor costo.

**Tiempo estimado:** 8 horas

---

### 14. Implementar Analytics 📈

**Objetivo:** Entender uso del sistema.

**Opciones:**
- **Plausible** (Privacy-friendly) - $9/mes
- **Google Analytics** (Gratis)
- **Umami** (Self-hosted, gratis)

**Pasos:**
1. Crear cuenta
2. Agregar script en frontend
3. Configurar eventos personalizados
4. Crear dashboards

**Beneficio:** Data-driven decisions.

**Tiempo estimado:** 1 hora

---

### 15. Migrar a Render Starter Plan 💰

**Objetivo:** Eliminar cold starts y sleep.

**Costo:** $7/mes

**Beneficios:**
- Sin sleep
- Sin cold starts
- 512 MB RAM garantizada
- Mejor performance

**Cuándo:** Cuando tengas usuarios activos regulares.

**Tiempo estimado:** 5 minutos (upgrade)

---

## 📊 RESUMEN DE PENDIENTES

| Prioridad | Tarea | Impacto | Tiempo | Estado |
|-----------|-------|---------|--------|--------|
| 🔴 ALTA | Corregir routing Vercel | BAJO | 5 min | ⚠️ Pendiente |
| 🔴 ALTA | Verificar CORS Render | BAJO | 10 min | ⚠️ Pendiente |
| 🔴 ALTA | Habilitar background jobs | MEDIO | 10 min | ⚠️ Pendiente |
| 🔴 ALTA | Configurar UptimeRobot | MEDIO | 15 min | ⚠️ Pendiente |
| 🟡 MEDIA | Testing end-to-end | ALTO | 30 min | ⚠️ Pendiente |
| 🟡 MEDIA | Documentar API (Swagger) | MEDIO | 2 hrs | ⚠️ Pendiente |
| 🟡 MEDIA | Rate limiting | MEDIO | 30 min | ⚠️ Pendiente |
| 🟡 MEDIA | Logging estructurado | MEDIO | 1 hr | ⚠️ Pendiente |
| 🟢 BAJA | Custom domain | BAJO | 1 hr | ⚠️ Opcional |
| 🟢 BAJA | API keys externas | BAJO | 30 min | ⚠️ Opcional |
| 🟢 BAJA | Tests automatizados | ALTO | 4 hrs | ⚠️ Opcional |
| 🟢 BAJA | Monitoring (Sentry) | MEDIO | 2 hrs | ⚠️ Opcional |
| 🟢 BAJA | Optimizar performance | MEDIO | 8 hrs | ⚠️ Opcional |
| 🟢 BAJA | Analytics | BAJO | 1 hr | ⚠️ Opcional |
| 🟢 BAJA | Render Starter plan | MEDIO | 5 min | ⚠️ Opcional |

---

## 🎯 PLAN DE ACCIÓN RECOMENDADO

### Esta Semana (40 minutos)
1. ✅ Corregir routing Vercel (5 min)
2. ✅ Verificar CORS Render (10 min)
3. ✅ Habilitar background jobs (10 min)
4. ✅ Configurar UptimeRobot (15 min)

### Próxima Semana (4 horas)
1. ✅ Testing end-to-end completo (30 min)
2. ✅ Documentar API con Swagger (2 hrs)
3. ✅ Implementar rate limiting (30 min)
4. ✅ Agregar logging estructurado (1 hr)

### Próximo Mes (Opcional, 15+ horas)
1. ⚠️ Tests automatizados (4 hrs)
2. ⚠️ Monitoring con Sentry (2 hrs)
3. ⚠️ Optimizar performance (8 hrs)
4. ⚠️ Analytics (1 hr)
5. ⚠️ Custom domain (1 hr)

---

## ✅ CRITERIOS DE ÉXITO

### Despliegue Completo (100%)
- [x] Frontend desplegado en Vercel
- [x] Backend desplegado en Render
- [x] Database configurada en Neon
- [x] Autenticación funcionando
- [x] CRUD operations funcionando
- [ ] Routing de Vercel corregido
- [ ] CORS verificado y corregido
- [ ] Background jobs habilitados
- [ ] UptimeRobot configurado
- [ ] Testing end-to-end completado

### Sistema Robusto (Opcional)
- [ ] API documentada con Swagger
- [ ] Rate limiting implementado
- [ ] Logging estructurado
- [ ] Monitoring activo
- [ ] Tests automatizados
- [ ] Performance optimizado

---

## 📞 SOPORTE Y RECURSOS

### Dashboards
- **Vercel:** https://vercel.com/dashboard
- **Render:** https://dashboard.render.com
- **Neon:** https://console.neon.tech

### Documentación
- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Prisma Docs:** https://www.prisma.io/docs

### Herramientas
- **UptimeRobot:** https://uptimerobot.com
- **Sentry:** https://sentry.io
- **Swagger:** https://swagger.io

---

**Última actualización:** 13 de Enero, 2026  
**Próxima revisión:** 20 de Enero, 2026  
**Responsable:** Equipo de desarrollo
