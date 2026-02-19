# Script de prueba para el bot de Telegram FinBot Pro
# Autor: Jorge Cabrera
# Fecha: 2026-02-18

$botToken = $env:TELEGRAM_BOT_TOKEN
$chatId = $env:TELEGRAM_AUTHORIZED_USER

Write-Host "=== Test de FinBot Pro ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar bot
Write-Host "1. Verificando información del bot..." -ForegroundColor Yellow
$botInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getMe" -Method Get
if ($botInfo.ok) {
    Write-Host "   OK Bot: $($botInfo.result.first_name) - @$($botInfo.result.username)" -ForegroundColor Green
} else {
    Write-Host "   ERROR - al obtener informacion del bot" -ForegroundColor Red
    exit 1
}

# 2. Verificar webhook
Write-Host ""
Write-Host "2. Verificando configuración del webhook..." -ForegroundColor Yellow
$webhookInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getWebhookInfo" -Method Get
if ($webhookInfo.ok) {
    Write-Host "   OK Webhook URL: $($webhookInfo.result.url)" -ForegroundColor Green
    Write-Host "   OK Pending updates: $($webhookInfo.result.pending_update_count)" -ForegroundColor Green
} else {
    Write-Host "   ERROR al obtener informacion del webhook" -ForegroundColor Red
    exit 1
}

# 3. Enviar mensaje de prueba
Write-Host ""
Write-Host "3. Enviando mensaje de prueba..." -ForegroundColor Yellow
$testMessage = "🤖 Test del bot FinBot Pro - " + (Get-Date -Format "HH:mm:ss")
$sendParams = @{
    chat_id = $chatId
    text = $testMessage
} | ConvertTo-Json

try {
    $sendResult = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/sendMessage" `
                                     -Method Post `
                                     -ContentType "application/json" `
                                     -Body $sendParams
    
    if ($sendResult.ok) {
        Write-Host "   OK Mensaje enviado correctamente" -ForegroundColor Green
        Write-Host "   OK Message ID: $($sendResult.result.message_id)" -ForegroundColor Green
    } else {
        Write-Host "   ERROR al enviar mensaje" -ForegroundColor Red
    }
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Instrucciones
Write-Host ""
Write-Host "=== Siguiente paso ===" -ForegroundColor Cyan
Write-Host "Ahora puedes enviar mensajes desde Telegram a @FinProAssistant_bot" -ForegroundColor White
Write-Host "y el bot debería responder automáticamente usando DeepSeek AI." -ForegroundColor White
Write-Host ""
Write-Host "Panel de Convex: https://dashboard.convex.dev/d/insightful-dove-33" -ForegroundColor Gray
Write-Host "Deployment URL: https://bright-rooster-475.convex.cloud" -ForegroundColor Gray
Write-Host ""
