# 🚀 Quick Start Guide - UX Research Bot

## Inicio Rápido para Fase 0

### Prerrequisitos

- Python 3.11+
- Node.js 20+
- Git
- Cuenta en Google AI Studio (Gemini API)
- Cuenta en Telegram (para crear bot)

---

## 🎯 Setup Inicial (30 minutos)

### 1. Crear Bot de Telegram

```bash
# En Telegram, busca @BotFather y ejecuta:
/newbot

# Sigue las instrucciones y guarda el token:
# Ejemplo: 1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
```

### 2. Obtener Gemini API Key

1. Ve a [Google AI Studio](https://aistudio.google.com/apikey)
2. Crea un nuevo proyecto
3. Genera API Key
4. Guarda el key (ejemplo: `AIzaSyC...`)

### 3. Clonar Estructura del Proyecto

```bash
# Crear directorio raíz
mkdir ux-research-bot
cd ux-research-bot

# Inicializar git
git init
echo "# UX Research Bot - Multi-Agent System" > README.md
git add README.md
git commit -m "Initial commit"

# Crear estructura de carpetas
mkdir -p backend/python/{agents,schemas,tools,workflows,memory,rag,security}
mkdir -p backend/node/api/telegram
mkdir -p frontend/dashboard/src/{components,pages}
mkdir -p mcp-server/tools
mkdir -p docs
mkdir -p tests/{unit,integration}

# Crear archivos base
touch backend/python/main.py
touch backend/python/__init__.py
touch backend/node/api/telegram/webhook.ts
touch .env.example
touch .gitignore
```

### 4. Configurar Python

```bash
cd backend/python

# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (Mac/Linux)
source venv/bin/activate

# Crear pyproject.toml
cat > pyproject.toml << 'EOF'
[project]
name = "ux-research-bot"
version = "0.1.0"
description = "Multi-agent UX research assistant"
requires-python = ">=3.11"
dependencies = [
    "pydantic-ai>=0.0.13",
    "langgraph>=0.2.0",
    "google-generativeai>=0.8.0",
    "fastapi>=0.115.0",
    "uvicorn>=0.30.0",
    "python-telegram-bot>=21.0",
    "httpx>=0.27.0",
    "python-dotenv>=1.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.23.0",
    "black>=24.0.0",
    "ruff>=0.5.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
EOF

# Instalar dependencias
pip install -e ".[dev]"
```

### 5. Configurar Node.js

```bash
cd ../../backend/node

# Inicializar proyecto
npm init -y

# Instalar dependencias
npm install next@latest react@latest react-dom@latest
npm install @ai-sdk/google ai
npm install typescript @types/node @types/react -D

# Crear tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF
```

### 6. Variables de Entorno

```bash
cd ../..

# Crear .env.example
cat > .env.example << 'EOF'
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_WEBHOOK_SECRET=your_random_secret_here

# Convex (Fase 4)
CONVEX_DEPLOYMENT=
CONVEX_DEPLOY_KEY=

# Zep (Fase 4)
ZEP_API_KEY=

# Environment
NODE_ENV=development
PYTHON_ENV=development
EOF

# Copiar a .env real
cp .env.example .env

# Editar .env con tus valores reales
# Windows: notepad .env
# Mac/Linux: nano .env
```

### 7. Gitignore

```bash
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
.venv

# Node
node_modules/
.next/
out/
dist/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Testing
.coverage
.pytest_cache/
coverage/

# Build
build/
*.egg-info/
EOF
```

---

## 🧪 Validar Setup

### Test 1: Python + Pydantic AI

```bash
cd backend/python

# Crear test básico
cat > test_setup.py << 'EOF'
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

class Greeting(BaseModel):
    message: str
    language: str

async def test_gemini():
    model = GeminiModel(
        model_name='gemini-2.0-flash-exp',
        api_key=os.getenv('GEMINI_API_KEY')
    )
    
    agent = Agent(
        model=model,
        result_type=Greeting,
        system_prompt="Eres un asistente amigable."
    )
    
    result = await agent.run("Di hola en español")
    print(f"✅ Gemini funciona: {result.data.message}")
    return result.data

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_gemini())
EOF

# Ejecutar test
python test_setup.py
```

**Resultado esperado:**
```
✅ Gemini funciona: ¡Hola! ¿Cómo estás?
```

### Test 2: Telegram Bot

```bash
# Crear bot básico
cat > test_telegram.py << 'EOF'
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
import os
from dotenv import load_dotenv

load_dotenv()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('✅ Bot funcionando correctamente!')

async def test_bot():
    app = Application.builder().token(os.getenv('TELEGRAM_BOT_TOKEN')).build()
    app.add_handler(CommandHandler("start", start))
    
    print("🤖 Bot iniciado. Envía /start en Telegram para probar.")
    await app.run_polling()

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_bot())
EOF

# Ejecutar bot
python test_telegram.py

# En Telegram, busca tu bot y envía: /start
# Deberías recibir: "✅ Bot funcionando correctamente!"
```

---

## 📋 Checklist de Fase 0

- [ ] Python 3.11+ instalado
- [ ] Node.js 20+ instalado
- [ ] Estructura de carpetas creada
- [ ] Entorno virtual Python activado
- [ ] Dependencias Python instaladas
- [ ] Dependencias Node.js instaladas
- [ ] Variables de entorno configuradas
- [ ] Gemini API Key válida
- [ ] Telegram Bot Token válido
- [ ] Test de Gemini pasando
- [ ] Test de Telegram Bot pasando
- [ ] Git inicializado
- [ ] .gitignore configurado

---

## 🎯 Próximo Paso: Fase 1

Una vez completado el setup, continúa con:

```bash
# Crear primer esquema Pydantic
cd backend/python/schemas
touch design_thinking.py

# Copiar código de EmpathyPhase del documento principal
# Ver: docs/UX-RESEARCH-BOT-ARCHITECTURE.md - Fase 1
```

---

## 🆘 Troubleshooting

### Error: "No module named 'pydantic_ai'"

```bash
# Verificar que estás en el entorno virtual
which python  # Debería mostrar path a venv/

# Reinstalar
pip install pydantic-ai --upgrade
```

### Error: "Invalid API Key" (Gemini)

```bash
# Verificar que el key está en .env
cat .env | grep GEMINI

# Regenerar key en Google AI Studio si es necesario
```

### Error: "Unauthorized" (Telegram)

```bash
# Verificar token
cat .env | grep TELEGRAM_BOT_TOKEN

# Crear nuevo bot con @BotFather si es necesario
```

---

## 📚 Recursos Útiles

- [Documentación Completa](./UX-RESEARCH-BOT-ARCHITECTURE.md)
- [Pydantic AI Docs](https://ai.pydantic.dev/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Gemini API Docs](https://ai.google.dev/docs)

---

**¡Setup completado! 🎉**

Tiempo estimado: 30-45 minutos  
Siguiente fase: Implementar esquemas Pydantic (Semana 2)
