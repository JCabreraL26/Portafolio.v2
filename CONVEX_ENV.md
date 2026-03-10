# Variables de Entorno - FinBot Pro (Telegram)

## 🔐 Secretos Requeridos

Debes configurar las siguientes variables de entorno en el dashboard de Convex para que **FinBot Pro** funcione correctamente con Telegram.

---

## 🤖 IA y Modelos de Lenguaje

### OpenAI (FinBot Pro - Deep Seek)
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- **Propósito**: Conexión con OpenAI para FinBot Pro AI
- **Uso**: Procesamiento de mensajes de Telegram, análisis de intención
- **Seguridad**: Mantener privada, nunca exponer en cliente

### Google AI (Chatbot Web & Gemini)
```
GOOGLE_AI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- **Propósito**: Conexión con Google Gemini para chatbot web y Telegram
- **Uso**: Respuestas automáticas, procesamiento de lenguaje natural
- **Seguridad**: Mantener privada, nunca exponer en cliente

### Zep Cloud (Memoria de Largo Plazo)
```
ZEP_API_KEY=z_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- **Propósito**: Sistema de memoria de largo plazo para el bot
- **Uso**: Almacenamiento de conversaciones, hechos del usuario, contexto histórico
- **Seguridad**: Alta - contiene datos privados del usuario
- **Cómo obtener**: Crear cuenta en https://www.getzep.com y obtener API key del dashboard

---

## 📱 Telegram Bot API

### Token del Bot
```
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```
- **Propósito**: Autenticación con Telegram Bot API
- **Uso**: Envío y recepción de mensajes via webhook
- **Seguridad**: Alta - permite controlar tu bot
- **Cómo obtener**: Hablar con @BotFather en Telegram

### Tu Chat ID (Autorizado)
```
MY_TELEGRAM_ID=123456789
```
- **Propósito**: ID único autorizado para usar FinBot Pro
- **Uso**: Verificación de seguridad - solo tú puedes usar el bot
- **Seguridad**: Máxima - bloquea acceso de otros usuarios
- **Cómo obtener**: Enviar mensaje a @userinfobot en Telegram

### Webhook Secret (Opcional)
```
TELEGRAM_WEBHOOK_SECRET=finbot_secret_2024
```
- **Propósito**: Verificación adicional del webhook
- **Uso**: Validar que las peticiones vienen de Telegram
- **Seguridad**: Media - capa extra de seguridad

---

## 🌐 Configuración General

### URL de Convex (Opcional)
```
CONVEX_URL=https://tu-proyecto.convex.cloud
```
- **Propósito**: URL del proyecto Convex
- **Uso**: Conexión desde componentes React
- **Seguridad**: Baja - es la URL pública de tu proyecto

---

## 🔧 Configuración en Dashboard Convex

### Pasos para configurar:

1. **Ir al Dashboard de Convex**
   - Visita https://dashboard.convex.dev
   - Selecciona tu proyecto

2. **Navegar a Settings**
   - Haz clic en "Settings" en el menú lateral
   - Selecciona "Environment Variables"

3. **Agregar Variables**
   - Click en "Add variable"
   - Ingresa el nombre y valor exactos
   - Selecciona "Secret" para datos sensibles

4. **Guardar y Desplegar**
   - Click en "Save"
   - Espera el despliegue automático

---

## 📋 Checklist de Configuración

### ✅ Variables Críticas (Requeridas)
- [ ] `OPENAI_API_KEY`
- [ ] `GOOGLE_AI_API_KEY` o `GEMINI_API_KEY`
- [ ] `ZEP_API_KEY` (para memoria de largo plazo)
- [ ] `TELEGRAM_BOT_TOKEN`
- [ ] `MY_TELEGRAM_ID`

### ⚙️ Variables Opcionales
- [ ] `TELEGRAM_WEBHOOK_SECRET`
- [ ] `CONVEX_URL`

---

## 🤖 Creación del Bot en Telegram

### Pasos para crear @FinBotProAssistant:

1. **Hablar con @BotFather**
   ```
   /newbot
   FinBot Pro
   @FinBotProAssistant
   ```

2. **Obtener el Token**
   - BotFather te dará: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`
   - Configurar en `TELEGRAM_BOT_TOKEN`

3. **Obtener tu Chat ID**
   - Hablar con @userinfobot
   - Te dará tu ID: `123456789`
   - Configurar en `MY_TELEGRAM_ID`

4. **Configurar Webhook**
   ```bash
   curl -X POST https://tu-proyecto.convex.cloud/telegram/setwebhook \
     -H "Content-Type: application/json" \
     -d '{"webhook_url": "https://tu-proyecto.convex.cloud/telegram"}'
   ```

---

## 🚀 Verificación de Configuración

### Test de Conexión
Una vez configuradas las variables, puedes verificar:

```bash
# Verificar conexión con Convex
npx convex dev

# Test webhook de Telegram
curl -X POST https://tu-proyecto.convex.cloud/telegram/test \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "hola", "chat_id": "TU_CHAT_ID"}'

# Test chatbot web
curl -X POST https://tu-proyecto.convex.cloud/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "hola", "session_id": "test_session"}'
```

### Health Checks
- Telegram: `GET /telegram/health`
- Chatbot: `GET /api/chatbot/health`
- Info Bot: `GET /telegram/info`

---

## 🔒 Consideraciones de Seguridad

### 🚫 Nunca exponer en cliente:
- `OPENAI_API_KEY`
- `GOOGLE_AI_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `MY_TELEGRAM_ID`

### ✅ Seguras para configuración:
- `TELEGRAM_WEBHOOK_SECRET`
- `CONVEX_URL`

### 🔄 Rotación de Keys:
- Rotar `OPENAI_API_KEY` cada 90 días
- Rotar `TELEGRAM_BOT_TOKEN` cada 180 días
- Actualizar tokens inmediatamente si hay sospecha de compromiso

### 🛡️ Seguridad por Chat ID:
- Solo `MY_TELEGRAM_ID` puede usar el bot
- Acceso denegado automático para otros usuarios
- Logs de intentos no autorizados

---

## 📞 Soporte

Si tienes problemas con la configuración:

1. **Verifica logs** en el dashboard de Convex
2. **Revisa permisos** del bot en Telegram
3. **Confirma webhook URL** con `/setwebhook`
4. **Valida chat ID** con @userinfobot
5. **Testea endpoints** individualmente

---

## 🎯 Comandos de FinBot Pro

Una vez configurado, puedes usar:

- **Financieros**: "registrar gasto $50 en comida: almuerzo"
- **Proyectos**: "crear proyecto web en fase definir: nuevo sitio cliente"
- **Reportes**: "resumen financiero"
- **Gestión**: "listar proyectos"

---

## 📊 Flujo Completo

1. **Tú envías mensaje** a @FinBotProAssistant
2. **Telegram webhook** → POST `/telegram`
3. **Verificación chat_id** (solo tú)
4. **Procesamiento IA** (Deep Seek)
5. **Respuesta** via `sendMessage` API
6. **Registro** en logs

---

*Última actualización: 18 de Febrero 2026 - Migración a Telegram*
