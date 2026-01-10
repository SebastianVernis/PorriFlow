#!/bin/bash

echo "🧪 Probando backend en Render..."
echo ""

echo "1️⃣ Health Check:"
curl -s https://sv-portfolio-api.onrender.com/health
echo ""
echo ""

echo "2️⃣ Login Admin:"
curl -s -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Svernis1"}'
echo ""
echo ""

echo "3️⃣ Login Porrito:"
curl -s -X POST https://sv-portfolio-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"porrito","password":"Selapeloalchispa1"}'
echo ""
