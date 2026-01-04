# ⚡ Deploy Rápido desde CLI

## 🚀 Tres Comandos

```bash
# 1. Setup
./scripts/setup.sh

# 2. Deploy Frontend (Vercel)
vercel --prod

# 3. Deploy Backend (Render)
./scripts/deploy-render.sh
```

**Tiempo: 10 minutos** | **Costo: $0/mes**

---

## 📋 Prerequisitos

```bash
# Vercel CLI
npm install -g vercel

# Login
vercel login

# Git + GitHub
git remote add origin https://github.com/TU_USUARIO/sv-portfolio.git
git push -u origin main
```

---

## ✅ Verificar

```bash
# Abrir herramienta de verificación
open tests/verify-deploy.html

# O manual
curl https://sv-portfolio-api.onrender.com/health
```

---

**Guía completa**: [`DEPLOY-CLI.md`](DEPLOY-CLI.md)
