#!/bin/bash

# SV Portfolio Dashboard - Deploy Script
# Facilita el deployment a Render + Vercel

set -e

echo "🚀 SV Portfolio Dashboard - Deploy Helper"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Inicializando Git..."
    git init
    git branch -M main
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "📝 Detectados cambios sin commit"
    echo ""
    read -p "Mensaje de commit: " commit_msg
    
    if [ -z "$commit_msg" ]; then
        commit_msg="Deploy $(date +%Y-%m-%d\ %H:%M)"
    fi
    
    git add .
    git commit -m "$commit_msg"
    echo "✅ Cambios commiteados"
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo "⚠️  No hay remote configurado"
    echo "Por favor, crea un repo en GitHub y ejecuta:"
    echo "git remote add origin https://github.com/TU_USUARIO/sv-portfolio.git"
    echo ""
    read -p "Presiona Enter cuando esté listo..."
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Código subido a GitHub"
echo ""
echo "📋 Siguiente pasos:"
echo ""
echo "BACKEND (Render):"
echo "1. Ir a: https://dashboard.render.com/create?type=web"
echo "2. Conectar tu repo GitHub"
echo "3. Root Directory: backend"
echo "4. Build Command: npm install && npx prisma generate"
echo "5. Start Command: npm start"
echo "6. Add Environment Variables:"
echo "   - DATABASE_URL (de Neon)"
echo "   - JWT_SECRET (click Generate)"
echo "   - NODE_ENV=production"
echo "7. Deploy!"
echo ""
echo "FRONTEND (Vercel):"
echo "1. Ir a: https://vercel.com/new"
echo "2. Import tu repo GitHub"
echo "3. Deploy! (configuración automática)"
echo ""
echo "📖 Guía completa: DEPLOY.md"
echo ""
