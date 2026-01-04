# 🐙 Setup de GitHub - SV Portfolio Dashboard

## 🎯 Preparar Repositorio para GitHub

### Paso 1: Inicializar Git

```bash
cd /home/sebastianvernis/inversion

# Verificar si ya está inicializado
if [ -d .git ]; then
    echo "Git ya inicializado"
else
    git init
    echo "✅ Git inicializado"
fi

# Configurar Git (si es primera vez)
git config user.name "Tu Nombre"
git config user.email "tu@email.com"
```

---

### Paso 2: Crear .gitignore (Ya existe)

Verifica que `.gitignore` incluya:

```bash
cat .gitignore

# Debe incluir:
node_modules/
.env
.env.local
*.log
.DS_Store
.crush/
backend/market-data.json      # Regenerable
assets/js/market-data.js      # Regenerable
CONFIG-SUMMARY.txt            # Generado por setup
```

---

### Paso 3: Generar Archivos Necesarios

```bash
# Generar market-data para incluir estructura
cd backend
npm install  # Si no está instalado
npm run data:generate

cd ..

# Verificar archivos generados
ls -lh backend/market-data.json
ls -lh assets/js/market-data.js
```

---

### Paso 4: Crear README para GitHub

El README.md en la raíz está optimizado para GitHub y incluye:
- ✅ Badges de tecnologías
- ✅ Descripción concisa
- ✅ Quick start
- ✅ Features destacadas
- ✅ Estructura del proyecto
- ✅ Links a documentación

---

### Paso 5: Agregar Archivos a Git

```bash
# Ver status
git status

# Agregar todo (excepto .gitignore)
git add .

# Verificar qué se agregará
git status

# Deberías ver:
# ✅ public/
# ✅ backend/ (sin node_modules, sin .env)
# ✅ assets/
# ✅ docs/
# ✅ tests/
# ✅ scripts/
# ✅ README.md, LICENSE, etc
# ❌ node_modules/ (ignorado)
# ❌ .env (ignorado)
```

---

### Paso 6: Primer Commit

```bash
git commit -m "Initial commit: SV Portfolio Dashboard v3.0

- Dashboard unificado con AI y analytics
- Sistema de autenticación multi-usuario
- 107 símbolos de 6 mercados
- Backend API con Prisma + Neon
- Deploy gratuito (Render + Vercel)
- Documentación completa"
```

---

### Paso 7: Crear Repositorio en GitHub

```
1. Ir a: https://github.com/new

2. Configurar:
   ┌─────────────────────────────────────────┐
   │ Repository name: sv-portfolio           │
   │ Description: Professional investment    │
   │              dashboard with AI          │
   │ Visibility: Public o Private            │
   │ ✓ Add .gitignore: No (ya tienes)       │
   │ ✓ Add README: No (ya tienes)           │
   │ ✓ Choose license: No (ya tienes MIT)   │
   └─────────────────────────────────────────┘

3. Click: "Create repository"
```

---

### Paso 8: Conectar y Subir

```bash
# Agregar remote
git remote add origin https://github.com/TU_USUARIO/sv-portfolio.git

# O si usas SSH:
git remote add origin git@github.com:TU_USUARIO/sv-portfolio.git

# Verificar
git remote -v

# Subir
git branch -M main
git push -u origin main
```

---

### Paso 9: Verificar en GitHub

```
1. Ir a: https://github.com/TU_USUARIO/sv-portfolio

2. Verificar que aparezcan:
   ✅ README.md renderizado con badges
   ✅ Estructura de carpetas visible
   ✅ LICENSE visible
   ✅ .gitignore funcionando (no aparece node_modules/)
   ✅ Último commit visible

3. Probar enlaces del README:
   ✅ Links a docs/ funcionan
   ✅ Badges se muestran correctamente
```

---

## 🎨 Personalizar README de GitHub

### Agregar Badges Personalizados

```markdown
<!-- Agregar al README.md -->

[![Stars](https://img.shields.io/github/stars/TU_USUARIO/sv-portfolio)](https://github.com/TU_USUARIO/sv-portfolio)
[![Forks](https://img.shields.io/github/forks/TU_USUARIO/sv-portfolio)](https://github.com/TU_USUARIO/sv-portfolio)
[![Issues](https://img.shields.io/github/issues/TU_USUARIO/sv-portfolio)](https://github.com/TU_USUARIO/sv-portfolio/issues)
[![Last Commit](https://img.shields.io/github/last-commit/TU_USUARIO/sv-portfolio)](https://github.com/TU_USUARIO/sv-portfolio)
```

### Agregar Screenshots

```bash
# 1. Tomar screenshots del dashboard
# 2. Crear carpeta
mkdir -p .github/screenshots

# 3. Agregar imágenes
# dashboard.png, login.png, analytics.png

# 4. Referenciar en README.md
```

```markdown
## 📸 Screenshots

![Dashboard](/.github/screenshots/dashboard.png)
![Analytics](/.github/screenshots/analytics.png)
```

---

## 🔧 Configurar GitHub Actions (Opcional)

### Auto-Update Market Data

