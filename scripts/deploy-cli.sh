#!/bin/bash

# SV Portfolio Dashboard - CLI Deploy Script
# Deploy completo desde terminal usando Vercel CLI y Git

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "${PURPLE}"
    echo "════════════════════════════════════════════════════════"
    echo "  $1"
    echo "════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${CYAN}ℹ️  $1${NC}"; }
print_step() { echo -e "${BLUE}▶ $1${NC}"; }

clear
print_header "SV Portfolio - Deploy desde CLI"

echo ""
echo "Este script desplegará:"
echo "  • Frontend → Vercel (usando vercel CLI)"
echo "  • Backend → Render (usando Git + render.yaml)"
echo ""
read -p "¿Continuar? (s/n): " continue_deploy

if [[ ! $continue_deploy =~ ^[Ss]$ ]]; then
    echo "Cancelado."
    exit 0
fi

# ==========================================
# VERIFICAR DEPENDENCIAS
# ==========================================
print_header "Verificando Dependencias"

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI no instalado"
    echo ""
    echo "Instalar con:"
    echo "  npm install -g vercel"
    echo ""
    read -p "¿Instalar ahora? (s/n): " install_vercel
    
    if [[ $install_vercel =~ ^[Ss]$ ]]; then
        print_step "Instalando Vercel CLI..."
        npm install -g vercel
        print_success "Vercel CLI instalado"
    else
        exit 1
    fi
else
    print_success "Vercel CLI: $(vercel --version)"
fi

# Check Git
if ! command -v git &> /dev/null; then
    print_error "Git no instalado"
    echo "Instala desde: https://git-scm.com/"
    exit 1
else
    print_success "Git: $(git --version | head -1)"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no instalado"
    exit 1
else
    print_success "Node.js: $(node -v)"
fi

# ==========================================
# PREPARAR DATOS
# ==========================================
print_header "Preparando Datos de Mercado"

cd backend

if [ ! -f "market-data.json" ]; then
    print_step "Generando 107 símbolos de mercado..."
    npm run data:generate
    print_success "Datos generados"
else
    print_info "Datos de mercado ya existen"
    read -p "¿Actualizar precios desde fuentes públicas? (s/n): " update_prices
    
    if [[ $update_prices =~ ^[Ss]$ ]]; then
        print_step "Actualizando precios (esto tomará ~5-10 min)..."
        npm run data:update
        print_success "Precios actualizados"
    fi
fi

cd ..

# ==========================================
# CONFIGURAR NEON DATABASE
# ==========================================
print_header "Configuración de Base de Datos (Neon)"

echo ""
echo "Para el deploy necesitas una base de datos Neon:"
echo ""
print_info "Si ya tienes Neon configurado, omite este paso"
echo ""
read -p "¿Configurar Neon ahora? (s/n): " config_neon

NEON_URL=""

if [[ $config_neon =~ ^[Ss]$ ]]; then
    echo ""
    echo "1. Abre: https://console.neon.tech"
    echo "2. Crea proyecto: 'sv-portfolio'"
    echo "3. Copia el Connection String"
    echo ""
    read -p "Pega tu Neon Connection String: " NEON_URL
    
    if [ -n "$NEON_URL" ]; then
        print_success "Connection string guardado"
    fi
else
    if [ -f "backend/.env" ]; then
        NEON_URL=$(grep "^DATABASE_URL=" backend/.env | cut -d'=' -f2- | tr -d '"')
        if [ -n "$NEON_URL" ]; then
            print_info "Usando DATABASE_URL de backend/.env"
        fi
    fi
fi

# ==========================================
# PREPARAR GIT
# ==========================================
print_header "Preparando Git Repository"

if [ ! -d .git ]; then
    print_step "Inicializando Git..."
    git init
    git branch -M main
    print_success "Git inicializado"
else
    print_success "Git ya inicializado"
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    print_step "Commiteando cambios..."
    git add .
    git commit -m "Deploy v3.0: Ready for production

- 107 market symbols
- Multi-user authentication  
- Complete documentation
- Optimized structure"
    print_success "Cambios commiteados"
else
    print_info "No hay cambios para commitear"
fi

