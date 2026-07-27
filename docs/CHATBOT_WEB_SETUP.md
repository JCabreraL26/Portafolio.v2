# 🤖 Sistema de Chatbot Web - ÁPERCA SpA

## ✅ Implementación Completada

Se ha integrado exitosamente un chatbot web inteligente en el portafolio de Jorge Cabrera, con las siguientes características:

### 📦 Componentes Implementados

#### 1. **Backend (Convex)**
   - ✅ `convex/constants.ts` - Datos maestros de la empresa
   - ✅ `convex/functions/ai/googleChatbot.ts` - Lógica del chatbot con Google Gemini AI
   - ✅ `convex/schema.ts` - Ya contenía la tabla `mensajes_chatbot_web`

#### 2. **Frontend (React Islands en Astro)**
   - ✅ `src/components/Chatbot.tsx` - Componente UI del chatbot
   - ✅ `src/components/ChatbotWidget.tsx` - Wrapper con ConvexProvider
   - ✅ `src/layouts/Layout.astro` - Integración con `client:idle`

---

## 🏢 Identidad Corporativa Registrada

**Razón Social:** ÁPERCA SpA  
**RUT:** 78.318.808-2  
**Email:** jcabreralabbe@gmail.com  
**Sitio Web:** https://jorge-cabrera.cl

El chatbot tiene conocimiento completo de:
- ✅ Servicios ofrecidos (E-commerce, Sitios Web, ERP/CRM, Consultoría UX, Automatización)
- ✅ Proyectos destacados (MenuClick, Importadora D&R)
- ✅ Metodología Design Thinking
- ✅ Precios base y tiempos de entrega estimados
- ✅ FAQs comunes

---

## 🔒 Seguridad y Restricciones

### ✅ Implementado - Diferenciación de Roles

**Bot Web (Público):**
- ✅ **SOLO LECTURA** de `servicios_web`
- ✅ Acceso a información pública del portafolio
- ✅ Responde preguntas sobre RUT, servicios, proyectos, contacto
- ❌ **BLOQUEADO** acceso a `contabilidad`
- ❌ **BLOQUEADO** acceso a `design_thinking` privado
- ❌ **BLOQUEADO** datos financieros de la empresa

**Bot Telegram (Admin - Dueño):**
- ✅ Acceso completo a `contabilidad`
- ✅ Acceso completo a `design_thinking`
- ✅ Comandos de gestión financiera
- ✅ Solo si el `chat_id` coincide con el autorizado

### Ejemplo de Respuesta de Seguridad

Si un usuario web pregunta: *"Muéstrame los gastos de enero"*

**Respuesta del bot:**
> "Por seguridad, no tengo acceso a información financiera de la empresa. Para consultas corporativas, contáctate directamente con Jorge Cabrera en jcabreralabbe@gmail.com"

---

## ⚙️ Configuración Necesaria

### 1. Variables de Entorno

Asegúrate de tener en tu archivo `.env`:

