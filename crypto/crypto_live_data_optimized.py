#!/usr/bin/env python3
"""
Script optimizado para extraer datos de criptomonedas en vivo usando AlphaVantage
Respeta el límite de tasa de 1 request por segundo
"""

import requests
import json
import time
from datetime import datetime
from typing import Optional, Dict, List

# API Key de AlphaVantage
API_KEY = "CJIOJ9QSU8A2JM7R"
BASE_URL = "https://www.alphavantage.co/query"

# Delay entre requests para respetar límite de tasa
REQUEST_DELAY = 1.2  # segundos


class AlphaVantageCrypto:
    """Cliente para interactuar con la API de AlphaVantage para criptomonedas"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = BASE_URL
        self.last_request_time = 0
    
    def _wait_for_rate_limit(self):
        """Espera el tiempo necesario para respetar el límite de tasa"""
        elapsed = time.time() - self.last_request_time
        if elapsed < REQUEST_DELAY:
            time.sleep(REQUEST_DELAY - elapsed)
        self.last_request_time = time.time()
    
    def _make_request(self, params: Dict) -> Optional[Dict]:
        """Realiza una petición a la API con manejo de errores"""
        self._wait_for_rate_limit()
        
        try:
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            # Verificar si hay error de límite de tasa
            if "Information" in data or "Note" in data:
                print(f"⚠️  Límite de API alcanzado o mensaje informativo")
                return None
            
            return data
        except requests.exceptions.RequestException as e:
            print(f"❌ Error en la petición: {e}")
            return None
    
    def get_exchange_rate(self, from_currency: str, to_currency: str) -> Optional[Dict]:
        """Obtiene el tipo de cambio actual"""
        params = {
            "function": "CURRENCY_EXCHANGE_RATE",
            "from_currency": from_currency,
            "to_currency": to_currency,
            "apikey": self.api_key
        }
        
        print(f"🔍 Obteniendo tipo de cambio {from_currency}/{to_currency}...")
        data = self._make_request(params)
        
        if data and "Realtime Currency Exchange Rate" in data:
            print(f"✅ Tipo de cambio obtenido")
            return data
        return None
    
    def get_crypto_intraday(self, symbol: str, market: str, interval: str = "5min") -> Optional[Dict]:
        """Obtiene datos intraday de criptomonedas"""
        params = {
            "function": "CRYPTO_INTRADAY",
            "symbol": symbol,
            "market": market,
            "interval": interval,
            "apikey": self.api_key
        }
        
        print(f"🔍 Obteniendo datos intraday {symbol}/{market} ({interval})...")
        data = self._make_request(params)
        
        if data and "Time Series Crypto" in data:
            print(f"✅ Datos intraday obtenidos")
            return data
        return None
    
    def get_crypto_daily(self, symbol: str, market: str) -> Optional[Dict]:
        """Obtiene datos diarios de criptomonedas"""
        params = {
            "function": "DIGITAL_CURRENCY_DAILY",
            "symbol": symbol,
            "market": market,
            "apikey": self.api_key
        }
        
        print(f"🔍 Obteniendo datos diarios {symbol}/{market}...")
        data = self._make_request(params)
        
        if data and "Time Series (Digital Currency Daily)" in data:
            print(f"✅ Datos diarios obtenidos")
            return data
        return None


def display_exchange_rate(data: Dict, symbol: str):
    """Muestra el tipo de cambio de forma legible"""
    if not data or "Realtime Currency Exchange Rate" not in data:
        return
    
    rate_data = data["Realtime Currency Exchange Rate"]
    
    print("\n" + "="*70)
    print(f"💱 {symbol} - TIPO DE CAMBIO EN VIVO")
    print("="*70)
    print(f"📊 Precio:        ${float(rate_data['5. Exchange Rate']):,.2f}")
    print(f"📈 Precio Bid:    ${float(rate_data['8. Bid Price']):,.2f}")
    print(f"📉 Precio Ask:    ${float(rate_data['9. Ask Price']):,.2f}")
    print(f"⏰ Actualizado:   {rate_data['6. Last Refreshed']} {rate_data['7. Time Zone']}")
    print("="*70)


def display_intraday_summary(data: Dict, symbol: str, limit: int = 5):
    """Muestra un resumen de los datos intraday"""
    if not data or "Time Series Crypto" not in data:
        return
    
    meta = data.get("Meta Data", {})
    time_series = data["Time Series Crypto"]
    
    print("\n" + "="*70)
    print(f"📊 {symbol} - DATOS INTRADAY (Últimos {limit} registros)")
    print("="*70)
    print(f"Intervalo: {meta.get('5. Interval', 'N/A')}")
    print(f"Última actualización: {meta.get('6. Last Refreshed', 'N/A')}")
    print("-" * 70)
    
    for i, (timestamp, values) in enumerate(list(time_series.items())[:limit]):
        print(f"\n⏰ {timestamp}")
        print(f"   💰 Apertura: ${float(values['1. open']):>12,.2f}")
        print(f"   📈 Máximo:   ${float(values['2. high']):>12,.2f}")
        print(f"   📉 Mínimo:   ${float(values['3. low']):>12,.2f}")
        print(f"   🎯 Cierre:   ${float(values['4. close']):>12,.2f}")
        print(f"   📊 Volumen:  {float(values['5. volume']):>12,.2f}")
    
    print("="*70)


def save_to_json(data: Dict, filename: str):
    """Guarda los datos en un archivo JSON"""
    if data:
        filepath = f"/home/sebastianvernis/Bet-Copilot/{filename}"
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"💾 Guardado: {filename}")


def main():
    """Función principal"""
    print("\n" + "="*70)
    print("🚀 EXTRACTOR DE DATOS DE CRIPTOMONEDAS EN VIVO - ALPHAVANTAGE")
    print("="*70)
    print(f"⏰ Fecha y hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)
    
    # Inicializar cliente
    client = AlphaVantageCrypto(API_KEY)
    
    # Lista de criptomonedas a consultar
    cryptos = [
        {"symbol": "BTC", "name": "Bitcoin"},
        {"symbol": "ETH", "name": "Ethereum"},
        {"symbol": "USDT", "name": "Tether"},
        {"symbol": "BNB", "name": "Binance Coin"},
    ]
    
    print("\n📋 Criptomonedas a consultar:")
    for crypto in cryptos:
        print(f"   • {crypto['name']} ({crypto['symbol']})")
    
    # Obtener tipos de cambio
    print("\n\n" + "="*70)
    print("1️⃣  TIPOS DE CAMBIO EN VIVO (USD)")
    print("="*70)
    
    exchange_rates = {}
    for crypto in cryptos:
        symbol = crypto['symbol']
        data = client.get_exchange_rate(symbol, "USD")
        if data:
            exchange_rates[symbol] = data
            display_exchange_rate(data, crypto['name'])
            save_to_json(data, f"{symbol.lower()}_exchange_rate.json")
        print()  # Línea en blanco
    
    # Obtener datos intraday para Bitcoin
    print("\n" + "="*70)
    print("2️⃣  DATOS INTRADAY - BITCOIN")
    print("="*70)
    
    btc_intraday = client.get_crypto_intraday("BTC", "USD", "5min")
    if btc_intraday:
        display_intraday_summary(btc_intraday, "Bitcoin", limit=5)
        save_to_json(btc_intraday, "btc_intraday_5min.json")
    
    # Resumen final
    print("\n\n" + "="*70)
    print("✨ RESUMEN DE EXTRACCIÓN")
    print("="*70)
    print(f"✅ Tipos de cambio obtenidos: {len(exchange_rates)}/{len(cryptos)}")
    print(f"✅ Datos intraday obtenidos: {'Sí' if btc_intraday else 'No'}")
    
    print("\n📁 Archivos generados:")
    for symbol in exchange_rates.keys():
        print(f"   • {symbol.lower()}_exchange_rate.json")
    if btc_intraday:
        print(f"   • btc_intraday_5min.json")
    
    print("\n" + "="*70)
    print("🎉 Proceso completado exitosamente!")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
