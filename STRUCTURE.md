# 📁 Estructura del Proyecto - SV Portfolio Dashboard

## 🎯 Organización Optimizada para GitHub

```
sv-portfolio/
│
├── 📱 PUBLIC/ (Frontend - Servido por Vercel)
│   ├── index.html              Dashboard principal (opi-unified)
│   ├── login.html              Sistema de login/registro
│   ├── legacy-v2.8.html        Versión anterior (AI focus)
│   └── legacy-v3.0.html        Versión anterior (Analytics focus)
│
├── 🖥️ BACKEND/ (API Server - Desplegado en Render)
│   ├── src/
│   │   ├── server.js           Express API server
│   │   ├── seed.js             Seed de usuarios demo
│   │   ├── data-fetcher.js     Fetcher de datos públicos
│   │   ├── middleware/
│   │   │   └── auth.js         JWT authentication
│   │   └── routes/
│   │       ├── auth.js         Login/Register endpoints
│   │       ├── portfolios.js   Portfolio CRUD
│   │       └── settings.js     User settings
│   │
│   ├── scripts/
│   │   ├── generate-market-data.js  Generador 107 símbolos
│   │   ├── update-prices.js         Actualizar desde APIs públicas
│   │   └── README.md                Documentación scripts
│   │
│   ├── prisma/
│   │   └── schema.prisma       Database schema (6 tablas)
│   │
│   ├── package.json            Dependencies + scripts
│   ├── render.yaml             Render deployment config
│   ├── .env.example            Environment template
│   ├── .gitignore              Backend gitignore
│   ├── market-data.json        107 símbolos generados (18 KB)
│   └── README.md               Backend documentation
│
├── 🎨 ASSETS/ (Static resources)
│   ├── css/                    Estilos (preparado para futuro)
│   └── js/
│       ├── auth.js             Módulo de autenticación frontend
│       └── market-data.js      107 símbolos (ES6 module, 17 KB)
│
├── 📚 DOCS/ (Documentación - 12 archivos, 210 KB)
│   ├── START.md                ⚡ Inicio en 3 pasos
│   ├── QUICK-START.md          🎯 Guía rápida 5 min
│   ├── INSTALL.md              📦 Instalación completa
│   ├── DEPLOY-GUIDE.md         🚀 Deploy paso a paso
│   ├── AUTH-SYSTEM.md          🔐 Sistema de autenticación
│   ├── MARKET-DATA.md          📊 107 símbolos
│   ├── PROJECT-COMPLETE.md     📋 Resumen ejecutivo
│   ├── V3-FEATURES.md          ✨ Todas las features
│   ├── VERSION-COMPARISON.md   🔍 Comparación versiones
│   ├── UNIFICATION-COMPLETE.md ✅ Estado unificación
│   ├── UNIFIED-GUIDE.md        🔧 Guía técnica
│   ├── CHANGELOG.md            📅 Historia de cambios
│   ├── FIXES.md                🐛 Troubleshooting
│   └── README.md               📖 Índice de docs
│
├── 🧪 TESTS/ (Testing tools - 3 archivos)
│   ├── test-apis.html          Verificar API keys
│   ├── verify-deploy.html      Verificar deployment
│   └── enhanced-additions.js   Código de referencia
│
├── 🤖 SCRIPTS/ (Automation - 2 archivos)
│   ├── setup.sh                Setup interactivo completo
│   └── deploy.sh               Deploy a GitHub
│
├── 💰 CRYPTO/ (Scripts Python opcionales - 9 archivos)
│   ├── CRYPTO_README.md
│   ├── crypto_live_data_optimized.py
│   ├── crypto_dashboard.py
│   └── ... (scripts + JSON data)
│
├── 📄 ROOT FILES
│   ├── README.md               Inicio principal del proyecto
│   ├── LICENSE                 MIT License
│   ├── .gitignore              Git ignore global
│   ├── vercel.json             Vercel deployment config
│   └── STRUCTURE.md            Este archivo
│
└── 🔧 GENERATED (por scripts, no incluir en repo)
    ├── backend/market-data.json
    ├── assets/js/market-data.js
    └── CONFIG-SUMMARY.txt
```

---

## 📊 Tamaños

```
Frontend (public/):          331 KB
Backend (backend/):          ~100 KB (sin node_modules)
Assets:                       25 KB
Docs:                        210 KB
Tests:                        31 KB
Scripts:                      20 KB
Crypto:                       76 KB
───────────────────────────────────
Total (sin node_modules):    ~800 KB
Total (con node_modules):    ~50 MB
```

---

## 🗂️ Rutas Importantes

### URLs del Dashboard

```
/                    → public/login.html (landing)
/login               → public/login.html
/dashboard           → public/index.html
/legacy/v2.8         → public/legacy-v2.8.html
/legacy/v3.0         → public/legacy-v3.0.html
```

### API Endpoints

```
/api/auth/login      → Backend login
/api/auth/register   → Backend register
/api/portfolios      → Portfolio CRUD
/api/settings        → User settings
/health              → Health check
```

### Assets

```
/assets/js/auth.js         → Módulo autenticación
/assets/js/market-data.js  → 107 símbolos
```

---

## 🔧 Archivos de Configuración

### Para Deploy

```
vercel.json           Vercel (frontend)
backend/render.yaml   Render (backend)
backend/.env.example  Environment template
.gitignore            Git ignore global
```

### Para Development

```
backend/.env          Variables locales (no en repo)
backend/package.json  Dependencies del backend
scripts/setup.sh      Setup interactivo
scripts/deploy.sh     Deploy automatizado
```

---

## 📝 Qué Incluir en GitHub

### ✅ Incluir (Commit)

