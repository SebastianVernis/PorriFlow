#!/bin/bash

# SV Portfolio Dashboard - Interactive Setup & Deploy Script
# Automatiza todo el proceso de configuración y despliegue

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${PURPLE}"
    echo "════════════════════════════════════════════════════════"
    echo "  $1"
    echo "════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

# Main script
clear
print_header "SV Portfolio Dashboard - Setup Interactivo v3.0"

echo ""
echo "Este script te ayudará a:"
echo "  1. Configurar el proyecto"
echo "  2. Generar datos de mercado"
echo "  3. Configurar base de datos"
echo "  4. Configurar APIs"
echo "  5. Preparar para deploy"
echo ""
read -p "¿Continuar? (s/n): " continue_setup

if [[ ! $continue_setup =~ ^[Ss]$ ]]; then
    echo "Cancelado."
    exit 0
fi

# ==========================================
# PASO 1: VERIFICAR DEPENDENCIAS
# ==========================================
print_header "PASO 1: Verificación de Dependencias"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js instalado: $NODE_VERSION"
else
    print_error "Node.js no encontrado"
    echo "Instala desde: https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm instalado: $NPM_VERSION"
else
    print_error "npm no encontrado"
    exit 1
fi

# Check git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    print_success "Git instalado: $GIT_VERSION"
else
    print_warning "Git no encontrado (opcional para deploy)"
fi

echo ""
read -p "¿Continuar con el setup? (s/n): " continue_install
if [[ ! $continue_install =~ ^[Ss]$ ]]; then
    exit 0
fi

# ==========================================
# PASO 2: INSTALAR DEPENDENCIAS
# ==========================================
print_header "PASO 2: Instalación de Dependencias"

cd backend

if [ -d "node_modules" ]; then
    print_info "node_modules ya existe"
    read -p "¿Reinstalar dependencias? (s/n): " reinstall
    if [[ $reinstall =~ ^[Ss]$ ]]; then
        print_step "Eliminando node_modules..."
        rm -rf node_modules package-lock.json
    fi
fi

if [ ! -d "node_modules" ]; then
    print_step "Instalando dependencias..."
    npm install
    print_success "Dependencias instaladas"
fi

cd ..

# ==========================================
# PASO 3: GENERAR DATOS DE MERCADO
# ==========================================
print_header "PASO 3: Datos de Mercado (107 Símbolos)"

echo ""
echo "Generando datos de 6 mercados:"
echo "  • 63 Acciones USA"
echo "  • 12 Criptomonedas"
echo "  • 8 Índices Bursátiles"
echo "  • 11 ETFs"
echo "  • 8 Commodities/Futuros"
echo "  • 5 Pares Forex"
echo ""
read -p "¿Generar datos de mercado? (s/n): " gen_data

if [[ $gen_data =~ ^[Ss]$ ]]; then
    print_step "Generando market-data.json..."
    node backend/scripts/generate-market-data.js
    print_success "107 símbolos generados"
    
    echo ""
    read -p "¿Actualizar precios desde fuentes públicas? (s/n) [Toma ~5-10 min]: " update_prices
    
    if [[ $update_prices =~ ^[Ss]$ ]]; then
        print_step "Actualizando precios (esto tomará varios minutos)..."
        print_info "Fuentes: Yahoo Finance + CoinGecko (sin API keys)"
        node backend/scripts/update-prices.js
        print_success "Precios actualizados"
    fi
fi

# ==========================================
# PASO 4: CONFIGURAR BASE DE DATOS
# ==========================================
print_header "PASO 4: Configuración de Base de Datos"

echo ""
echo "Opciones de base de datos:"
echo "  1. Neon (PostgreSQL Cloud) - GRATIS - Recomendado"
echo "  2. PostgreSQL Local"
echo "  3. Omitir (configurar después)"
echo ""
read -p "Selecciona opción (1-3): " db_option

cd backend

if [ ! -f ".env" ]; then
    print_step "Creando archivo .env..."
    cp .env.example .env
fi

