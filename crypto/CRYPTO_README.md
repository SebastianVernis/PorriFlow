# 🚀 Extractor de Datos de Criptomonedas - AlphaVantage

Sistema completo para extraer y visualizar datos de criptomonedas en tiempo real usando la API de AlphaVantage.

## 📋 Contenido

- **crypto_live_data.py**: Script básico para extraer datos de cripto
- **crypto_live_data_optimized.py**: Script optimizado con manejo de límite de tasa
- **crypto_dashboard.py**: Dashboard para visualizar los datos extraídos

## 🔑 Configuración

La API Key de AlphaVantage ya está configurada en los scripts:
```
API_KEY = "CJIOJ9QSU8A2JM7R"
```

## 📊 Funcionalidades

### 1. Extracción de Datos en Vivo

El script `crypto_live_data_optimized.py` extrae:

- ✅ **Tipo de cambio en tiempo real** (Exchange Rate)
- ✅ **Precios Bid y Ask**
- ✅ **Datos intraday** (intervalos de 5min, 15min, 30min, 60min)
- ✅ **Datos diarios históricos**

### 2. Criptomonedas Soportadas

Por defecto, el script consulta:

- 🟠 **Bitcoin (BTC)**
- 🔵 **Ethereum (ETH)**
- 🟢 **Tether (USDT)**
- 🟡 **Binance Coin (BNB)**

## 🚀 Uso

### Paso 1: Extraer Datos

```bash
python3 crypto_live_data_optimized.py
```

**Salida esperada:**
```
======================================================================
🚀 EXTRACTOR DE DATOS DE CRIPTOMONEDAS EN VIVO - ALPHAVANTAGE
======================================================================
⏰ Fecha y hora: 2026-01-04 05:20:17
======================================================================

📋 Criptomonedas a consultar:
   • Bitcoin (BTC)
   • Ethereum (ETH)
   • Tether (USDT)
   • Binance Coin (BNB)

======================================================================
1️⃣  TIPOS DE CAMBIO EN VIVO (USD)
======================================================================
🔍 Obteniendo tipo de cambio BTC/USD...
✅ Tipo de cambio obtenido

======================================================================
💱 Bitcoin - TIPO DE CAMBIO EN VIVO
======================================================================
📊 Precio:        $91,320.01
📈 Precio Bid:    $91,317.30
📉 Precio Ask:    $91,321.81
⏰ Actualizado:   2026-01-04 11:20:09 UTC
======================================================================
```

**Archivos generados:**
- `btc_exchange_rate.json`
- `eth_exchange_rate.json`
- `usdt_exchange_rate.json`
- `btc_intraday_5min.json` (si hay cuota disponible)

### Paso 2: Visualizar Dashboard

```bash
python3 crypto_dashboard.py
```

**Salida esperada:**
```
======================================================================
🚀 DASHBOARD DE CRIPTOMONEDAS EN VIVO
======================================================================

┌────────────────────────────────────────────────────────────────────┐
│ BTC        Bitcoin                                                │
├────────────────────────────────────────────────────────────────────┤
│ 💰 Precio:                    $91,320.01                    │
│ 📈 Bid (Compra):              $91,317.30                    │
│ 📉 Ask (Venta):               $91,321.81                    │
│ 🎯 Precio Medio:              $91,319.56                    │
├────────────────────────────────────────────────────────────────────┤
│ 📊 Spread:                         $4.51 (0.0049%)      │
│ 📈 Tendencia:       🟢 Muy Estrecho                           │
└────────────────────────────────────────────────────────────────────┘
```

## 📊 Estructura de Datos

### Exchange Rate JSON

```json
{
  "Realtime Currency Exchange Rate": {
    "1. From_Currency Code": "BTC",
    "2. From_Currency Name": "Bitcoin",
    "3. To_Currency Code": "USD",
    "4. To_Currency Name": "United States Dollar",
    "5. Exchange Rate": "91320.01000000",
    "6. Last Refreshed": "2026-01-04 11:20:09",
    "7. Time Zone": "UTC",
    "8. Bid Price": "91317.30000000",
    "9. Ask Price": "91321.81000000"
  }
}
```

### Intraday Data JSON

```json
{
  "Meta Data": {
    "1. Information": "Crypto Intraday (5min) Time Series",
    "2. Digital Currency Code": "BTC",
    "3. Digital Currency Name": "Bitcoin",
    "4. Market Code": "USD",
    "5. Interval": "5min",
    "6. Last Refreshed": "2026-01-04 11:20:00"
  },
  "Time Series Crypto": {
    "2026-01-04 11:20:00": {
      "1. open": "91320.00",
      "2. high": "91350.00",
      "3. low": "91300.00",
      "4. close": "91320.01",
      "5. volume": "123.45"
    }
  }
}
```