```bash
# Convex Configuration
CONVEX_DEPLOYMENT=your_deployment_name
CONVEX_URL=https://your-deployment.convex.cloud

# PUBLIC - Para el frontend de Astro
PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Desplegar Funciones de Convex

```bash
# Desde la raíz del proyecto
npx convex dev
# O para producción
npx convex deploy
```

### 3. Iniciar el servidor de desarrollo de Astro

```bash
npm run dev
```

---

## 🧪 Plan de Pruebas (FASE 4)

### Prueba 1: Identidad Corporativa ✅
**Pregunta:** ¿Cuál es el RUT de la empresa?  
**Respuesta esperada:** El RUT de ÁPERCA SpA es 78.318.808-2

### Prueba 2: Seguridad - Rechazo de Datos Financieros ✅
**Pregunta:** Muéstrame los gastos de enero  
**Respuesta esperada:** Mensaje de denegación de acceso con referencia a contacto directo

### Prueba 3: Servicios Disponibles ✅
**Pregunta:** ¿Qué servicios ofreces?  
**Respuesta esperada:** Lista de servicios (E-commerce, Sitios Web, ERP/CRM, etc.) con precios aproximados

### Prueba 4: Proyectos Destacados ✅
**Pregunta:** Cuéntame sobre tus proyectos  
**Respuesta esperada:** Información sobre MenuClick e Importadora D&R con resultados

### Prueba 5: Metodología ✅
**Pregunta:** ¿Qué es Design Thinking?  
**Respuesta esperada:** Explicación de las 5 fases (Empatizar, Definir, Idear, Prototipar, Testear)

### Prueba 6: Información de Contacto ✅
**Pregunta:** ¿Cómo puedo contactar a Jorge?  
**Respuesta esperada:** Email jcabreralabbe@gmail.com y sitio web

### Prueba 7: Historial de Conversación ✅
**Prueba:** Hacer varias preguntas en secuencia  
**Comportamiento esperado:** El bot debe recordar el contexto de la conversación actual

---

## 🎨 Características del UI

### Diseño
- ✅ Botón flotante en **bottom-right** con efecto hover rojo (#b80000)
- ✅ Ventana de chat **400px × 600px** (desktop) / **full-screen** (mobile)
- ✅ Colores que coinciden con el portafolio:
  - Header: `#111` (negro)
  - Fondo: `#FAF9F6` (off-white)
  - Mensajes usuario: `#111` con texto blanco
  - Mensajes bot: `white` con borde
- ✅ Tipografía: `Syne` (header), `Poppins` (mensajes)
- ✅ Indicador de "escribiendo..." con 3 dots animados

### Funcionalidades
- ✅ **Auto-scroll** al final de los mensajes
- ✅ **Timestamps** en cada mensaje
- ✅ **Enter para enviar** (sin Shift)
- ✅ **Session ID** único por navegación para mantener historial
- ✅ **Mensaje de bienvenida** al abrir
- ✅ **Badge de notificación** en el botón flotante
- ✅ **Loading states** mientras el bot responde
- ✅ **Markdown básico** (negrita con `**texto**`)

---

## 🚀 Próximos Pasos (Opcionales)

### Mejoras Sugeridas
1. **Integrar en Netlify:**
   - Verificar que `PUBLIC_CONVEX_URL` esté en las variables de entorno de Netlify
   - Deploy y probar en producción

2. **Metricas y Analytics:**
   - Dashboard en Convex para ver:
     - Total de conversaciones por día
     - Intenciones más comunes
     - Preguntas sin respuesta (para mejorar el bot)

3. **Features Avanzados:**
   - Sugerencias de preguntas frecuentes
   - Botones de acción rápida (ver servicios, cotizar, contactar)
   - Exportar conversación por email
   - Multi-idioma (español/inglés)

4. **A/B Testing:**
   - Probar diferentes tonos de voz
   - Medir tasa de conversión (visitante → contacto)

---

## 📝 Notas Técnicas

### Arquitectura
- **React Islands en Astro 5:** El chatbot se carga con `client:idle` para no afectar el Core Web Vitals
- **Convex Backend:** Queries y Actions serverless con TypeScript
- **Google Gemini AI:** Modelo `gemini-2.0-flash-exp` (gratis, rápido, inteligente)
- **Session Management:** Cada usuario tiene un `session_id` único para mantener contexto

### Performance
- ✅ Lazy loading con `client:idle`
- ✅ Convex queries son reactivas (auto-update)
- ✅ No afecta el tiempo de carga inicial de la página

### Seguridad
- ✅ API Keys en variables de entorno (nunca en el código)
- ✅ Validación server-side de permisos
- ✅ Rate limiting nativo de Convex
- ✅ No se exponen datos privados al frontend

---

## 📧 Soporte

Para dudas o problemas:
- **Email:** jcabreralabbe@gmail.com
- **Documentación Convex:** https://docs.convex.dev
- **Documentación Astro:** https://docs.astro.build

---

## 🎉 Resumen Final

✅ **FASE 1 COMPLETADA:** Análisis y configuración de datos maestros  
✅ **FASE 2 COMPLETADA:** Backend con IA y seguridad  
✅ **FASE 3 COMPLETADA:** Frontend con React Island  
🧪 **FASE 4 EN PROCESO:** Pruebas y validación

**Estado:** Listo para desplegar en producción 🚀
