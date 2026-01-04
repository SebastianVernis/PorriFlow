# 📊 Scripts de Datos de Mercado

## 🎯 Scripts Disponibles

### 1. generate-market-data.js

**Propósito**: Generar archivo base con 107 símbolos

```bash
node scripts/generate-market-data.js
# o
npm run data:generate
```

**Genera**:
- `backend/market-data.json` (18 KB)
- `assets/js/market-data.js` (17 KB)

**Contenido**:
- 63 acciones USA (múltiples sectores)
- 12 criptomonedas top
- 8 índices bursátiles
- 11 ETFs populares
- 8 commodities/futuros
- 5 pares forex

**Cuándo usar**:
- Primera vez
- Agregar/remover símbolos
- Resetear datos a valores conocidos

---

### 2. update-prices.js

**Propósito**: Actualizar precios desde fuentes públicas

```bash
node scripts/update-prices.js
# o
npm run data:update
```

**Fuentes**:
- CoinGecko API (crypto) - Free, sin key
- Yahoo Finance API (resto) - Free, sin key

**Proceso**:
1. Lee market-data.json existente
2. Itera por cada símbolo
3. Obtiene precio actualizado
4. Actualiza JSON y JS
5. Respeta rate limits

**Tiempo**: ~5-10 minutos (107 símbolos)

**Cuándo usar**:
- Diariamente (recomendado)
- Antes de análisis importante
- Cuando necesites precios frescos

---

## ⚙️ Configuración

### Rate Limits

```javascript
// En update-prices.js

// CoinGecko: ~30 req/min
await new Promise(r => setTimeout(r, 2100)); // 2.1 seg

// Yahoo Finance: ~120 req/min  
await new Promise(r => setTimeout(r, 500)); // 0.5 seg
```

### Fuentes de Datos

```javascript
// CoinGecko API (pública)
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd

// Yahoo Finance API v8 (pública)
https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=1d
```

---

## 📊 Datos Generados

### market-data.json

```json
{
  "metadata": {
    "generated": "2026-01-04T21:51:46.740Z",
    "source": "Multiple public sources",
    "totalSymbols": 107,
    "categories": {
      "stocks": 63,
      "indices": 8,
      "crypto": 12,
      "etfs": 11,
      "futures": 8,
      "forex": 5
    },
    "lastPriceUpdate": "2026-01-04T22:15:30.000Z",
    "updatedSymbols": 95
  },
  "data": {
    "AAPL": { /* datos */ },
    // ... 106 más
  }
}
```

### market-data.js

```javascript
// Auto-generated - Listo para importar en frontend
export const MARKET_DATA = { /* todos los símbolos */ };
export const METADATA = { /* info de generación */ };
```

---

## 🔄 Workflows Recomendados

### Desarrollo

```bash
# Una vez al inicio
npm run data:generate

# Actualizar cuando necesites precios frescos
npm run data:update
```

### Producción

```bash
# Setup inicial
npm run data:full

# Cron diario (6 PM)
0 18 * * * cd /path/to/backend && npm run data:update

# O GitHub Actions (auto)
# Ver: .github/workflows/update-data.yml (crear)
```

### Pre-Deploy

```bash
# Asegurar datos frescos antes de deploy
npm run data:update
git add backend/market-data.json assets/js/market-data.js
git commit -m "Update market data"
git push
```

---

## 🧪 Testing

### Verificar Generación

```bash
# Generar datos
npm run data:generate

# Verificar archivos
ls -lh backend/market-data.json
ls -lh assets/js/market-data.js

# Ver contenido
cat backend/market-data.json | jq '.metadata'
# Debe mostrar 107 símbolos
```

### Verificar Actualización

```bash
# Actualizar
npm run data:update

# Ver cambios
git diff backend/market-data.json
# Debe mostrar precios actualizados
```

### Test en Dashboard

```javascript
// En consola del navegador (public/index.html)
import('./assets/js/market-data.js').then(m => {
    console.log('Símbolos:', Object.keys(m.MARKET_DATA).length);
    console.log('Metadata:', m.METADATA);
    console.log('Primer símbolo:', Object.entries(m.MARKET_DATA)[0]);
});
```

---

## 🐛 Troubleshooting

### "Cannot find module"

```bash
# Asegurar estar en directorio correcto
cd backend
node scripts/generate-market-data.js
```

### "Rate limit exceeded" (CoinGecko)

```bash
# Esperar 1 minuto y reintentar
# O aumentar delay en update-prices.js:
await new Promise(r => setTimeout(r, 3000)); // 3 seg
```

### "Failed to fetch" (Yahoo)

```bash
# Verificar internet
# Verificar símbolo existe
# Yahoo a veces bloquea IPs - usar VPN o esperar
```

### "Precios no actualizan"

```bash
# Regenerar archivos completamente
npm run data:full

# Verificar cambios
git status
# Debe mostrar market-data.json y market-data.js modificados
```

---

## 📈 Agregar Nuevos Símbolos

### Paso 1: Editar generate-market-data.js

```javascript
// Buscar sección apropiada (stocks, crypto, etc)
stocks: {
    'NUEVO': {
        name: 'Nombre Completo',
        sector: 'Sector',
        beta: 1.0,
        yield: 0.0,
        dgr: 0.0,
        price: 100.00
    }
}
```

### Paso 2: Regenerar

```bash
npm run data:generate
```

### Paso 3: Actualizar Precio

```bash
npm run data:update
```

### Paso 4: Verificar

```bash
grep "NUEVO" backend/market-data.json
# Debe aparecer con datos
```

---

## 🎯 Best Practices

### Frecuencia de Actualización

```
Crypto:     Cada 1-6 horas (volátil)
Acciones:   Diario (después del cierre)
Índices:    Diario
ETFs:       Diario
Futuros:    Cada 4-6 horas
Forex:      Cada 1-4 horas
```

### Backup de Datos

```bash
# Antes de actualizar
cp backend/market-data.json backend/market-data.backup.json

# Restaurar si algo falla
mv backend/market-data.backup.json backend/market-data.json
```

### Versionamiento

```bash
# Commit después de cada actualización
git add backend/market-data.json assets/js/market-data.js
git commit -m "Update market data $(date +%Y-%m-%d)"
git push

# Mantiene histórico de precios en Git
```

---

## 📊 Output Ejemplo

```bash
$ npm run data:update

> update-prices
> node scripts/update-prices.js

🔄 Actualizador de Precios
==========================================

📊 Actualizando 107 símbolos...

  ✓ AAPL         $   185.92 (Yahoo)
  ✓ MSFT         $   376.04 (Yahoo)
  ✓ NVDA         $   495.22 (Yahoo)
  ✓ BTC-USD      $ 44328.50 (CoinGecko)
  ✓ ETH-USD      $  2328.75 (CoinGecko)
  ✓ ^GSPC        $  4783.45 (Yahoo)
  ✓ GLD          $   189.67 (Yahoo)
  ⚠ CUSTOM       Sin datos (usando cache)
  
  ... (103 más)

📊 Resultados:
   ✅ Actualizados: 95
   ⚠️  Sin datos: 12
   📈 Tasa éxito: 88.8%

✅ Actualización completa
   JSON: /path/to/backend/market-data.json
   JS: /path/to/assets/js/market-data.js
```

---

**🎯 107 símbolos listos para usar**  
**🔄 Actualizable con un comando**  
**💰 Sin costo de APIs**  
**✅ Producción ready**