if [ "$db_option" == "1" ]; then
    echo ""
    print_info "Configuración de Neon:"
    echo "1. Abre: https://console.neon.tech"
    echo "2. Crea nuevo proyecto: 'sv-portfolio'"
    echo "3. Copia el 'Connection String'"
    echo ""
    read -p "Pega tu Neon Connection String: " neon_url
    
    if [ -n "$neon_url" ]; then
        # Actualizar .env
        if grep -q "^DATABASE_URL=" .env; then
            sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"$neon_url\"|" .env
        else
            echo "DATABASE_URL=\"$neon_url\"" >> .env
        fi
        print_success "DATABASE_URL configurado"
        
        # Generar JWT secret
        print_step "Generando JWT_SECRET..."
        JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        
        if grep -q "^JWT_SECRET=" .env; then
            sed -i "s|^JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env
        else
            echo "JWT_SECRET=\"$JWT_SECRET\"" >> .env
        fi
        print_success "JWT_SECRET generado"
        
        # Push schema
        echo ""
        read -p "¿Crear tablas en Neon? (s/n): " create_tables
        if [[ $create_tables =~ ^[Ss]$ ]]; then
            print_step "Creando tablas en Neon..."
            npm run db:push
            print_success "Tablas creadas"
            
            # Generate Prisma Client
            print_step "Generando Prisma Client..."
            npm run db:generate
            print_success "Prisma Client generado"
            
            # Seed
            echo ""
            read -p "¿Crear usuarios demo? (s/n): " seed_db
            if [[ $seed_db =~ ^[Ss]$ ]]; then
                print_step "Creando usuarios demo..."
                npm run db:seed
                print_success "Usuarios creados:"
                echo "   • demo@svportfolio.com / demo123456"
                echo "   • admin@svportfolio.com / admin123456"
            fi
        fi
    fi
    
elif [ "$db_option" == "2" ]; then
    echo ""
    read -p "Nombre de la base de datos local (default: svportfolio): " local_db
    local_db=${local_db:-svportfolio}
    
    LOCAL_URL="postgresql://localhost:5432/$local_db"
    
    if grep -q "^DATABASE_URL=" .env; then
        sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"$LOCAL_URL\"|" .env
    else
        echo "DATABASE_URL=\"$LOCAL_URL\"" >> .env
    fi
    
    print_success "DATABASE_URL configurado para PostgreSQL local"
    print_warning "Recuerda: createdb $local_db"
fi

cd ..

# ==========================================
# PASO 5: CONFIGURAR API KEYS
# ==========================================
print_header "PASO 5: Configuración de API Keys"

echo ""
echo "APIs opcionales para funcionalidades avanzadas:"
echo ""
echo "  1. Marketstack (Precios real-time)"
echo "     https://marketstack.com/signup/free"
echo "     Gratis: 100 requests/día"
echo ""
echo "  2. Alpha Vantage (Históricos + News)"
echo "     https://www.alphavantage.co/support/#api-key"
echo "     Gratis: 500 requests/día"
echo ""
echo "  3. Blackbox AI (Análisis con IA)"
echo "     https://www.blackbox.ai/"
echo "     Pago: Según plan"
echo ""
echo "  4. Marketaux (Noticias premium)"
echo "     https://www.marketaux.com/"
echo "     Gratis: 100 requests/día"
echo ""

read -p "¿Configurar API keys ahora? (s/n): " config_apis

if [[ $config_apis =~ ^[Ss]$ ]]; then
    echo ""
    print_step "Configurando APIs..."
    
    read -p "Marketstack API Key (Enter para omitir): " marketstack_key
    read -p "Alpha Vantage API Key (Enter para omitir): " alphavantage_key
    read -p "Blackbox AI API Key (Enter para omitir): " blackbox_key
    read -p "Marketaux API Key (Enter para omitir): " marketaux_key
    
    # Crear archivo de configuración de APIs
    cat > api-keys.txt << EOF
# API Keys - SV Portfolio Dashboard
# Generado: $(date)

Marketstack:    ${marketstack_key:-"No configurado"}
Alpha Vantage:  ${alphavantage_key:-"No configurado"}
Blackbox AI:    ${blackbox_key:-"No configurado"}
Marketaux:      ${marketaux_key:-"No configurado"}

INSTRUCCIONES:
1. Abrir opi-unified.html
2. Click "⚙️ Config" → Settings
3. Pegar las API keys correspondientes
4. Guardar

O editar directamente en el código:
opi-unified.html líneas ~660-662
EOF
    
    print_success "API keys guardadas en: api-keys.txt"
    print_info "Copia las keys cuando uses el dashboard"
fi

# ==========================================
# PASO 6: MODO DE USO
# ==========================================
print_header "PASO 6: Modo de Uso"

echo ""
echo "Selecciona cómo quieres usar el dashboard:"
echo ""
echo "  1. Local Solo (sin backend, datos en navegador)"
echo "  2. Backend Local (con autenticación, DB en Neon)"
echo "  3. Deploy Completo (Render + Vercel)"
echo ""
read -p "Selecciona opción (1-3): " usage_mode