# Check for GitHub remote
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    print_warning "No hay repositorio remoto configurado"
    echo ""
    echo "Opciones:"
    echo "  1. Crear nuevo repo en GitHub"
    echo "  2. Usar repo existente"
    echo "  3. Omitir (solo deploy a Vercel)"
    echo ""
    read -p "Selecciona (1-3): " git_option
    
    if [ "$git_option" == "1" ]; then
        echo ""
        echo "Crea el repo en: https://github.com/new"
        echo "Nombre sugerido: sv-portfolio"
        echo ""
        read -p "Cuando esté creado, pega la URL (https://github.com/...): " repo_url
        
        if [ -n "$repo_url" ]; then
            git remote add origin "$repo_url"
            print_success "Remote agregado: $repo_url"
            
            print_step "Pushing a GitHub..."
            git push -u origin main
            print_success "Código subido a GitHub"
        fi
    elif [ "$git_option" == "2" ]; then
        read -p "URL del repo: " repo_url
        git remote add origin "$repo_url"
        git push -u origin main
        print_success "Código subido"
    fi
fi

# ==========================================
# DEPLOY FRONTEND (VERCEL)
# ==========================================
print_header "Deploy Frontend a Vercel"

echo ""
print_info "Vercel CLI desplegará el frontend"
echo ""
read -p "¿Deploy a Vercel ahora? (s/n): " deploy_vercel

VERCEL_URL=""

if [[ $deploy_vercel =~ ^[Ss]$ ]]; then
    print_step "Desplegando a Vercel..."
    echo ""
    
    # Deploy con Vercel CLI
    # --yes = skip confirmations
    # --prod = deploy to production
    vercel --prod --yes
    
    echo ""
    print_success "Frontend desplegado a Vercel"
    
    # Obtener URL
    VERCEL_URL=$(vercel ls 2>/dev/null | grep "Production" | awk '{print $2}' | head -1)
    
    if [ -n "$VERCEL_URL" ]; then
        echo ""
        print_success "Frontend URL: $VERCEL_URL"
        echo ""
        
        # Guardar URL
        echo "$VERCEL_URL" > .vercel-url.txt
    fi
fi

# ==========================================
# CONFIGURAR BACKEND PARA RENDER
# ==========================================
print_header "Preparando Backend para Render"

if [ ! -d "backend/node_modules" ]; then
    print_step "Instalando dependencias del backend..."
    cd backend
    npm install
    cd ..
    print_success "Dependencias instaladas"
fi

echo ""
echo "Para deploy en Render necesitas:"
echo "  1. Connection String de Neon"
echo "  2. Cuenta en Render.com"
echo ""

if [ -z "$NEON_URL" ]; then
    print_warning "DATABASE_URL no configurado"
    read -p "¿Configurar ahora? (s/n): " config_now
    
    if [[ $config_now =~ ^[Ss]$ ]]; then
        echo ""
        echo "Abre: https://console.neon.tech"
        echo "Copia el Connection String"
        echo ""
        read -p "Pega aquí: " NEON_URL
    fi
fi

# ==========================================
# INSTRUCCIONES RENDER
# ==========================================
print_header "Deploy Backend a Render"

echo ""
print_info "Render se despliega desde GitHub"
echo ""
echo "📋 Pasos para Render:"
echo ""
echo "1. Asegúrate de tener el código en GitHub"
echo ""

if git remote get-url origin > /dev/null 2>&1; then
    GITHUB_URL=$(git remote get-url origin)
    print_success "Tu repo: $GITHUB_URL"
else
    print_warning "Sube primero a GitHub"
fi

echo ""
echo "2. Ir a: https://dashboard.render.com/create?type=web"
echo ""
echo "3. Conectar tu repositorio GitHub"
echo ""
echo "4. Configurar:"
echo "   Name: sv-portfolio-api"
echo "   Region: Oregon (US West)"
echo "   Branch: main"
echo "   Root Directory: backend"
echo "   Runtime: Node"
echo "   Build Command: npm install && npx prisma generate"
echo "   Start Command: npm start"
echo "   Plan: Free"
echo ""
echo "5. Environment Variables:"

