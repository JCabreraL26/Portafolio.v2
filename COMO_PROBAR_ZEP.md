# 🧪 Cómo Probar la Memoria de Zep en Telegram

## ⚠️ IMPORTANTE: Primero Asegúrate de Tener

1. ✅ `ZEP_API_KEY` configurada en Convex Dashboard
2. ✅ Convex desplegado (`npx convex dev` ejecutándose)
3. ✅ Bot de Telegram corriendo (`node telegram-bot.js`)

---

## 🎯 Prueba Básica de Memoria (5 minutos)

### 🔹 Paso 1: Presentarte (Crear Contexto Inicial)

Envía estos mensajes uno por uno por Telegram:

```
Hola, soy Jorge
```

```
Trabajo en desarrollo web con TypeScript
```

```
Estoy construyendo un sistema financiero para mi negocio
```

```
Me gusta la pizza y el café
```

**Espera 10-15 segundos** (Zep procesa en background)

---

### 🔹 Paso 2: Verificar que Recuerda

Envía preguntas sobre lo que le dijiste:

```
¿Cuál es mi nombre?
```

```
¿En qué trabajo?
```

```
¿Qué estoy construyendo?
```

✅ **Resultado esperado**: El bot debe responder correctamente usando la información que le diste.

---

### 🔹 Paso 3: Probar Memoria de Largo Plazo

**Cierra el bot** (Ctrl+C) y vuélvelo a abrir:

```powershell
node telegram-bot.js
```

Ahora envía:

```
¿Recuerdas mi nombre?
```

```
¿Qué lenguaje de programación uso?
```

✅ **Resultado esperado**: El bot debe recordar TODO, incluso después de reiniciarse.

---

### 🔹 Paso 4: Probar con Transacciones

Envía varios gastos:

```
/gasto 50 comida
```

```
/gasto 100 uber
```

```
/gasto 25 café
```

Luego pregunta:

```
¿Cuánto he gastado en total?
```

```
¿En qué he gastado más dinero?
```

✅ **Resultado esperado**: El bot debe analizar tus gastos usando su memoria.

---

## 📊 Verificar en Logs

Mientras pruebas, revisa la terminal donde corre el bot. Deberías ver:

```
🧠 Inicializando sesión de Zep para usuario: 123456789
💾 Mensaje del usuario guardado en Zep
✅ Memoria de Zep cargada (347 caracteres)
💾 Respuesta del bot guardada en Zep
```

---

## 🧠 Prueba Avanzada: Contexto entre Conversaciones

### Día 1 (Hoy):
```
Estoy pensando en crear una app de delivery
Me gustaría que no tenga comisiones
Se llamaría MenuClick
```

### Día 2 (Mañana):
```
Hola, ¿recuerdas mi idea de la app?
```

```
¿Qué nombre le había puesto?
```

```
¿Qué característica principal tenía?
```

✅ **Resultado esperado**: Recuerda TODO de la conversación anterior.

---

## 🔍 Prueba de Hechos Extraídos

Después de conversar un rato, pregunta:

```
¿Qué sabes sobre mí?
```

```
Cuéntame qué has aprendido de nuestras conversaciones
```

✅ **Resultado esperado**: El bot debe resumir los hechos principales:
- Tu nombre
- Tu profesión
- Tus proyectos
- Tus preferencias
- Etc.

---

## 🐛 Si Algo Sale Mal

### No recuerda nada:
1. Verifica logs: ¿Ves "✅ Memoria de Zep cargada"?
2. Verifica Convex Dashboard: ¿Está `ZEP_API_KEY` configurada?
3. Ejecuta: `node test-zep.js` para verificar conexión

### Error "Property 'zep' does not exist":
1. Ejecuta: `npx convex dev`
2. Espera que termine el deploy
3. Reinicia el bot: `node telegram-bot.js`

### Error "ZEP_API_KEY no configurada":
1. Ve a: https://dashboard.convex.dev
2. Settings → Environment Variables
3. Agrega: `ZEP_API_KEY = z_xxxxxx`

---

## 📋 Checklist de Prueba

- [ ] Bot responde a mensajes básicos
- [ ] Logs muestran "Memoria de Zep cargada"
- [ ] Bot recuerda tu nombre después de 5 mensajes
- [ ] Bot recuerda después de reiniciarse
- [ ] Bot puede analizar conversaciones pasadas
- [ ] Bot puede resumir lo que sabe de ti

---

## 🎉 Si Todo Funciona:

**¡Felicidades!** Ahora tienes un bot con memoria de largo plazo que:

✅ Nunca olvida lo que le dices  
✅ Aprende hechos automáticamente  
✅ Puede analizar todas tus conversaciones  
✅ Genera respuestas más contextuales  
✅ Es más rápido y económico  

---

## 📝 Comandos Útiles

```powershell
# Iniciar bot
node telegram-bot.js

# Test de conexión a Zep
node test-zep.js

# Deploy de Convex
npx convex dev

# Ver logs de Convex en tiempo real
# (ir al dashboard: https://dashboard.convex.dev)
```

---

## 💡 Pruebas Creativas

1. **Contador de gastos**: Dile que registre varios gastos, luego pregunta cuánto llevas
2. **Ideas de proyectos**: Cuéntale varias ideas, luego pídele que las resuma
3. **Preferencias**: Dile qué te gusta/disgusta, luego pregunta sobre tus gustos
4. **Contexto temporal**: Habla de planes a futuro, luego pregunta "¿qué teníamos planeado?"

---

**🚀 ¡Diviértete probando tu bot con superpoderes de memoria!**
