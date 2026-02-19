# Bot de Telegram con Polling (sin webhooks)
# Script para recibir y procesar mensajes usando getUpdates

$botToken = "8367559959:AAF44I9ZOqBM7t5e28_5br1OONeiVx8LKkE"
$chatId = "8597397136"
$offset = 0

Write-Host "=== FinBot Pro - Modo Polling ===" -ForegroundColor Cyan
Write-Host "El bot está escuchando mensajes. Presiona Ctrl+C para detener." -ForegroundColor Yellow
Write-Host ""

# Primero, remover el webhook
Write-Host "Removiendo webhook..." -ForegroundColor Yellow
$removeWebhook = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/deleteWebhook" -Method Post
if ($removeWebhook.ok) {
    Write-Host "OK - Webhook removido" -ForegroundColor Green
}

while ($true) {
    try {
        # Obtener actualizaciones
        $updates = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getUpdates?offset=$offset&timeout=30" -Method Get
        
        if ($updates.ok -and $updates.result.Count -gt 0) {
            foreach ($update in $updates.result) {
                $offset = $update.update_id + 1
                
                if ($null -ne $update.message -and $null -ne $update.message.text) {
                    $message = $update.message
                    $text = $message.text
                    $fromUser = $message.from.first_name
                    $messageId = $message.message_id
                    
                    $timestamp = Get-Date -Format "HH:mm:ss"
                    Write-Host "[$timestamp] Mensaje de $fromUser`: $text" -ForegroundColor Cyan
                    
                    # Verificar que sea del usuario autorizado
                    if ($message.chat.id.ToString() -ne $chatId) {
                        Write-Host "   Acceso denegado a: $($message.chat.id)" -ForegroundColor Red
                        continue
                    }
                    
                    # Aquí procesarías con DeepSeek
                    # Por ahora, respuesta simple de eco
                    $response = "Recibí tu mensaje: '$text'"
                    
                    # Enviar respuesta
                    $sendParams = @{
                        chat_id = $chatId
                        text = $response
                        reply_to_message_id = $messageId
                    } | ConvertTo-Json
                    
                    $sendResult = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/sendMessage" `
                                                     -Method Post `
                                                     -ContentType "application/json" `
                                                     -Body $sendParams
                    
                    if ($sendResult.ok) {
                        Write-Host "   Respuesta enviada OK" -ForegroundColor Green
                    }
                }
            }
        }
        
        # Pequeña pausa para no saturar
        Start-Sleep -Milliseconds 100
        
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Start-Sleep -Seconds 5
    }
}