if [ -n "$NEON_URL" ]; then
    echo "   DATABASE_URL = $NEON_URL"
else
    echo "   DATABASE_URL = [TU_NEON_CONNECTION_STRING]"
fi

echo "   JWT_SECRET = [Click Generate]"
echo "   NODE_ENV = production"

if [ -n "$VERCEL_URL" ]; then
    echo "   ALLOWED_ORIGINS = https://$VERCEL_URL"
else
    echo "   ALLOWED_ORIGINS = [TU_VERCEL_URL]"
fi

echo ""
echo "6. Click 'Create Web Service'"
echo ""
echo "7. Después del deploy, en Render Shell ejecutar:"
echo "   npm run db:push"
echo "   npm run db:seed"
echo ""

read -p "Presiona Enter cuando Render esté desplegado..."

# ==========================================
# ACTUALIZAR CORS
# ==========================================
if [ -n "$VERCEL_URL" ]; then
    print_header "Configurar CORS"
    
    echo ""
    print_info "Después de desplegar en Render:"
    echo ""
    echo "1. Render Dashboard → Tu servicio"
    echo "2. Environment → ALLOWED_ORIGINS"
    echo "3. Editar → Valor: https://$VERCEL_URL"
    echo "4. Save (auto-redeploy)"
    echo ""
fi

# ==========================================
# VERIFICACIÓN
# ==========================================
print_header "Verificación de Deploy"

echo ""
print_info "URLs de verificación:"
echo ""

if [ -n "$VERCEL_URL" ]; then
    echo "Frontend: https://$VERCEL_URL"
    echo "          https://$VERCEL_URL/login"
    echo "          https://$VERCEL_URL/dashboard"
fi

echo ""
echo "Backend:  [Tu URL de Render]"
echo "          https://sv-portfolio-api.onrender.com/health"
echo ""

read -p "¿Abrir herramienta de verificación? (s/n): " open_verify

if [[ $open_verify =~ ^[Ss]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open tests/verify-deploy.html
    elif command -v open &> /dev/null; then
        open tests/verify-deploy.html
    else
        print_info "Abre manualmente: tests/verify-deploy.html"
    fi
fi

# ==========================================
# RESUMEN FINAL
# ==========================================
print_header "✨ Deploy Completado"

echo ""
print_success "Frontend desplegado en Vercel"
print_info "Backend requiere configuración manual en Render"
echo ""

if [ -n "$VERCEL_URL" ]; then
    echo "🌐 Frontend: https://$VERCEL_URL"
fi

echo ""
echo "📋 Siguiente pasos:"
echo ""
echo "1. Configurar backend en Render (si no lo hiciste)"
echo "   https://dashboard.render.com"
echo ""
echo "2. Verificar deploy:"
echo "   open tests/verify-deploy.html"
echo ""
echo "3. Probar login:"

if [ -n "$VERCEL_URL" ]; then
    echo "   https://$VERCEL_URL/login"
fi

echo "   Usuario: demo"
echo "   Password: demo123456"
echo ""
echo "4. Ver documentación completa:"
echo "   cat docs/DEPLOY-GUIDE.md"
echo ""

print_success "Deploy iniciado exitosamente!"
echo ""

# Guardar URLs
if [ -n "$VERCEL_URL" ]; then
    cat > deploy-urls.txt << EOF
SV Portfolio Dashboard - Deployment URLs
Generado: $(date)

Frontend (Vercel):
  URL: https://$VERCEL_URL
  Login: https://$VERCEL_URL/login
  Dashboard: https://$VERCEL_URL/dashboard

Backend (Render):
  URL: [Configurar en https://dashboard.render.com]
  Health: https://[TU_URL].onrender.com/health
  API: https://[TU_URL].onrender.com/api

Database (Neon):
  Console: https://console.neon.tech
  $([ -n "$NEON_URL" ] && echo "Connection: Configurado ✓" || echo "Connection: Pendiente")

Usuarios Demo:
  demo@svportfolio.com / demo123456
  admin@svportfolio.com / admin123456

Verificación:
  open tests/verify-deploy.html
EOF
    
    print_success "URLs guardadas en: deploy-urls.txt"
fi
