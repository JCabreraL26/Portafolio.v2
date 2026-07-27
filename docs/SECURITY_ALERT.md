# ⚠️ ALERTA DE SEGURIDAD - Token Expuesto

## 🔴 Problema Detectado

GitGuardian ha detectado que un **Telegram Bot Token** fue expuesto en el repositorio de GitHub.

```
Secret type: Telegram Bot Token
Repository: JCabreraL26/Portafolio.v2
Pushed date: February 19th 2026, 00:59:30 UTC
```

## ✅ Acciones Realizadas

1. ✅ Token removido de todos los archivos del código
2. ✅ Actualizado `.gitignore` para prevenir futuros incidentes
3. ✅ Creado `.env.example` como plantilla
4. ✅ Todos los scripts ahora usan variables de entorno

## 🚨 ACCIÓN INMEDIATA REQUERIDA

**DEBES REVOCAR EL TOKEN ACTUAL Y CREAR UNO NUEVO:**

### 1. Revocar el Bot Actual (URGENTE)

Ve a [@BotFather](https://t.me/BotFather) en Telegram y:

```
/mybots
→ Selecciona @FinProAssistant_bot
→ Bot Settings
→ Delete Bot (o revoke/regenerate token)
```

### 2. Crear Nuevo Bot

```
/newbot
→ Nombre: FinBot Pro v2
→ Username: FinProAssistant_v2_bot (o similar)
→ Guarda el nuevo token de forma SEGURA
```

### 3. Configurar Variables de Entorno

#### En tu máquina local (Windows PowerShell):

```powershell
# Agregar a tu perfil de PowerShell (~\Documents\PowerShell\Microsoft.PowerShell_profile.ps1)
$env:TELEGRAM_BOT_TOKEN = "TU_NUEVO_TOKEN_AQUI"
$env:TELEGRAM_AUTHORIZED_USER = "8597397136"  # Tu user ID
```

O crear archivo `.env` en la raíz del proyecto:

```bash
# Copia .env.example a .env
cp .env.example .env

# Edita .env con tus valores reales
notepad .env
```

#### En Convex:

```bash
npx convex env set TELEGRAM_BOT_TOKEN "tu_nuevo_token"
npx convex env set TELEGRAM_AUTHORIZED_USER "8597397136"
```

#### En Netlify/Vercel:

Configurar en el dashboard de variables de entorno.

### 4. Actualizar Webhook

```powershell
# Configurar webhook con el NUEVO token
$newToken = $env:TELEGRAM_BOT_TOKEN
$webhookUrl = "https://insightful-dove-33.convex.site/telegram"

Invoke-RestMethod -Uri "https://api.telegram.org/bot$newToken/setWebhook" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{
    url = $webhookUrl
  } | ConvertTo-Json)
```

### 5. Limpiar Historial de Git (Opcional pero Recomendado)

⚠️ **ADVERTENCIA:** Esto reescribirá el historial de Git.

```bash
# Usar git-filter-repo (recomendado)
pip install git-filter-repo
git filter-repo --replace-text <(echo "8367559959:AAF44I9ZOqBM7t5e28_5br1OONeiVx8LKkE==>REDACTED")

# Force push (cuidado!)
git push origin --force --all
```

O usar BFG Repo-Cleaner:

```bash
java -jar bfg.jar --replace-text passwords.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

## 📝 Buenas Prácticas de Seguridad

### ✅ Hacer:
- ✅ Usar variables de entorno para TODOS los secretos
- ✅ Agregar archivos sensibles a `.gitignore`
- ✅ Usar `.env.example` con placeholders
- ✅ Rotar tokens regularmente
- ✅ Usar GitHub Secrets para CI/CD
- ✅ Revisar código antes de cada commit

### ❌ NO Hacer:
- ❌ Hardcodear tokens en archivos
- ❌ Subir archivos `.env` a Git
- ❌ Compartir tokens en mensajes/emails
- ❌ Usar el mismo token en múltiples entornos
- ❌ Ignorar alertas de seguridad

## 🔒 Verificación de Seguridad

Después de revocar el token, verifica:

```bash
# Buscar tokens en el código
git grep -i "bot.*token"
git grep -E "\d+:[A-Za-z0-9_-]+"

# Verificar .gitignore
cat .gitignore | grep -E "\.env|\.ps1"

# Verificar variables de entorno
echo $env:TELEGRAM_BOT_TOKEN  # Debe mostrar tu nuevo token
```

## 📚 Referencias

- [Telegram Bot Security](https://core.telegram.org/bots/faq#how-do-i-create-a-bot)
- [Git Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitGuardian Docs](https://docs.gitguardian.com/)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

---

**Estado:** ⚠️ TOKEN EXPUESTO - ACCIÓN REQUERIDA  
**Último Update:** 2026-02-18  
**Responsable:** Revocar token INMEDIATAMENTE
