# Configuración de Netlify Functions para Telegram Bot

## Variables de entorno necesarias en Netlify:

1. Ve a tu sitio en Netlify
2. Settings → Environment variables
3. Agrega estas variables:

```
CONVEX_URL=https://bright-rooster-475.convex.cloud
TELEGRAM_BOT_TOKEN=8367559959:AAF44I9ZOqBM7t5e28_5br1OONeiVx8LKkE
```

## Configurar webhook:

Una vez deployado en Netlify, configura el webhook con:

```powershell
$botToken = $env:TELEGRAM_BOT_TOKEN
$webhookUrl = "https://TU-SITIO.netlify.app/.netlify/functions/telegram"

Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/setWebhook" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{url=$webhookUrl} | ConvertTo-Json)
```

## Deploy a Netlify:

```bash
# 1. Inicializar git (si no lo has hecho)
git init
git add .
git commit -m "Add Telegram bot with Netlify Functions"

# 2. Subir a GitHub
# 3. Conectar con Netlify
# 4. Deploy automático
```
