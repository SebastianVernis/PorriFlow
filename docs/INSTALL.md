# 📦 Instalación Completa - SV Portfolio Dashboard v3.0

## 🎯 Dos Modos de Uso

### Modo 1: Solo Frontend (Sin Auth) ⚡
**Más rápido, perfecto para uso personal**

```bash
1. Abrir public/index.html
2. Datos en localStorage (local)
3. No requiere backend ni DB
4. ✅ Listo en 1 minuto
```

**Usar si**:
- Solo tú usarás el dashboard
- No necesitas multi-dispositivo
- Quieres comenzar inmediatamente

---

### Modo 2: Backend + DB (Con Auth) 🔐
**Completo, multi-usuario, persistente**

```bash
1. Setup backend (Node.js + Neon)
2. Login con usuario/password
3. Datos en base de datos
4. ⏱️ Setup: 15-20 minutos
```

**Usar si**:
- Múltiples usuarios
- Acceso desde varios dispositivos
- Backup automático en cloud
- Datos persistentes y seguros

---

## ⚡ Instalación Modo 1 (Solo Frontend)

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para APIs)

### Pasos

```bash
# 1. Obtener APIs (5 min)
Marketstack: https://marketstack.com/signup/free
Alpha Vantage: https://www.alphavantage.co/support/#api-key

# 2. Configurar (1 min)
Abrir: tests/test-apis.html
Probar: Pegar keys y click "Test"

# 3. Usar (YA!)
Abrir: public/index.html
Click: "AI Portfolio" o "Simular"
```

**¡Listo!** No requiere instalación de nada más.

---

## 🔐 Instalación Modo 2 (Backend + DB)

