# 🔧 Corregir Variables de Entorno en Render

## ⚠️ El Render CLI v2.6.1 no soporta manejo de variables de entorno

Debes hacerlo manualmente desde el Dashboard.

---

## 📋 Pasos para Corregir

### 1. Acceder al Dashboard
```
https://dashboard.render.com
```

### 2. Seleccionar Servicio
- Click en: **sv-portfolio-api**

### 3. Ir a Environment Tab
- Click en: **Environment** (menú izquierdo)

### 4. Corregir Variables

#### Variable 1: ALLOWED_ORIGINS
**Actual:**
```
ALLOWED_ORIGINS=https://sv-portfolio-dashboard.vercel.app/
```

**Cambiar a (sin slash final):**
```
ALLOWED_ORIGINS=https://sv-portfolio-dashboard.vercel.app
```

**Acción:**
- Click en el icono de editar ✏️
- Remover el `/` final
- Save

---

#### Variable 2: ENABLE_BACKGROUND_JOBS (Agregar nueva)
**Acción:**
- Click en **"Add Environment Variable"**
- Key: `ENABLE_BACKGROUND_JOBS`
- Value: `true`
- Save

---

#### Variable 3: JWT_SECRET (Opcional - Solo si quieres sincronizar con local)

**Actual:**
```
JWT_SECRET=aafbe42870961f951bacd2426f6ad17b
```

**Cambiar a (mismo que local):**
```
JWT_SECRET=89a7c3f2e5b8d1a6f3c9e2b7d4a8f1c5e9b3d7a2f6c8e1b5d9a3f7c2e6b8d4a1
```

**⚠️ NOTA:** 
- Si lo cambias, todos los tokens existentes dejarán de funcionar
- Los usuarios deberán hacer login nuevamente
- Solo hazlo si necesitas compatibilidad entre local y producción

---

### 5. Guardar Cambios
- Click en **"Save Changes"** (arriba a la derecha)

### 6. Esperar Redeploy
- Render hará redeploy automático (~3-5 minutos)
- Ver progreso en tab **Events**

---

## ✅ Variables Finales Correctas

```bash
ALLOWED_ORIGINS=https://sv-portfolio-dashboard.vercel.app
DATABASE_URL=postgresql://neondb_owner:npg_EoF8PTBdMXA2@ep-shy-wind-ah6eilaz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=aafbe42870961f951bacd2426f6ad17b  # (o el de local si decides sincronizar)
NODE_ENV=production
SESSION_EXPIRY=7d
ENABLE_BACKGROUND_JOBS=true  # <- NUEVA
```

---

## 🧪 Probar Después de Corregir

### Esperar a que termine el redeploy
Ver en: https://dashboard.render.com → sv-portfolio-api → Events

### Luego probar:
```bash
# Health check
curl https://sv-portfolio-api.onrender.com/health

# Login
curl -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Svernis1"}'
```

### Probar desde Frontend
1. Ir a: https://sv-portfolio-dashboard.vercel.app/login
2. Usuario: `admin`
3. Password: `Svernis1`
4. Click "Iniciar Sesión"
5. ✅ Debe redirigir a dashboard

---

## 🎯 Prioridades

### Crítico (Hacer ahora):
1. ✅ Remover `/` de ALLOWED_ORIGINS
2. ✅ Agregar ENABLE_BACKGROUND_JOBS=true

### Opcional:
3. ⚠️ Sincronizar JWT_SECRET (solo si desarrollas localmente)

---

## 📊 Estado Actual del Sistema

| Componente | Estado | Acción |
|------------|--------|--------|
| Frontend (Vercel) | ✅ LIVE | Ninguna |
| Database (Neon) | ✅ READY | Ninguna |
| Backend (Render) | ⚠️ CORS issue | Corregir ALLOWED_ORIGINS |
| Background Jobs | ❌ OFF | Agregar ENABLE_BACKGROUND_JOBS |

---

## 🔗 Enlaces Directos

**Dashboard Principal:**
https://dashboard.render.com

**Servicio sv-portfolio-api:**
https://dashboard.render.com/web/YOUR_SERVICE_ID

(Reemplazar YOUR_SERVICE_ID con el ID real que ves en el dashboard)
