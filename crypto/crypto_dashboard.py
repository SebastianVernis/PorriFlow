#!/usr/bin/env python3
"""
Dashboard simple para visualizar datos de criptomonedas en tiempo real
"""

import json
import os
from datetime import datetime
from typing import Dict, List


def load_crypto_data(symbol: str) -> Dict:
    """Carga datos de criptomoneda desde archivo JSON"""
    filename = f"{symbol.lower()}_exchange_rate.json"
    filepath = f"/home/sebastianvernis/Bet-Copilot/{filename}"
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return None


def calculate_change_percentage(current: float, previous: float) -> float:
    """Calcula el porcentaje de cambio"""
    if previous == 0:
        return 0
    return ((current - previous) / previous) * 100


def format_price(price: float) -> str:
    """Formatea el precio con separadores de miles"""
    return f"${price:,.2f}"


def get_trend_indicator(bid: float, ask: float) -> str:
    """Obtiene indicador de tendencia basado en spread"""
    spread = ask - bid
    spread_percentage = (spread / bid) * 100
    
    if spread_percentage < 0.01:
        return "🟢 Muy Estrecho"
    elif spread_percentage < 0.05:
        return "🟡 Normal"
    else:
        return "🔴 Amplio"


def display_crypto_card(data: Dict):
    """Muestra una tarjeta con información de la criptomoneda"""
    if not data or "Realtime Currency Exchange Rate" not in data:
        return
    
    rate_data = data["Realtime Currency Exchange Rate"]
    
    symbol = rate_data['1. From_Currency Code']
    name = rate_data['2. From_Currency Name']
    price = float(rate_data['5. Exchange Rate'])
    bid = float(rate_data['8. Bid Price'])
    ask = float(rate_data['9. Ask Price'])
    last_update = rate_data['6. Last Refreshed']
    
    spread = ask - bid
    spread_percentage = (spread / bid) * 100
    trend = get_trend_indicator(bid, ask)
    
    # Calcular punto medio
    mid_price = (bid + ask) / 2
    
    print("┌" + "─" * 68 + "┐")
    print(f"│ {symbol:<10} {name:<54} │")
    print("├" + "─" * 68 + "┤")
    print(f"│ 💰 Precio:          {format_price(price):>20}                    │")
    print(f"│ 📈 Bid (Compra):    {format_price(bid):>20}                    │")
    print(f"│ 📉 Ask (Venta):     {format_price(ask):>20}                    │")
    print(f"│ 🎯 Precio Medio:    {format_price(mid_price):>20}                    │")
    print("├" + "─" * 68 + "┤")
    print(f"│ 📊 Spread:          {format_price(spread):>20} ({spread_percentage:.4f}%)      │")
    print(f"│ 📈 Tendencia:       {trend:<40} │")
    print("├" + "─" * 68 + "┤")
    print(f"│ ⏰ Actualizado:     {last_update:<40} │")
    print("└" + "─" * 68 + "┘")


def display_comparison_table(cryptos_data: List[Dict]):
    """Muestra una tabla comparativa de criptomonedas"""
    print("\n" + "="*90)
    print("📊 TABLA COMPARATIVA DE CRIPTOMONEDAS")
    print("="*90)
    
    # Encabezado
    print(f"{'Símbolo':<10} {'Nombre':<20} {'Precio':<15} {'Bid':<15} {'Ask':<15} {'Spread %':<10}")
    print("-" * 90)
    
    # Datos
    for data in cryptos_data:
        if not data or "Realtime Currency Exchange Rate" not in data:
            continue
        
        rate_data = data["Realtime Currency Exchange Rate"]
        symbol = rate_data['1. From_Currency Code']
        name = rate_data['2. From_Currency Name'][:18]
        price = float(rate_data['5. Exchange Rate'])
        bid = float(rate_data['8. Bid Price'])
        ask = float(rate_data['9. Ask Price'])
        
        spread_percentage = ((ask - bid) / bid) * 100
        
        print(f"{symbol:<10} {name:<20} {format_price(price):<15} {format_price(bid):<15} {format_price(ask):<15} {spread_percentage:.4f}%")
    
    print("="*90)


def display_market_summary(cryptos_data: List[Dict]):
    """Muestra un resumen del mercado"""
    total_value = 0
    crypto_count = 0
    
    for data in cryptos_data:
        if data and "Realtime Currency Exchange Rate" in data:
            rate_data = data["Realtime Currency Exchange Rate"]
            price = float(rate_data['5. Exchange Rate'])
            total_value += price
            crypto_count += 1
    
    avg_price = total_value / crypto_count if crypto_count > 0 else 0
    
    print("\n" + "="*70)
    print("📈 RESUMEN DEL MERCADO")
    print("="*70)
    print(f"🔢 Criptomonedas monitoreadas: {crypto_count}")
    print(f"💰 Valor total combinado:      {format_price(total_value)}")
    print(f"📊 Precio promedio:            {format_price(avg_price)}")
    print(f"⏰ Fecha de consulta:          {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)


def main():
    """Función principal del dashboard"""
    print("\n" + "="*70)
    print("🚀 DASHBOARD DE CRIPTOMONEDAS EN VIVO")
    print("="*70)
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)
    
    # Lista de criptomonedas a mostrar
    cryptos = ["BTC", "ETH", "USDT"]
    
    # Cargar datos
    cryptos_data = []
    print("\n📥 Cargando datos...")
    
    for symbol in cryptos:
        data = load_crypto_data(symbol)
        if data:
            cryptos_data.append(data)
            print(f"   ✅ {symbol} cargado")
        else:
            print(f"   ❌ {symbol} no disponible")
    
    if not cryptos_data:
        print("\n❌ No hay datos disponibles. Ejecuta primero crypto_live_data_optimized.py")
        return
    
    # Mostrar tarjetas individuales
    print("\n" + "="*70)
    print("💳 INFORMACIÓN DETALLADA")
    print("="*70 + "\n")
    
    for data in cryptos_data:
        display_crypto_card(data)
        print()
    
    # Mostrar tabla comparativa
    display_comparison_table(cryptos_data)
    
    # Mostrar resumen del mercado
    display_market_summary(cryptos_data)
    
    print("\n" + "="*70)
    print("✨ Dashboard actualizado exitosamente")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