### Requisitos
- Node.js 18+ (https://nodejs.org/)
- npm (incluido con Node.js)
- Cuenta Neon (https://neon.tech) - GRATIS

### Paso 1: Clonar/Descargar Proyecto

```bash
# Ya tienes el proyecto en:
cd /home/sebastianvernis/inversion
```

### Paso 2: Setup Base de Datos (Neon)

```bash
# 1. Ir a https://neon.tech
# 2. Crear cuenta (gratis)
# 3. Crear proyecto: "sv-portfolio"
# 4. Copiar connection string:

postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/svportfolio?sslmode=require
```

### Paso 3: Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env (nano, vim, o editor)
nano .env
```

**Configurar en .env**:
```bash
# Pegar tu Neon connection string
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/svportfolio?sslmode=require"

# Generar JWT secret
JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"

# Resto puede quedar por defecto
PORT=3000
NODE_ENV=development
```

### Paso 4: Inicializar Base de Datos

```bash
# Push schema a Neon
npm run db:push

# Generar Prisma client
npm run db:generate

# Crear usuarios demo
npm run db:seed
```

**Resultado**:
```
✅ Tablas creadas en Neon
✅ Usuario demo: demo / demo123456
✅ Usuario admin: admin / admin123456
```

### Paso 5: Iniciar Backend

```bash
# Modo desarrollo (auto-reload)
npm run dev

# O modo producción
npm start
```

**Servidor corriendo**: `http://localhost:3000`

### Paso 6: Usar Frontend

```bash
# Desde el directorio raíz del proyecto
cd ..

# Abrir login
xdg-open public/login.html   # Linux
open public/login.html        # Mac
start public/login.html       # Windows
```

**Login con**:
- Usuario: `demo`
- Password: `demo123456`

**¡Listo!** Dashboard conectado a base de datos.

---

## 🔄 Instalación en Equipo (Multiple Devs)

### Backend (Un solo deployment)

```bash
# Developer 1 hace el setup
cd backend
npm install
# Configurar Neon
npm run db:push
npm run db:seed
npm run dev  # O deploy a Render/Railway

# URL del API: http://your-server.com
```

### Frontend (Cada usuario)

```bash
# Cada desarrollador:
1. Abrir public/login.html
2. Click "Configurar API Endpoint"
3. Ingresar: http://your-server.com
4. Registrarse o usar cuenta demo
5. Usar dashboard normalmente
```

---

## 🌐 Deploy a Producción

### Backend (Railway/Render)

```bash
# 1. Push a GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Conectar a Railway/Render
# 3. Configurar variables de entorno:
DATABASE_URL=postgresql://neon_url
JWT_SECRET=your_secret
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com

# 4. Deploy automático
# 5. Ejecutar seed (opcional)
npm run db:seed
```

### Frontend (Vercel/Netlify)

```bash
# 1. Push HTML files a GitHub
# 2. Conectar a Vercel/Netlify
# 3. Deploy
# 4. Configurar en public/login.html:
#    API URL = https://your-backend.railway.app
```

---

## 🧪 Verificación Post-Instalación

### Backend

```bash
# Test 1: Health check
curl http://localhost:3000/health
# Debe retornar: {"status":"ok"...}

# Test 2: Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123456"}'
# Debe retornar: {"token":"...","user":{...}}

# Test 3: Prisma Studio
npm run db:studio
# Debe abrir http://localhost:5555
# Ver tabla users con 2 usuarios
```

### Frontend

```bash
# Test 1: Abrir login
# Debe mostrar formulario sin errores

# Test 2: Login con demo
# Debe redirigir a public/index.html

# Test 3: Dashboard carga
# Debe mostrar 2 portafolios (demo tiene 2)

# Test 4: Ver consola (F12)
# No debe haber errores rojos
```

---

## 📊 Estructura Final

```
/inversion/
│
├── public/login.html              🔐 Página de login
├── public/index.html        📊 Dashboard principal
├── README.md               📖 Inicio
├── INSTALL.md              📦 Este archivo
│
├── backend/                🖥️ API Server
│   ├── package.json
│   ├── .env (crear)
│   ├── .env.example
│   ├── README.md
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── server.js
│       ├── seed.js
│       ├── middleware/
│       │   └── auth.js
│       └── routes/
│           ├── auth.js
│           ├── portfolios.js
│           └── settings.js
│
├── assets/
│   ├── css/
│   └── js/
│       └── auth.js         🔑 Módulo autenticación
│
├── docs/                   📚 Documentación (10 archivos)
├── tests/                  🧪 Testing
└── crypto/                 💰 Scripts Python
```

---

## 🎯 Instalación por Perfil

### Principiante
```
Recomendación: Modo 1 (Solo Frontend)

Razón:
✅ Sin instalación de software
✅ Funciona inmediatamente
✅ Suficiente para uso personal

Pasos:
1. Abrir public/index.html
2. Usar AI Portfolio Builder
3. ¡Listo!
```

### Intermedio
```
Recomendación: Modo 2 (Backend + DB)

Razón:
✅ Aprende sobre APIs y databases
✅ Datos persistentes
✅ Multi-dispositivo

Pasos:
1. Seguir "Modo 2" arriba
2. 15-20 min de setup
3. Sistema completo funcionando
```

### Avanzado
```
Recomendación: Modo 2 + Deploy

Pasos:
1. Setup local completo
2. Deploy backend a Railway
3. Deploy frontend a Vercel
4. Custom domain (opcional)
5. SSL automático
```

---

## 🔑 Credenciales Demo

### Para Testing Rápido

```
Usuario Demo:
  Username: demo
  Password: demo123456
  Email: demo@svportfolio.com

Usuario Admin:
  Username: admin
  Password: admin123456
  Email: admin@svportfolio.com
```

**⚠️ Cambiar passwords en producción**

---

## 📝 Checklist de Instalación

### Modo 1 (Solo Frontend)
```
[ ] Obtener Marketstack API key
[ ] Obtener Alpha Vantage API key
[ ] Probar en tests/test-apis.html
[ ] Abrir public/index.html
[ ] Crear primer portafolio
```

### Modo 2 (Backend + DB)
```
[ ] Instalar Node.js
[ ] Crear cuenta Neon
[ ] Crear proyecto en Neon
[ ] Copiar connection string
[ ] cd backend && npm install
[ ] Crear .env con DATABASE_URL
[ ] Generar JWT_SECRET
[ ] npm run db:push
[ ] npm run db:generate
[ ] npm run db:seed
[ ] npm run dev
[ ] Verificar http://localhost:3000/health
[ ] Abrir public/login.html
[ ] Login con demo/demo123456
[ ] Dashboard carga desde DB
```

---

## 🆘 Soporte

### Problemas de Instalación

**Node.js no instalado**:
```bash
# Verificar
node --version
npm --version

# Si no está instalado: https://nodejs.org/
```

**npm install falla**:
```bash
# Limpiar y reintentar
rm -rf node_modules package-lock.json
npm install
```

**Database connection falla**:
```bash
# Verificar Neon está activo
# Verificar DATABASE_URL correcto
# Test: npx prisma db push
```

**Puerto 3000 en uso**:
```bash
# Cambiar PORT en .env
PORT=3001

# O matar proceso en puerto 3000
lsof -ti:3000 | xargs kill
```

---

## 🎉 Próximos Pasos Post-Instalación

### Después de Modo 1
```
1. Leer: docs/QUICK-START.md
2. Usar: AI Portfolio Builder
3. Explorar: Cada tab
4. (Opcional) Migrar a Modo 2 más tarde
```

### Después de Modo 2
```
1. Crear: Tu propio usuario (no demo)
2. Migrar: Datos de localStorage (si tienes)
3. Explorar: Prisma Studio
4. Leer: docs/AUTH-SYSTEM.md (detalles técnicos)
5. (Opcional) Deploy a producción
```

---

**Tiempo estimado de instalación**:
- Modo 1: 5-10 minutos
- Modo 2: 15-30 minutos

**Dificultad**:
- Modo 1: ⭐ Muy fácil
- Modo 2: ⭐⭐⭐ Intermedio

**Próximo**: `docs/QUICK-START.md` para usar el dashboard
