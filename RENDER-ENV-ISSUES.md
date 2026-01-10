# ⚠️ Problemas con Variables de Entorno en Render

## 🔴 Problemas Detectados

### 1. ALLOWED_ORIGINS tiene slash final
**Actual:**
```
ALLOWED_ORIGINS=https://sv-portfolio-dashboard.vercel.app/
```

**Debería ser:**
```
ALLOWED_ORIGINS=https://sv-portfolio-dashboard.vercel.app
```

**Problema:** El slash final puede causar problemas con CORS.

---

### 2. JWT_SECRET diferente al local
**En Render:**
```
JWT_SECRET=aafbe42870961f951bacd2426f6ad17b
```

**En Local (.env):**
```
JWT_SECRET=89a7c3f2e5b8d1a6f3c9e2b7d4a8f1c5e9b3d7a2f6c8e1b5d9a3f7c2e6b8d4a1
```

**Problema:** Los tokens JWT generados localmente NO funcionarán en producción y viceversa.

**Impacto:** Esto está bien si solo vas a usar producción, pero si desarrollas localmente tendrás que re-autenticarte cada vez que cambies de ambiente.

---

### 3. Faltan variables recomendadas

**No configuradas:**
- `PORT=10000` (opcional, Render lo asigna automáticamente)
- `ENABLE_BACKGROUND_JOBS=true` (para actualización de precios/noticias)

---

## ✅ Correctas

- ✅ `DATABASE_URL` - Correcto
- ✅ `NODE_ENV=production` - Correcto
- ✅ `SESSION_EXPIRY=7d` - Correcto

---

## 🔧 Comandos para Corregir

### Opción 1: Via Render CLI

```bash
# Corregir ALLOWED_ORIGINS (remover slash final)
render env-vars set ALLOWED_ORIGINS=https://sv-portfolio-dashboard.vercel.app --service sv-portfolio-api

# Opcional: Sincronizar JWT_SECRET con local
render env-vars set JWT_SECRET=89a7c3f2e5b8d1a6f3c9e2b7d4a8f1c5e9b3d7a2f6c8e1b5d9a3f7c2e6b8d4a1 --service sv-portfolio-api

# Agregar background jobs
render env-vars set ENABLE_BACKGROUND_JOBS=true --service sv-portfolio-api
```

### Opción 2: Via Dashboard

1. Ir a: https://dashboard.render.com
2. Seleccionar: `sv-portfolio-api`
3. Tab: **Environment**
4. Editar:
   - `ALLOWED_ORIGINS` → remover `/` final
   - `JWT_SECRET` → (opcional) cambiar al de local
   - Agregar `ENABLE_BACKGROUND_JOBS=true`
5. Save Changes

---

## 🎯 Recomendación

**Para desarrollo + producción:**
- Sincronizar JWT_SECRET entre local y Render
- Así los tokens funcionan en ambos ambientes

**Solo producción:**
- Dejar como está
- Los usuarios siempre se autenticarán en producción

---

## 🧪 Después de Corregir

Probar:
```bash
./test-backend.sh
```

O manualmente:
```bash
# Test login
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Svernis1"}'
```