case $usage_mode in
    1)
        print_success "Modo: Local Solo"
        echo ""
        print_info "Para usar:"
        echo "  open public/index.html"
        echo ""
        print_info "Datos se guardan en localStorage del navegador"
        print_info "No requiere backend ni autenticación"
        ;;
    2)
        print_success "Modo: Backend Local"
        echo ""
        print_info "Para iniciar el backend:"
        echo "  cd backend"
        echo "  npm run dev"
        echo ""
        print_info "Luego abrir:"
        echo "  open public/login.html"
        echo ""
        print_info "Credenciales demo:"
        echo "  Usuario: demo"
        echo "  Password: demo123456"
        
        read -p "¿Iniciar backend ahora? (s/n): " start_backend
        if [[ $start_backend =~ ^[Ss]$ ]]; then
            cd backend
            print_step "Iniciando servidor..."
            echo ""
            npm run dev &
            BACKEND_PID=$!
            sleep 3
            
            print_success "Backend corriendo en http://localhost:3000"
            print_info "PID: $BACKEND_PID"
            echo ""
            echo "Para detener: kill $BACKEND_PID"
            echo "O presiona Ctrl+C"
            echo ""
            
            cd ..
            
            # Abrir login
            if command -v xdg-open &> /dev/null; then
                xdg-open public/login.html
            elif command -v open &> /dev/null; then
                open public/login.html
            fi
        fi
        ;;
    3)
        print_success "Modo: Deploy Completo"
        echo ""
        print_info "Sigue la guía completa de deploy:"
        echo "  cat DEPLOY.md"
        echo ""
        print_info "O usa el asistente:"
        echo "  ./deploy.sh"
        echo ""
        print_info "Verificación post-deploy:"
        echo "  open tests/verify-deploy.html"
        ;;
esac

# ==========================================
# PASO 7: RESUMEN FINAL
# ==========================================
echo ""
print_header "Resumen de Configuración"

echo ""
echo "📁 Proyecto: $(pwd)"
echo "📦 Símbolos de mercado: 107 (generados)"
echo "🗄️  Base de datos: $(grep -q "neon.tech" backend/.env 2>/dev/null && echo "Neon (configurado)" || echo "No configurado")"
echo "🔑 API Keys: $([ -f "api-keys.txt" ] && echo "Guardadas en api-keys.txt" || echo "No configuradas")"
echo ""

if [ -d "backend/node_modules" ]; then
    print_success "Backend: Listo"
else
    print_warning "Backend: Instalar dependencias (cd backend && npm install)"
fi

if [ -f "backend/market-data.json" ]; then
    SYMBOL_COUNT=$(jq '.metadata.totalSymbols' backend/market-data.json)
    print_success "Datos de mercado: $SYMBOL_COUNT símbolos disponibles"
else
    print_warning "Datos de mercado: No generados (npm run data:generate)"
fi

if [ -f "backend/.env" ]; then
    if grep -q "neon.tech" backend/.env 2>/dev/null; then
        print_success "Base de datos: Neon configurado"
    else
        print_warning "Base de datos: .env existe pero no configurado"
    fi
else
    print_warning "Base de datos: .env no existe"
fi

# ==========================================
# SIGUIENTE PASOS
# ==========================================
echo ""
print_header "Próximos Pasos"

echo ""
echo "📖 Documentación:"
echo "   • Inicio rápido:    docs/QUICK-START.md"
echo "   • Instalación:      INSTALL.md"
echo "   • Deploy:           DEPLOY.md"
echo "   • Datos mercado:    docs/MARKET-DATA.md"
echo ""

echo "🚀 Comandos útiles:"
echo ""

if [ "$usage_mode" == "1" ]; then
    echo "  # Abrir dashboard"
    echo "  open public/index.html"
    echo ""
    echo "  # Actualizar precios (opcional)"
    echo "  node backend/scripts/update-prices.js"
fi

if [ "$usage_mode" == "2" ]; then
    echo "  # Iniciar backend"
    echo "  cd backend && npm run dev"
    echo ""
    echo "  # Abrir login"
    echo "  open public/login.html"
    echo ""
    echo "  # Ver base de datos"
    echo "  cd backend && npm run db:studio"
fi

if [ "$usage_mode" == "3" ]; then
    echo "  # Preparar deploy"
    echo "  ./deploy.sh"
    echo ""
    echo "  # Verificar deploy"
    echo "  open tests/verify-deploy.html"
