# 🚨 ACCIÓN REQUERIDA: Rotar Credenciales Expuestas

## ⚠️ Credenciales Comprometidas

Las siguientes credenciales fueron expuestas en esta conversación y **DEBEN ser rotadas inmediatamente**:

1. **DATABASE_URL** (Connection String de Neon)
2. **Neon API Key** (napi_aqlrcr362yqlh9desuozyzjyh520atshjh8m0kjp6fl2vqf5s3ip7l5bi253yy60)

---

## 🔄 Pasos para Rotar Credenciales

### 1. Rotar Database Password (Neon)

#### A. En Neon Console
1. Ve a https://console.neon.tech
2. Selecciona tu proyecto "neondb"
3. Ve a **Settings** → **General**
4. Click en **Reset Password**
5. Copia la **nueva Connection String**

#### B. Actualizar en tu Sistema

**Local (.env):**
```bash
cd backend
nano .env  # o tu editor preferido

# Reemplazar la línea DATABASE_URL con la nueva
DATABASE_URL="postgresql://neondb_owner:NUEVA_PASSWORD@ep-shy-wind-ah6eilaz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

**Render (Producción):**
1. Ve a https://dashboard.render.com
2. Selecciona tu servicio "sv-portfolio-api"
3. Ve a **Environment** tab
4. Edita la variable `DATABASE_URL`
5. Pega la nueva connection string
6. Click **Save Changes**
7. Render redesplegará automáticamente

---

### 2. Rotar Neon API Key

#### A. Generar Nueva API Key
1. En Neon Console: https://console.neon.tech
2. Ve a **Account Settings** (esquina superior derecha)
3. Click en **API Keys**
4. Click **Revoke** en la key comprometida
5. Click **Generate New API Key**
6. Copia la nueva key

#### B. ¿Dónde se usa la API Key?

**Nota importante:** La Neon API Key es **opcional** y solo se usa para:
- Operaciones administrativas (crear/eliminar databases)
- Gestión de branches
- Métricas avanzadas

**Tu aplicación NO la necesita** - solo usa `DATABASE_URL` para conectarse.

Si no estás usando la API Key en tu código, simplemente **revócala** y listo.

---

## ✅ Verificar que Todo Funciona

Después de rotar las credenciales:

### 1. Test Local
```bash
cd backend

# Verificar conexión con nueva password
node -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.\$connect();
    console.log('✅ Conexión exitosa con nueva password');
    await prisma.\$disconnect();
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();
"
```

### 2. Test Producción
```bash
# Esperar ~2 minutos después de actualizar en Render
curl https://sv-portfolio-api.onrender.com/health

# Debe retornar: {"status":"ok","version":"3.0",...}
```

### 3. Test Login Completo
```bash
# Test desde frontend
# 1. Ve a http://localhost:8080/login.html
# 2. Login con demo/demo123456
# 3. Debe funcionar normalmente
```

---

## 🔐 Mejores Prácticas para el Futuro

### 1. Nunca Compartir Credenciales
- ❌ No pegar DATABASE_URL en chat, issues, o código público
- ❌ No compartir API Keys con nadie
- ✅ Usar placeholders en documentación: `DATABASE_URL="postgresql://user:***@host/db"`

### 2. Usar Variables de Entorno
```bash
# ✅ Bueno
DATABASE_URL="..." npm start

# ❌ Malo (hardcodear en código)
const dbUrl = "postgresql://user:pass@host/db";
```

### 3. Archivo .env en .gitignore
```bash
# Verificar que .env NO esté en git
cd backend
cat .gitignore | grep .env

# Debe aparecer: .env
```

### 4. Rotar Credenciales Periódicamente
- Cada 3-6 meses como mínimo
- Inmediatamente si sospechas exposición
- Después de que un empleado/colaborador deje el proyecto

---

## 📋 Checklist de Seguridad

Marca cuando completes cada paso:

- [ ] Rotar password de Neon (nueva DATABASE_URL)
- [ ] Actualizar DATABASE_URL en backend/.env local
- [ ] Actualizar DATABASE_URL en Render Environment
- [ ] Verificar conexión local funciona
- [ ] Verificar API en producción funciona
- [ ] Revocar Neon API Key comprometida (opcional)
- [ ] Generar nueva Neon API Key si la usas (opcional)
- [ ] Verificar que .env está en .gitignore
- [ ] Hacer commit y push de cambios (sin .env)

---

## 🆘 Si Algo Sale Mal

### Backend no conecta después de rotar
1. Verifica que copiaste la connection string completa (incluye `?sslmode=require`)
2. Verifica que usas la URL con `-pooler` (no la directa)
3. Reinicia el servidor: `pkill -f "node.*server.js" && npm start`

### Render no actualiza
1. Ve a Render Dashboard → Logs
2. Busca errores de conexión
3. Verifica que guardaste los cambios en Environment
4. Trigger manual deploy si es necesario

### Base de datos no responde
1. Ve a Neon Console → Dashboard
2. Verifica que el proyecto esté activo (no suspended)
3. Chequea Connection Pooling esté habilitado

---

## 📞 Soporte

- Neon Docs: https://neon.tech/docs/manage/users
- Render Docs: https://render.com/docs/environment-variables
- Prisma Connection Issues: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management

---

**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 10-15 minutos  
**Impacto:** Alto - datos expuestos públicamente  
**Acción:** Rotar credenciales AHORA
