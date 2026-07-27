# 🤖 Configuración de Gemini 1.5 Flash (Plan Gratuito)

## 📋 Resumen
Hemos migrado completamente a **Google Gemini 1.5 Flash** para eliminar costos de API.

## ✅ Ventajas
- ✨ **100% GRATIS** - Plan gratuito de Google AI
- 🚀 **15 requests/minuto** - Suficiente para uso personal
- 💾 **1 millón de tokens/mes** - Cupo generoso
- 🎯 **Modelo optimizado** - gemini-1.5-flash

## 🔧 Configuración (3 pasos)

### 1️⃣ Crear API Key en Google AI Studio

```bash
# Se abrirá automáticamente en tu navegador
npm run open-ai-studio
```

O visita manualmente: https://aistudio.google.com/app/apikey

**Pasos en la web:**
1. Haz clic en **"Get API key"** o **"Create API key"**
2. Selecciona **"Create API key in new project"**
3. ✅ Copia la nueva API key (empieza con `AIza...`)

### 2️⃣ Actualizar API Key en Convex

```bash
# Reemplaza YOUR_NEW_API_KEY con la key que copiaste
npx convex env set GEMINI_API_KEY YOUR_NEW_API_KEY
```

### 3️⃣ Probar la API

```bash
# Primero actualiza test-gemini.js con tu nueva API key
# Línea 5: const API_KEY = "TU_NUEVA_API_KEY";

# Luego ejecuta el test
node test-gemini.js
```

**Resultado esperado:**
```
✅ RESPUESTA RECIBIDA:
───────────────────────
Hola, funcionando correctamente con plan gratuito
───────────────────────
🎉 Gemini 1.5 Flash funciona perfectamente!
```

### 4️⃣ Desplegar y probar bot

```bash
# Desplegar cambios
npx convex dev --once

# El webhook ya está configurado
# Prueba enviando un mensaje al bot: @FinProAssistant_bot
```

## 🎯 Funcionalidades del Bot

### Comandos rápidos:
- `/gasto $50 comida` - Registra gasto
- `/ingreso $100 freelance` - Registra ingreso
- `/resumen` - Resumen financiero
- `/proyectos` - Lista proyectos
- `/ayuda` - Ver todos los comandos

### Extracción inteligente:
El bot puede entender lenguaje natural:
- "Gasté $25 en comida" → Registra automáticamente
- "Ingreso de $500 por freelance" → Registra ingreso
- "¿Cuál es mi balance?" → Muestra resumen

## 🔍 Troubleshooting

### Error 404 - Model not found
**Causa:** La API no está habilitada en el proyecto

**Solución:** Crea una nueva API key en Google AI Studio (paso 1)

### Error 429 - Rate limit
**Causa:** Excediste 15 requests/minuto

**Solución:** Espera 1 minuto y vuelve a intentar

### Error: API_KEY_INVALID
**Causa:** La API key no es válida

**Solución:** Verifica que copiaste correctamente la key y que empieza con `AIza`

## 📊 Límites del Plan Gratuito

| Recurso | Límite |
|---------|--------|
| Requests/minuto | 15 RPM |
| Requests/día | 1,500 RPD |
| Tokens/mes | 1,000,000 |
| Costo | **$0.00** |

✅ Más que suficiente para uso personal del bot Telegram

## 🚀 Estado Actual

- ✅ Código migrado a Gemini 1.5 Flash
- ✅ Dependency de DeepSeek eliminada
- ✅ Prompt optimizado para extracción de datos
- ⏳ **Pendiente:** Crear nueva API key y configurar
- ⏳ **Pendiente:** Probar bot con mensajes reales

## 📝 Notas

- El prompt está configurado para actuar como "extractor estricto" en temas contables
- Para otros temas (diseño, proyectos), responde conversacionalmente
- Todas las respuestas son en español y optimizadas para móvil
- Formato Markdown activado en Telegram para mejor legibilidad
