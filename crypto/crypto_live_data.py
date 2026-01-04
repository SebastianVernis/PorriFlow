#!/usr/bin/env python3
"""
Script para extraer datos de criptomonedas en vivo usando AlphaVantage
"""

import requests
import json
from datetime import datetime

# API Key de AlphaVantage (desde settings.json)
API_KEY = "CJIOJ9QSU8A2JM7R"
BASE_URL = "https://www.alphavantage.co/query"


def get_crypto_intraday(symbol: str = "BTC", market: str = "USD", interval: str = "5min"):
    """
    Obtiene datos intraday de criptomonedas
    
    Args:
        symbol: Símbolo de la cripto (BTC, ETH, etc.)
        market: Mercado de referencia (USD, EUR, etc.)
        interval: Intervalo de tiempo (1min, 5min, 15min, 30min, 60min)
    """
    params = {
        "function": "CRYPTO_INTRADAY",
        "symbol": symbol,
        "market": market,
        "interval": interval,
        "apikey": API_KEY
    }
    
    print(f"\n🔍 Obteniendo datos intraday de {symbol}/{market} (intervalo: {interval})...")
    response = requests.get(BASE_URL, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if "Time Series Crypto" in data:
            print(f"✅ Datos obtenidos exitosamente")
            return data
        else:
            print(f"⚠️  Error en respuesta: {data}")
            return None
    else:
        print(f"❌ Error HTTP {response.status_code}")
        return None


def get_crypto_daily(symbol: str = "BTC", market: str = "USD"):
    """
    Obtiene datos diarios de criptomonedas
    
    Args:
        symbol: Símbolo de la cripto (BTC, ETH, etc.)
        market: Mercado de referencia (USD, EUR, etc.)
    """
    params = {
        "function": "DIGITAL_CURRENCY_DAILY",
        "symbol": symbol,
        "market": market,
        "apikey": API_KEY
    }
    
    print(f"\n🔍 Obteniendo datos diarios de {symbol}/{market}...")
    response = requests.get(BASE_URL, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if "Time Series (Digital Currency Daily)" in data:
            print(f"✅ Datos obtenidos exitosamente")
            return data
        else:
            print(f"⚠️  Error en respuesta: {data}")
            return None
    else:
        print(f"❌ Error HTTP {response.status_code}")
        return None


def get_crypto_exchange_rate(from_currency: str = "BTC", to_currency: str = "USD"):
    """
    Obtiene el tipo de cambio actual de una criptomoneda
    
    Args:
        from_currency: Moneda origen (BTC, ETH, etc.)
        to_currency: Moneda destino (USD, EUR, etc.)
    """
    params = {
        "function": "CURRENCY_EXCHANGE_RATE",
        "from_currency": from_currency,
        "to_currency": to_currency,
        "apikey": API_KEY
    }
    
    print(f"\n🔍 Obteniendo tipo de cambio {from_currency}/{to_currency}...")
    response = requests.get(BASE_URL, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if "Realtime Currency Exchange Rate" in data:
            print(f"✅ Tipo de cambio obtenido exitosamente")
            return data
        else:
            print(f"⚠️  Error en respuesta: {data}")
            return None
    else:
        print(f"❌ Error HTTP {response.status_code}")
        return None


def display_exchange_rate(data):
    """Muestra el tipo de cambio de forma legible"""
    if not data or "Realtime Currency Exchange Rate" not in data:
        return
    
    rate_data = data["Realtime Currency Exchange Rate"]
    
    print("\n" + "="*60)
    print("💱 TIPO DE CAMBIO EN VIVO")
    print("="*60)
    print(f"De: {rate_data['2. From_Currency Name']} ({rate_data['1. From_Currency Code']})")
    print(f"A: {rate_data['4. To_Currency Name']} ({rate_data['3. To_Currency Code']})")
    print(f"Precio: {float(rate_data['5. Exchange Rate']):.2f}")
    print(f"Última actualización: {rate_data['6. Last Refreshed']}")
    print(f"Zona horaria: {rate_data['7. Time Zone']}")
    print("="*60)


def display_intraday_summary(data, limit: int = 5):
    """Muestra un resumen de los datos intraday"""
    if not data or "Time Series Crypto" not in data:
        return
    
    meta = data.get("Meta Data", {})
    time_series = data["Time Series Crypto"]
    
    print("\n" + "="*60)
    print("📊 DATOS INTRADAY")
    print("="*60)
    print(f"Símbolo: {meta.get('2. Digital Currency Code', 'N/A')}")
    print(f"Mercado: {meta.get('3. Digital Currency Name', 'N/A')}")
    print(f"Intervalo: {meta.get('5. Interval', 'N/A')}")
    print(f"Última actualización: {meta.get('6. Last Refreshed', 'N/A')}")
    print("\n📈 Últimos precios:")
    print("-" * 60)
    
    for i, (timestamp, values) in enumerate(list(time_series.items())[:limit]):
        print(f"\n⏰ {timestamp}")
        print(f"   Apertura: ${float(values['1. open']):.2f}")
        print(f"   Máximo:   ${float(values['2. high']):.2f}")
        print(f"   Mínimo:   ${float(values['3. low']):.2f}")
        print(f"   Cierre:   ${float(values['4. close']):.2f}")
        print(f"   Volumen:  {float(values['5. volume']):.2f}")
    
    print("="*60)


def save_to_json(data, filename: str):
    """Guarda los datos en un archivo JSON"""
    if data:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"\n💾 Datos guardados en: {filename}")


def main():
    """Función principal"""
    print("="*60)
    print("🚀 EXTRACTOR DE DATOS DE CRIPTOMONEDAS - ALPHAVANTAGE")
    print("="*60)
    
    # 1. Obtener tipo de cambio en vivo
    print("\n1️⃣  TIPO DE CAMBIO EN VIVO")
    btc_rate = get_crypto_exchange_rate("BTC", "USD")
    display_exchange_rate(btc_rate)
    if btc_rate:
        save_to_json(btc_rate, "btc_exchange_rate.json")
    
    eth_rate = get_crypto_exchange_rate("ETH", "USD")
    display_exchange_rate(eth_rate)
    if eth_rate:
        save_to_json(eth_rate, "eth_exchange_rate.json")
    
    # 2. Obtener datos intraday
    print("\n\n2️⃣  DATOS INTRADAY")
    btc_intraday = get_crypto_intraday("BTC", "USD", "5min")
    display_intraday_summary(btc_intraday, limit=5)
    if btc_intraday:
        save_to_json(btc_intraday, "btc_intraday_5min.json")
    
    # 3. Obtener datos diarios
    print("\n\n3️⃣  DATOS DIARIOS")
    btc_daily = get_crypto_daily("BTC", "USD")
    if btc_daily:
        print("✅ Datos diarios obtenidos (guardados en archivo)")
        save_to_json(btc_daily, "btc_daily.json")
    
    print("\n\n✨ Proceso completado!")
    print("\n📁 Archivos generados:")
    print("   - btc_exchange_rate.json")
    print("   - eth_exchange_rate.json")
    print("   - btc_intraday_5min.json")
    print("   - btc_daily.json")
    print("\n" + "="*60)


if __name__ == "__main__":
    main()