```
✅ public/
✅ backend/src/
✅ backend/prisma/
✅ backend/scripts/
✅ backend/package.json
✅ backend/render.yaml
✅ backend/.env.example
✅ backend/README.md
✅ assets/
✅ docs/
✅ tests/
✅ scripts/
✅ crypto/ (opcional)
✅ README.md
✅ LICENSE
✅ vercel.json
✅ .gitignore
✅ STRUCTURE.md
```

### ❌ NO Incluir (ya en .gitignore)

```
❌ backend/node_modules/
❌ backend/.env
❌ backend/market-data.json (regenerable)
❌ assets/js/market-data.js (regenerable)
❌ CONFIG-SUMMARY.txt (generado por setup)
❌ .crush/
❌ *.log
❌ .DS_Store
❌ .env.local
```

---

## 🔄 Flujo de Archivos

### Setup Inicial

```
Usuario ejecuta:
  ./scripts/setup.sh
      ↓
Genera:
  backend/.env (local)
  backend/market-data.json
  assets/js/market-data.js
  CONFIG-SUMMARY.txt
      ↓
Instala:
  backend/node_modules/
      ↓
Inicia:
  Backend en localhost:3000
  Frontend en browser
```

### Deploy a Producción

```
Usuario ejecuta:
  ./scripts/deploy.sh
      ↓
Push a GitHub:
  main branch
      ↓
Auto-deploy:
  Render → backend
  Vercel → frontend
      ↓
Live URLs:
  https://sv-portfolio.vercel.app
  https://sv-portfolio-api.onrender.com
```

---

## 🎯 Estructura por Funcionalidad

### Autenticación

```
Frontend:
├─ public/login.html
└─ assets/js/auth.js

Backend:
├─ src/routes/auth.js
├─ src/middleware/auth.js
└─ prisma/schema.prisma (User model)

Docs:
└─ docs/AUTH-SYSTEM.md
```

### Portfolio Management

```
Frontend:
└─ public/index.html (todo el código)

Backend:
├─ src/routes/portfolios.js
└─ prisma/schema.prisma (Portfolio, Position models)

Docs:
└─ docs/V3-FEATURES.md
```

### Market Data

```
Data:
├─ backend/market-data.json (generado)
└─ assets/js/market-data.js (generado)

Scripts:
├─ backend/scripts/generate-market-data.js
└─ backend/scripts/update-prices.js

Docs:
└─ docs/MARKET-DATA.md
```

### Deploy

```
Config:
├─ vercel.json (frontend)
├─ backend/render.yaml (backend)
└─ .gitignore

Scripts:
├─ scripts/setup.sh
└─ scripts/deploy.sh

Docs:
├─ docs/DEPLOY-GUIDE.md
└─ DEPLOY.md
```

---

## 📦 Para Clonar y Usar

```bash
# Clonar repo
git clone https://github.com/TU_USUARIO/sv-portfolio.git
cd sv-portfolio

# Setup automático
./scripts/setup.sh

# O manual
cd backend
npm install
npm run data:generate
npm run dev

# Usar
open public/login.html
```

---

## 🔧 Comandos Post-Clone

```bash
# Backend setup
cd backend
npm install                # Dependencias
npm run data:generate      # 107 símbolos
npm run db:push            # Crear tablas (Neon)
npm run db:seed            # Usuarios demo

# Actualizar precios
npm run data:update        # ~5-10 min

# Desarrollo
npm run dev                # Servidor local

# Producción
npm start                  # Servidor producción
```

---

## 🎨 Customización

### Agregar Símbolos

```
1. Editar: backend/scripts/generate-market-data.js
2. Agregar símbolo en sección apropiada
3. Ejecutar: npm run data:generate
4. Listo en: assets/js/market-data.js
```

### Cambiar Estilos

```
1. Editar: public/index.html (sección <style>)
2. O crear: assets/css/custom.css
3. Importar en HTML
```

### Agregar API Endpoints

```
1. Crear: backend/src/routes/nueva-ruta.js
2. Agregar en: backend/src/server.js
3. Documentar en: backend/README.md
```

---

## 📊 Archivos Generados (No en Repo)

Estos archivos se generan automáticamente:

```
backend/node_modules/       → npm install
backend/.env                → Setup o manual
backend/market-data.json    → npm run data:generate
assets/js/market-data.js    → npm run data:generate
CONFIG-SUMMARY.txt          → ./scripts/setup.sh
```

Se regeneran en cada instalación, **no commitear**.

---

## 🎯 Resumen de Rutas

### Para Usuario Final

```
Inicio:          public/login.html o public/index.html
Dashboard:       public/index.html
Legacy v2.8:     public/legacy-v2.8.html
Legacy v3.0:     public/legacy-v3.0.html
```

### Para Desarrollador

```
Setup:           ./scripts/setup.sh
Deploy:          ./scripts/deploy.sh
Gen Data:        npm run data:generate (en backend/)
Update Prices:   npm run data:update (en backend/)
Test APIs:       tests/test-apis.html
Verify Deploy:   tests/verify-deploy.html
DB Studio:       npm run db:studio (en backend/)
```

### Para Documentación

```
Start:           docs/START.md
Quick Start:     docs/QUICK-START.md
Install:         docs/INSTALL.md
Deploy:          docs/DEPLOY-GUIDE.md
Auth:            docs/AUTH-SYSTEM.md
Market Data:     docs/MARKET-DATA.md
All Docs:        docs/
```

---

**Estructura optimizada para:**
- ✅ Deploy en Vercel (public/)
- ✅ Deploy en Render (backend/)
- ✅ Development local
- ✅ Navegación clara
- ✅ Mantenimiento fácil
- ✅ GitHub best practices