## ⚙️ Personalización

### Agregar más criptomonedas

Edita `crypto_live_data_optimized.py`:

```python
cryptos = [
    {"symbol": "BTC", "name": "Bitcoin"},
    {"symbol": "ETH", "name": "Ethereum"},
    {"symbol": "USDT", "name": "Tether"},
    {"symbol": "BNB", "name": "Binance Coin"},
    {"symbol": "ADA", "name": "Cardano"},  # Agregar nueva
    {"symbol": "SOL", "name": "Solana"},   # Agregar nueva
]
```

### Cambiar intervalo de datos intraday

```python
# Opciones: "1min", "5min", "15min", "30min", "60min"
btc_intraday = client.get_crypto_intraday("BTC", "USD", "15min")
```

### Cambiar mercado de referencia

```python
# Cambiar de USD a EUR
btc_rate = client.get_exchange_rate("BTC", "EUR")
```

## 🔄 Límites de la API

**API Gratuita de AlphaVantage:**
- ⏱️ **1 request por segundo**
- 📊 **25 requests por día**
- 🔄 El script respeta automáticamente estos límites

**Solución implementada:**
```python
REQUEST_DELAY = 1.2  # segundos entre requests
```

## 📈 Indicadores del Dashboard

### Tendencia del Spread

- 🟢 **Muy Estrecho**: < 0.01% (mercado líquido)
- 🟡 **Normal**: 0.01% - 0.05%
- 🔴 **Amplio**: > 0.05% (baja liquidez)

### Métricas Mostradas

- **Precio**: Tipo de cambio actual
- **Bid**: Precio de compra
- **Ask**: Precio de venta
- **Precio Medio**: (Bid + Ask) / 2
- **Spread**: Diferencia entre Ask y Bid
- **Spread %**: Porcentaje del spread respecto al Bid

## 🛠️ Requisitos

```bash
pip install requests
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Monitoreo Rápido

```bash
# Extraer datos y visualizar en un solo comando
python3 crypto_live_data_optimized.py && python3 crypto_dashboard.py
```

### Ejemplo 2: Monitoreo Continuo

```bash
# Crear un script de monitoreo continuo
while true; do
    python3 crypto_live_data_optimized.py
    python3 crypto_dashboard.py
    sleep 300  # Esperar 5 minutos
done
```

### Ejemplo 3: Exportar a CSV

```python
import json
import csv

# Leer JSON
with open('btc_exchange_rate.json', 'r') as f:
    data = json.load(f)

# Exportar a CSV
rate_data = data['Realtime Currency Exchange Rate']
with open('btc_data.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['Symbol', 'Price', 'Bid', 'Ask', 'Timestamp'])
    writer.writerow([
        rate_data['1. From_Currency Code'],
        rate_data['5. Exchange Rate'],
        rate_data['8. Bid Price'],
        rate_data['9. Ask Price'],
        rate_data['6. Last Refreshed']
    ])
```

## 🔍 Troubleshooting

### Error: "Límite de API alcanzado"

**Causa**: Has excedido el límite de 25 requests por día o 1 request por segundo.

**Solución**:
1. Espera 24 horas para que se reinicie el límite diario
2. Aumenta el `REQUEST_DELAY` en el script
3. Considera actualizar a un plan premium de AlphaVantage

### Error: "No hay datos disponibles"

**Causa**: No se han extraído datos todavía.

**Solución**:
```bash
python3 crypto_live_data_optimized.py
```

### Error: "Connection timeout"

**Causa**: Problemas de conexión a internet o API caída.

**Solución**:
1. Verifica tu conexión a internet
2. Intenta nuevamente en unos minutos
3. Verifica el estado de AlphaVantage: https://www.alphavantage.co/

## 📚 Recursos Adicionales

- **Documentación AlphaVantage**: https://www.alphavantage.co/documentation/
- **API Key**: https://www.alphavantage.co/support/#api-key
- **Planes Premium**: https://www.alphavantage.co/premium/

## 🎯 Próximas Mejoras

- [ ] Agregar gráficos con matplotlib
- [ ] Implementar alertas de precio
- [ ] Crear API REST local
- [ ] Agregar análisis técnico (RSI, MACD, etc.)
- [ ] Implementar base de datos para histórico
- [ ] Crear dashboard web con Flask/FastAPI

## 📄 Licencia

Este proyecto es parte de Bet-Copilot y sigue la misma licencia del proyecto principal.

---

**Última actualización**: 2026-01-04
**Versión**: 1.0.0
