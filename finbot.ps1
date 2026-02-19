# FinBot Pro - Telegram Bot con Polling
$BOT_TOKEN = $env:TELEGRAM_BOT_TOKEN
$AUTHORIZED_ID = $env:TELEGRAM_AUTHORIZED_USER
$offset = 0

Write-Host "=== FinBot Pro - Polling Mode ===" -ForegroundColor Cyan
Write-Host "Bot listening... Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Remove webhook
try {
    Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/deleteWebhook" -Method Post | Out-Null
    Write-Host "Webhook removed. Polling active." -ForegroundColor Green
} catch {
    Write-Host "Warning:" $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

while ($true) {
    try {
        $url = "https://api.telegram.org/bot$BOT_TOKEN/getUpdates?offset=$offset&timeout=30"
        $updates = Invoke-RestMethod -Uri $url -Method Get
        
        if ($updates.ok -and $updates.result.Count -gt 0) {
            foreach ($update in $updates.result) {
                $offset = $update.update_id + 1
                
                if ($update.message.text) {
                    $msg = $update.message
                    $chatId = $msg.chat.id.ToString()
                    $text = $msg.text
                    $messageId = $msg.message_id
                    
                    # Check authorization
                    if ($chatId -ne $AUTHORIZED_ID) {
                        Write-Host "Unauthorized access from: $chatId" -ForegroundColor Red
                        continue
                    }
                    
                    Write-Host "Message: $text" -ForegroundColor Cyan
                    
                    # Generate response
                    $response = "Echo: $text"
                    if ($text -match "hola|hello") {
                        $response = "Hola! Soy FinBot Pro. Como puedo ayudarte?"
                    }
                    
                    # Send response
                    $sendUrl = "https://api.telegram.org/bot$BOT_TOKEN/sendMessage"
                    $body = @{
                        chat_id = $AUTHORIZED_ID
                        text = $response
                        reply_to_message_id = $messageId
                    } | ConvertTo-Json
                    
                    Invoke-RestMethod -Uri $sendUrl -Method Post -ContentType "application/json" -Body $body | Out-Null
                    Write-Host "Response sent" -ForegroundColor Green
                }
            }
        }
        
        Start-Sleep -Milliseconds 100
        
    } catch {
        Write-Host "Error:" $_.Exception.Message -ForegroundColor Red
        Start-Sleep -Seconds 5
    }
}