fi

echo ""
echo "🧪 Testing:"
echo "  open tests/test-apis.html         # Test API keys"
echo "  open tests/verify-deploy.html     # Verificar deploy"
echo ""

# ==========================================
# GENERAR ARCHIVO DE CONFIGURACIÓN
# ==========================================
echo ""
read -p "¿Generar resumen de configuración? (s/n): " gen_summary

if [[ $gen_summary =~ ^[Ss]$ ]]; then
    cat > CONFIG-SUMMARY.txt << EOF
════════════════════════════════════════════════════════════
  SV Portfolio Dashboard - Configuración
  Generado: $(date)
════════════════════════════════════════════════════════════

📊 DATOS DE MERCADO
   Símbolos totales: 107
   ├─ Acciones:      63
   ├─ Crypto:        12
   ├─ Índices:        8
   ├─ ETFs:          11
   ├─ Futuros:        8
   └─ Forex:          5
   
   Archivos:
   ✓ backend/market-data.json
   ✓ assets/js/market-data.js

🗄️ BASE DE DATOS
   $(grep -q "neon.tech" backend/.env 2>/dev/null && echo "✓ Neon configurado" || echo "✗ No configurado")
   $([ -f "backend/.env" ] && echo "✓ .env existe" || echo "✗ .env no existe")

🔑 API KEYS
   $([ -f "api-keys.txt" ] && echo "✓ Guardadas en api-keys.txt" || echo "✗ No configuradas")

📦 DEPENDENCIAS
   $([ -d "backend/node_modules" ] && echo "✓ Backend instalado" || echo "✗ Backend: npm install")

🚀 MODO DE USO
   $( [ "$usage_mode" == "1" ] && echo "Local Solo (sin backend)" || [ "$usage_mode" == "2" ] && echo "Backend Local" || echo "Deploy Completo")

════════════════════════════════════════════════════════════

📖 SIGUIENTE PASOS:

$( if [ "$usage_mode" == "1" ]; then
    echo "1. Abrir: opi-unified.html"
    echo "2. Usar: AI Portfolio Builder o agregar manual"
    echo "3. Leer: docs/QUICK-START.md"
elif [ "$usage_mode" == "2" ]; then
    echo "1. Iniciar backend: cd backend && npm run dev"
    echo "2. Abrir: login.html"
    echo "3. Login: demo / demo123456"
    echo "4. Explorar dashboard"
else
    echo "1. Leer: DEPLOY.md"
    echo "2. Configurar: Render + Vercel"
    echo "3. Deploy: ./deploy.sh"
    echo "4. Verificar: tests/verify-deploy.html"
fi )

📚 DOCUMENTACIÓN COMPLETA:
   README.md, INSTALL.md, DEPLOY.md
   docs/ (12 archivos)

🆘 SOPORTE:
   • Problemas: docs/FIXES.md
   • Testing: tests/test-apis.html
   • Deploy: docs/DEPLOY-GUIDE.md

════════════════════════════════════════════════════════════
EOF
    
    print_success "Resumen guardado en: CONFIG-SUMMARY.txt"
fi

cd ..

# ==========================================
# FINAL
# ==========================================
echo ""
print_header "✨ Setup Completado"

echo ""
print_success "El proyecto está configurado y listo para usar"
echo ""

if [ "$usage_mode" == "1" ]; then
    echo "🎯 Siguiente paso:"
    echo ""
    echo "   open public/index.html"
    echo ""
elif [ "$usage_mode" == "2" ]; then
    if [ -n "$BACKEND_PID" ]; then
        echo "🎯 Backend corriendo:"
        echo ""
        echo "   http://localhost:3000"
        echo "   PID: $BACKEND_PID"
        echo ""
        echo "   Login page debería abrirse automáticamente"
        echo "   Si no: open public/login.html"
        echo ""
        echo "⚠️  Presiona Ctrl+C para detener el servidor"
        echo ""
        wait $BACKEND_PID
    else
        echo "🎯 Siguiente paso:"
        echo ""
        echo "   cd backend && npm run dev"
        echo "   # Luego: open public/login.html"
        echo ""
    fi
else
    echo "🎯 Siguiente paso:"
    echo ""
    echo "   cat DEPLOY.md"
    echo "   # O: ./deploy.sh"
    echo ""
fi

echo "📖 Ver CONFIG-SUMMARY.txt para resumen completo"
echo ""
print_success "¡Listo para invertir con inteligencia! 📈🚀"
echo ""
