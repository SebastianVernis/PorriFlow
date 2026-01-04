#!/bin/bash

# Render Deploy Script usando render.yaml
# Render se despliega automáticamente desde GitHub

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "${PURPLE}════════════════════════════════════════${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}════════════════════════════════════════${NC}"
}

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${CYAN}ℹ️  $1${NC}"; }
print_step() { echo -e "${BLUE}▶ $1${NC}"; }

clear
print_header "Render Backend Deploy Helper"

echo ""
echo "Render se despliega automáticamente desde GitHub"
echo "usando el archivo backend/render.yaml"
echo ""

# ==========================================
# VERIFICAR GITHUB
# ==========================================
print_step "Verificando repositorio GitHub..."

if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo "❌ No hay repositorio GitHub configurado"
    echo ""
    echo "Debes primero:"
    echo "  1. Crear repo en: https://github.com/new"
    echo "  2. git remote add origin https://github.com/TU_USUARIO/sv-portfolio.git"
    echo "  3. git push -u origin main"
    echo ""
    exit 1
fi

GITHUB_URL=$(git remote get-url origin)
print_success "GitHub: $GITHUB_URL"

# Verificar que el código está pushed
echo ""
print_step "Verificando código en GitHub..."

git fetch origin main 2>/dev/null || true
LOCAL_HASH=$(git rev-parse HEAD)
REMOTE_HASH=$(git rev-parse origin/main 2>/dev/null || echo "")

if [ "$LOCAL_HASH" != "$REMOTE_HASH" ]; then
    echo ""
    echo "⚠️  Hay cambios locales sin push"
    read -p "¿Push a GitHub ahora? (s/n): " do_push
    
    if [[ $do_push =~ ^[Ss]$ ]]; then
        git push origin main
        print_success "Código actualizado en GitHub"
    fi
fi

# ==========================================
# CONFIGURACIÓN NEON
# ==========================================
print_header "Configuración de Neon"

echo ""
echo "Para Render necesitas el Connection String de Neon"
echo ""

NEON_URL=""

if [ -f "backend/.env" ]; then
    NEON_URL=$(grep "^DATABASE_URL=" backend/.env | cut -d'=' -f2- | tr -d '"')
    if [ -n "$NEON_URL" ]; then
        print_success "DATABASE_URL encontrado en .env"
        echo ""
        echo "Connection String:"
        echo "$NEON_URL"
    fi
else
    echo "No hay backend/.env"
    echo ""
    echo "Obtén tu Connection String de:"
    echo "https://console.neon.tech"
    echo ""
    read -p "Pega aquí (o Enter para omitir): " NEON_URL
fi

# ==========================================
# INSTRUCCIONES RENDER
# ==========================================
print_header "Deploy en Render"

echo ""
echo "📋 PASOS PARA RENDER:"
echo ""
echo "1️⃣  Ir a: https://dashboard.render.com"
echo ""
echo "2️⃣  Click: 'New +' → 'Web Service'"
echo ""
echo "3️⃣  Connect: Tu repo GitHub"
print_info "   $GITHUB_URL"
echo ""
echo "4️⃣  Configurar servicio:"
echo ""
echo "   Name:           sv-portfolio-api"
echo "   Region:         Oregon (US West)"
echo "   Branch:         main"
echo "   Root Directory: backend"
echo "   Runtime:        Node"
echo "   Build Command:  npm install && npx prisma generate"
echo "   Start Command:  npm start"
echo "   Plan:           Free"
echo ""
echo "5️⃣  Environment Variables (Add Environment Variable):"
echo ""

if [ -n "$NEON_URL" ]; then
    echo "   DATABASE_URL:"
    echo "   $NEON_URL"
    echo ""
else
    echo "   DATABASE_URL = [TU_NEON_CONNECTION_STRING]"
    echo ""
fi

echo "   JWT_SECRET = [Click 'Generate Value']"
echo ""
echo "   NODE_ENV = production"
echo ""
echo "   ALLOWED_ORIGINS = https://[TU_VERCEL_URL]"

if [ -n "$VERCEL_URL" ]; then
    echo "   (Usa: https://$VERCEL_URL)"
fi

echo ""
echo "   SESSION_EXPIRY = 7d"
echo ""
echo "6️⃣  Click: 'Create Web Service'"
echo ""
echo "7️⃣  Esperar deploy (~3-5 minutos)"
echo ""
echo "8️⃣  Cuando termine, abrir Shell y ejecutar:"
echo "   npm run db:push"
echo "   npm run db:seed"
echo ""
echo "9️⃣  Tu backend estará en:"
echo "   https://sv-portfolio-api.onrender.com"
echo ""

read -p "Presiona Enter para continuar..."

# ==========================================
# VERIFICAR RENDER.YAML
# ==========================================
echo ""
print_step "Verificando configuración de Render..."

if [ -f "backend/render.yaml" ]; then
    print_success "render.yaml existe"
    echo ""
    echo "Contenido de render.yaml:"
    echo "─────────────────────────"
    cat backend/render.yaml
    echo "─────────────────────────"
else
    echo "❌ backend/render.yaml no existe"
    echo "Debería haberse creado automáticamente"
fi

# ==========================================
# RESUMEN
# ==========================================
echo ""
print_header "📊 Resumen de Deploy"

echo ""
echo "✅ Completado:"
echo ""

if [ -n "$VERCEL_URL" ]; then
    echo "  Frontend: https://$VERCEL_URL"
else
    echo "  Frontend: Configurar manualmente (vercel --prod)"
fi

echo "  Backend: Configurar en dashboard.render.com"
echo "  Database: $([ -n "$NEON_URL" ] && echo "Neon configurado ✓" || echo "Pendiente")"
echo ""

echo "📝 Siguiente pasos:"
echo ""
echo "  1. Configurar backend en Render (usar instrucciones arriba)"
echo "  2. Actualizar CORS en Render con tu URL de Vercel"
echo "  3. Verificar deploy: open tests/verify-deploy.html"
echo "  4. Probar login en producción"
echo ""

if [ -f "deploy-urls.txt" ]; then
    echo "📁 URLs guardadas en: deploy-urls.txt"
fi

echo ""
print_success "¡Deploy preparado!"
echo ""
