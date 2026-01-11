# Notas de Sesión - SV Portfolio
**Fecha:** 11 de Enero, 2026  
**Última actualización:** 08:15 AM UTC

---

## 🎯 Estado Actual del Proyecto

### ✅ Completado en Esta Sesión

1. **Multitenancy Corregido**
   - ✅ Formato de respuesta en `/api/portfolios` arreglado
   - ✅ Ahora retorna array directo en lugar de objeto envuelto
   - ✅ Cada usuario solo ve sus propios portafolios
   - **Commit:** `990fec2` - "fix: correct portfolio API response format for multitenancy"

2. **Análisis de Sentimiento Verificado**
   - ✅ El servicio funciona correctamente
   - ✅ Analiza título + descripción de noticias
   - ✅ Asigna: `positive`, `negative`, `neutral`
   - ✅ Usa diccionario local con palabras financieras y crypto
   - **Test local exitoso:** 5 noticias analizadas correctamente

3. **Configuración de Render**
   - ✅ Finnhub API configurada en código
   - ✅ Schema de Prisma sincronizado en producción
   - ✅ Usuario de prueba creado: `testapi` / `test123`
   - ✅ JWT import agregado en rutas de auth
   - ✅ SYMBOL_DATABASE exportado correctamente

---

## ⚠️ PROBLEMA PENDIENTE - HTTP 403 en Finnhub

### Descripción del Error
```
Error fetching historical data for AAPL: HTTP 403
Error fetching historical data for MSFT: HTTP 403
Error fetching historical data for GOOGL: HTTP 403
Error fetching historical data for TSLA: HTTP 403
```

### Causa Probable
1. **Variable de entorno faltante:** `FINNHUB_API_KEY` no está configurada en Render
2. **IP bloqueada:** Finnhub puede estar bloqueando IPs de Render
3. **API Key inválida:** La key puede estar expirada o incorrecta

### Ubicación del Código
- **Archivo:** `/backend/src/services/market-data-service.js`
- **Línea:** 198
- **Código:**
  ```javascript
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${period1}&to=${period2}&token=${FINNHUB_API_KEY}`;
  ```

### Variable de Entorno Requerida
```bash
FINNHUB_API_KEY=tu_api_key_aqui
```

---

## 📋 PASOS PARA RESOLVER (Próxima Sesión)

### Opción 1: Configurar Variable en Render (RECOMENDADO)
1. Ir a [Render Dashboard](https://dashboard.render.com/)
2. Seleccionar el servicio `sv-portfolio-api`
3. Ir a **Environment** → **Environment Variables**
4. Agregar variable:
   - **Key:** `FINNHUB_API_KEY`
   - **Value:** `[tu API key de Finnhub]`
5. Guardar y esperar redespliegue automático (~2 min)

### Opción 2: Verificar API Key de Finnhub
1. Visitar: https://finnhub.io/dashboard
2. Verificar que la key esté activa
3. Verificar límites de rate (60 llamadas/minuto en plan gratuito)
4. Si está expirada, generar nueva key

### Opción 3: API Alternativa (Si Finnhub falla)
Considerar cambiar a otra API:
- **Alpha Vantage** (500 llamadas/día gratis)
- **Polygon.io** (5 llamadas/minuto gratis)
- **Yahoo Finance** (requiere proxy para evitar bloqueos)

---

## 🗂️ Archivos Importantes

### Backend
```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.js (✅ JWT import agregado)
│   │   ├── portfolios.js (✅ Response format corregido)
│   │   └── market-data.js
│   ├── services/
│   │   ├── market-data-service.js (⚠️ HTTP 403 aquí)
│   │   ├── news-service.js (✅ Funciona)
│   │   └── sentiment-analyzer.js (✅ Funciona)
│   └── middleware/
│       ├── auth.js
│       └── multitenancy.js (✅ Funciona)
├── prisma/
│   └── schema.prisma (✅ Sincronizado)
├── .env.render (archivo local de referencia)
└── render.yaml
```

### Frontend
```
public/
├── index.html
└── assets/
    └── js/
        └── sentiment-analyzer.js (✅ Implementado)