```bash
# Crear archivo
mkdir -p .github/workflows
cat > .github/workflows/update-market-data.yml << 'YAML'
name: Update Market Data

on:
  schedule:
    - cron: '0 18 * * *'  # Diario a las 6 PM UTC
  workflow_dispatch:       # Manual trigger

jobs:
  update-data:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Update market data
        run: |
          cd backend
          npm run data:update
      
      - name: Commit changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add backend/market-data.json assets/js/market-data.js
          git diff --quiet && git diff --staged --quiet || git commit -m "Update market data [automated]"
          git push
YAML

# Commit
git add .github/
git commit -m "Add GitHub Actions for auto-update"
git push
```

---

## 🏷️ Releases y Versiones

### Crear Primera Release

```bash
# 1. Tag la versión
git tag -a v3.0.0 -m "SV Portfolio Dashboard v3.0 Unified

Features:
- 107 símbolos de 6 mercados
- Autenticación multi-usuario
- AI analysis completo
- Deploy gratuito
- Documentación exhaustiva"

# 2. Subir tag
git push origin v3.0.0

# 3. En GitHub:
# Ir a: Releases → Create a new release
# Tag: v3.0.0
# Title: v3.0 - Unified Dashboard with Auth
# Description: (copiar del tag)
# Publish release
```

---

## 📊 Configurar GitHub Pages (Opcional)

Para documentación pública:

```
1. GitHub repo → Settings
2. Pages → Source: Deploy from a branch
3. Branch: main
4. Folder: /docs
5. Save

Tu docs estarán en:
https://TU_USUARIO.github.io/sv-portfolio/
```

---

## 🔐 Secrets para GitHub Actions

Si usas GitHub Actions para deploy:

```
1. Repo → Settings → Secrets and variables → Actions
2. New repository secret

Agregar:
- DATABASE_URL (Neon connection)
- JWT_SECRET (random 32 bytes)
- RENDER_API_KEY (opcional, para auto-deploy)
```

---

## 📋 Checklist Pre-Push

```bash
# Antes de subir a GitHub, verificar:

[ ] .gitignore existe y está correcto
[ ] README.md es claro y completo
[ ] LICENSE existe (MIT)
[ ] No hay API keys en el código
[ ] No hay .env en staging
[ ] backend/.env.example existe
[ ] Documentación actualizada
[ ] Scripts son ejecutables (chmod +x)
[ ] Estructura de carpetas correcta
[ ] package.json tiene scripts necesarios
[ ] Versiones en package.json son correctas
```

---

## 🎯 Después de Subir a GitHub

### 1. Configurar Repository Settings

```
Settings → General:
├─ Description: "Professional investment dashboard..."
├─ Website: https://sv-portfolio.vercel.app
├─ Topics: portfolio, investment, dashboard, ai, nodejs, prisma
└─ Features:
    ✓ Issues
    ✓ Projects (opcional)
    ✗ Wiki (docs/ es mejor)
```

### 2. Proteger Branch Main

```
Settings → Branches:
├─ Add rule for main
├─ ✓ Require pull request reviews
├─ ✓ Require status checks to pass
└─ Save
```

### 3. Configurar GitHub Projects (Opcional)

```
Projects → New project
├─ Board para roadmap
├─ Issues para bugs
└─ Milestones para versiones
```

---

## 📝 Template de Issue

Crear `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Reportar un bug
title: '[BUG] '
labels: bug
---

**Descripción**
Descripción clara del bug.

**Pasos para Reproducir**
1. Ir a '...'
2. Click en '...'
3. Ver error

**Comportamiento Esperado**
Qué debería pasar.

**Screenshots**
Si aplica, agregar screenshots.

**Entorno**
- OS: [ej. Windows 10]
- Browser: [ej. Chrome 120]
- Versión: [ej. v3.0]
```

---

## 🤝 Template de Pull Request

Crear `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Descripción
Describe los cambios realizados.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] Código sigue el estilo del proyecto
- [ ] He actualizado la documentación
- [ ] He probado los cambios
- [ ] No hay warnings en consola
- [ ] Funciona en producción

## Screenshots (si aplica)
```

---

## 🎉 Repo Listo para GitHub

### Comandos Finales

```bash
# Verificar todo está commiteado
git status

# Si hay cambios:
git add .
git commit -m "Preparar para GitHub"
git push

# Ver en GitHub
# https://github.com/TU_USUARIO/sv-portfolio
```

### URLs Finales

```
GitHub Repo:    https://github.com/TU_USUARIO/sv-portfolio
GitHub Pages:   https://TU_USUARIO.github.io/sv-portfolio (si configurado)
Vercel Deploy:  https://sv-portfolio.vercel.app (después de deploy)
Render Deploy:  https://sv-portfolio-api.onrender.com (después de deploy)
```

---

## 📊 Estructura Final en GitHub

```
https://github.com/TU_USUARIO/sv-portfolio/

sv-portfolio/
├── public/          (Frontend visible)
├── backend/         (API code visible)
├── assets/          (JS modules)
├── docs/            (Docs navegables)
├── tests/           (Testing tools)
├── scripts/         (Automation)
├── crypto/          (Optional Python)
├── README.md        (Landing page de GitHub)
├── LICENSE          (MIT)
├── STRUCTURE.md     (Esta estructura)
└── vercel.json      (Deploy config)
```

---

**✅ Listo para `git push`**

**Siguiente**: Configurar Render + Vercel (ver `docs/DEPLOY-GUIDE.md`)