```

---

## 🔑 Credenciales de Prueba

### Usuario de Prueba en Producción
- **Username:** `testapi`
- **Password:** `test123`
- **Email:** `testapi@example.com`

### Base de Datos
- **Provider:** Neon (PostgreSQL)
- **Estado:** ✅ Conectado
- **Usuarios en DB:** 4 (incluyendo testapi)

---

## 🚀 URLs Importantes

- **API en Producción:** https://sv-portfolio-api.onrender.com
- **Health Check:** https://sv-portfolio-api.onrender.com/health
- **Render Dashboard:** https://dashboard.render.com/
- **GitHub Repo:** https://github.com/SebastianVernis/PorriFlow
- **Finnhub Dashboard:** https://finnhub.io/dashboard

---

## 📊 Endpoints Verificados

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `/health` | GET | ✅ 200 | OK |
| `/api/auth/login` | POST | ✅ 200 | Token generado |
| `/api/auth/register` | POST | ⚠️ 500 | Funciona local, falla en prod |
| `/api/portfolios` | GET | ✅ 200 | Multitenancy OK |
| `/api/market-data/symbols` | GET | ✅ 200 | SYMBOL_DATABASE exportado |
| `/api/market-data/historical/:symbol` | GET | ⚠️ 403 | Finnhub bloqueado |
| `/api/market-data/price/:symbol` | GET | ⚠️ 403 | Finnhub bloqueado |
| `/api/news/:symbol` | GET | ✅ 200 | Funciona, sentimiento OK |

---

## 🔧 Configuración de Background Jobs

### Jobs Activos en Render
```
✅ news-update-popular (30m) → Próximo: 8:25 AM
✅ news-update-all (6h) → Próximo: 1:55 PM
✅ historical-data-download (1d) → Próximo: 7:55 AM (mañana)
✅ price-cache-update (5m) → Próximo: 8:15 AM
✅ cache-cleanup (1d) → Próximo: 7:55 AM (mañana)
```

**Nota:** `price-cache-update` falla cada 5 minutos por HTTP 403 de Finnhub

---

## 🐛 Errores Conocidos

### 1. HTTP 403 en Finnhub (CRÍTICO)
- **Impacto:** No se pueden obtener precios ni datos históricos
- **Frecuencia:** Constante
- **Solución:** Configurar `FINNHUB_API_KEY` en Render

### 2. SEC Filings HTTP 403
- **Impacto:** No se pueden obtener filings de la SEC
- **Frecuencia:** Constante
- **Solución:** SEC requiere User-Agent específico o proxy
- **Prioridad:** Baja (no crítico)

### 3. Registro falla en producción (500)
- **Impacto:** Usuarios nuevos no pueden registrarse desde frontend
- **Frecuencia:** Intermitente
- **Solución:** Revisar logs de Render para ver error específico
- **Prioridad:** Media

---

## 📝 Comandos Útiles

### Verificar DB Local
```bash
cd backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => {
  console.log('✅ DB Connected');
  return prisma.user.count();
}).then(count => {
  console.log('Users:', count);
  prisma.\$disconnect();
});
"
```

### Test de Sentimiento Local
```bash
cd backend
node test-news-fetch.mjs
```

### Push Schema a Producción
```bash
cd backend
npm run db:push
```

### Ver Logs de Render
```bash
# En Dashboard: Logs → Ver últimos errores
# Buscar: "Error fetching", "HTTP 403", "failed"
```

---

## 🎯 Próximos Pasos (En Orden de Prioridad)

### Prioridad ALTA 🔴
1. **Configurar FINNHUB_API_KEY en Render**
   - Sin esto, la app no puede obtener precios
   - Tiempo estimado: 5 minutos
   
2. **Verificar que precios se actualicen correctamente**
   - Test endpoint: `/api/market-data/price/AAPL`
   - Debe retornar precio actual

### Prioridad MEDIA 🟡
3. **Investigar error de registro en producción**
   - Revisar logs de Render
   - Verificar que todas las relaciones de Prisma estén correctas
   
4. **Agregar manejo de rate limits**
   - Finnhub: 60 llamadas/min
   - Implementar retry con backoff

### Prioridad BAJA 🟢
5. **Mejorar manejo de SEC filings**
   - Agregar User-Agent correcto
   - Implementar fallback si falla
   
6. **Documentar API**
   - Crear Swagger/OpenAPI docs
   - Agregar ejemplos de requests

---

## 💡 Notas Técnicas

### Estructura de Sentimiento
```javascript
{
  score: -100 a +100,
  sentiment: 'positive' | 'negative' | 'neutral',
  confidence: 0 a 100,
  source: 'local-dictionary' | 'api-ninjas' | 'external'
}
```

### Umbral de Sentimiento
- **Positive:** score > 20
- **Negative:** score < -20
- **Neutral:** -20 ≤ score ≤ 20

### Rate Limits Conocidos
- **Finnhub Free:** 60 llamadas/minuto
- **Alpha Vantage Free:** 5 llamadas/minuto, 500/día
- **Yahoo Finance:** Sin límite oficial, pero bloquea IPs

---

## 🔄 Últimos Commits

```
990fec2 - fix: correct portfolio API response format for multitenancy
1f74173 - fix: endpoint configuration for Render deployment
b82f2dd - Nuevo
b55f5f5 - Merge PR: agent/verifica-funciones
1333f84 - feat(crypto): add sentiment analysis with API key
```

---

## ✅ Checklist para Próxima Sesión

- [ ] Configurar `FINNHUB_API_KEY` en Render
- [ ] Verificar que `/api/market-data/price/AAPL` retorne precio
- [ ] Verificar que `/api/market-data/historical/AAPL` retorne datos
- [ ] Test de registro desde frontend en producción
- [ ] Verificar multitenancy con 2 usuarios diferentes
- [ ] Verificar análisis de sentimiento en frontend
- [ ] Revisar logs de background jobs
- [ ] Documentar estructura de `.env.render` completa

---

## 📞 Información de Contacto (Si es necesario)

- **Finnhub Support:** support@finnhub.io
- **Render Support:** https://render.com/docs/support
- **Neon Support:** https://neon.tech/docs/introduction

---

**Fin de Notas de Sesión**
