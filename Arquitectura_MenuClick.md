# MenuClick - Arquitectura y Funcionalidades Completas

## 🎯 ¿Qué es MenuClick?

**MenuClick** es una plataforma SaaS white-label de e-commerce diseñada específicamente para negocios gastronómicos locales (pizzerías, sushi, restaurantes) que desean digitalizar sus ventas **sin pagar comisiones** a plataformas de delivery como UberEats, Rappi o PedidosYa.

### El Problema que Resolvemos

Los negocios locales enfrentan desafíos críticos:
- ❌ **Altas comisiones**: 20-30% por pedido en apps de delivery
- ❌ **Procesos manuales**: Tomar pedidos por WhatsApp uno por uno
- ❌ **Errores de comunicación**: Confusión sobre precios, opciones y disponibilidad
- ❌ **Sin presencia digital**: No tienen catálogo online visual y actualizado
- ❌ **Soluciones costosas**: Plataformas white-label que cuestan $500-2000 USD/mes

### Nuestra Solución

✅ **Catálogo digital profesional** con tu marca  
✅ **0% de comisión** - Los pedidos van directamente a tu WhatsApp Business  
✅ **Configuración en < 1 hora** - Deploy inmediato  
✅ **Panel de administración en vivo** - Gestiona precios y productos en tiempo real  
✅ **Personalización completa** - Toppings, tamaños, opciones especiales  
✅ **Costo fijo mensual** - Sin sorpresas ni comisiones variables  

---

## 🏆 Caso de Éxito: Más Pizza Ñuñoa

**Más Pizza Ñuñoa** es el primer cliente en producción, una pizzería artesanal en Santiago de Chile que opera exitosamente con MenuClick.

**Resultados:**
- ✅ Catálogo digital completo con 25+ productos
- ✅ Sistema de personalización con 20+ ingredientes
- ✅ Pedidos pre-formateados llegando directamente a WhatsApp
- ✅ Panel admin para gestionar precios en vivo
- ✅ 0% de comisión por pedido
- ✅ 100% mobile-responsive (80% del tráfico es móvil)

**URL de producción**: `mas-pizza-nunoa.netlify.app`

---

## 🎨 Funcionalidades para el Cliente Final

### 1. **Catálogo Digital Completo**

El cliente navega por un catálogo profesional organizado por categorías:

**Categorías disponibles:**
- 🍕 **Promociones** - Ofertas especiales
- 🍕 **Las de Siempre** - Pizzas clásicas
- 🍕 **Especiales** - Pizzas premium
- 🍟 **Acompañamientos** - Papas, salsas, entradas
- 🥤 **Bebidas** - Bebidas y jugos

**Cada producto muestra:**
- Imagen de alta calidad
- Nombre y descripción
- Precio actual
- Precio anterior (si hay descuento)
- Indicador de disponibilidad
- Botón de acción rápida

### 2. **Sistema de Personalización Avanzado**

El sistema distingue entre **dos tipos de personalización**:

#### 🔴 **Quitar Ingredientes Base** (Sin costo)

El cliente puede **quitar** ingredientes que ya vienen incluidos en el precio:

**Ejemplo:** Pizza Margherita
- ✅ Queso Mozzarella (incluido)
- ✅ Salsa de Tomate (incluida)
- ✅ Albahaca Fresca (incluida)
- ✅ Aceite de Oliva (incluido)

**Visual:**
- Checkboxes marcados por defecto
- Cliente desmarca para quitar
- Ingrediente quitado: gris, tachado, opacidad 50%
- **No cambia el precio**

#### 🟢 **Agregar Ingredientes Extra** (Con costo adicional)

El cliente puede **agregar** ingredientes extra con precio adicional:

**Extras disponibles (ejemplo):**
- 🥓 Tocino (+$1.500)
- 🍄 Champiñones (+$1.000)
- 🧀 Extra Queso (+$1.200)
- 🌶️ Jalapeños (+$800)
- 🍅 Tomates Cherry (+$900)
- 🫒 Aceitunas (+$1.000)
- 🧄 Ajo (+$500)

**Visual:**
- Checkboxes vacíos por defecto
- Cliente marca para agregar
- Muestra precio claramente
- **Precio se actualiza en tiempo real**

#### 📦 **Acompañamientos y Bebidas**

Desde la misma página de producto, el cliente puede agregar:

**Acompañamientos sugeridos:**
- 🍟 Papas Fritas Caseras
- 🥖 Pan de Ajo
- 🥗 Ensalada César
- 🧄 Salsa de Ajo

**Bebidas sugeridas:**
- 🥤 Coca-Cola 1.5L
- 🍊 Fanta 1.5L
- 💧 Agua Mineral
- 🍷 Vino de la Casa

Cada acompañamiento/bebida muestra su precio y se suma al total.

#### 🔢 **Selector de Cantidad**

- **Controles táctiles grandes** (+/-)
- Mínimo: 1 unidad
- Máximo: 99 unidades
- Cantidad se multiplica por precio total

#### 💰 **Cálculo de Precio en Tiempo Real**

El precio se actualiza automáticamente mientras el cliente personaliza:

```
Precio Base:        $9.990
+ Extra Tocino:     $1.500
+ Extra Queso:      $1.200
+ Champiñones:      $1.000
─────────────────────────────
Subtotal:          $13.690
× Cantidad: 2
─────────────────────────────
Total:             $27.380
```

### 3. **Carrito de Compras Inteligente**

El carrito muestra:

**Por cada producto:**
- Imagen miniatura
- Nombre del producto
- Cantidad
- Personalizaciones:
  - ✅ Ingredientes incluidos (mantenidos)
  - ➖ Ingredientes quitados (tachados en gris)
  - ➕ Ingredientes extra agregados (con precio)
- Acompañamientos/bebidas agregadas
- Precio unitario
- Precio total por línea

**Resumen del carrito:**
- Subtotal de productos
- Cantidad total de items
- Botón "Ir a Pagar"
- Botón "Seguir Comprando"

**Funcionalidades:**
- ✏️ Editar cantidad desde el carrito
- 🗑️ Eliminar items
- 💾 Persistencia en localStorage (no se pierde al cerrar navegador)

### 4. **Checkout y Flujo WhatsApp**

#### 📋 **Formulario de Datos del Cliente**

**Campos requeridos:**
- 👤 Nombre completo
- 📱 Teléfono (con validación de formato chileno)
- 📍 Dirección de entrega (si es delivery)
- 💳 Método de pago:
  - Efectivo (se especifica monto para cambio)
  - Transferencia (muestra datos bancarios)
- 📝 Notas adicionales (opcional)

**Opciones de entrega:**
- 🛵 **Delivery** - Con costo de envío ($1.500)
- 🏪 **Retiro en local** - Sin costo de envío

#### 📱 **Mensaje WhatsApp Pre-formateado**

Al confirmar, se abre WhatsApp con el siguiente mensaje automático:

```
🍕 *NUEVO PEDIDO - MÁS PIZZA ÑUÑOA*

━━━━━━━━━━━━━━━━━━━━━━
👤 *DATOS DEL CLIENTE*
Nombre: Juan Pérez
Teléfono: +56 9 1234 5678
Dirección: Av. Irarrázaval 2345, Ñuñoa

━━━━━━━━━━━━━━━━━━━━━━
🛒 *DETALLE DEL PEDIDO*

1× Pizza Margherita Familiar
   ➖ Sin Albahaca
   ➕ Extra Tocino (+$1.500)
   ➕ Champiñones (+$1.000)
   Subtotal: $13.690

1× Papas Fritas Caseras
   Subtotal: $3.500

1× Coca-Cola 1.5L
   Subtotal: $2.500

━━━━━━━━━━━━━━━━━━━━━━
💰 *RESUMEN*
Subtotal: $19.690
Delivery: $1.500
━━━━━━━━━━━━━━━━━━━━━━
*TOTAL: $21.190*

━━━━━━━━━━━━━━━━━━━━━━
💳 *MÉTODO DE PAGO*
Transferencia

Datos para transferencia:
Banco: Banco de Chile
Tipo: Cuenta Corriente
Cuenta: 123456789
Nombre: Más Pizza Ñuñoa SpA
RUT: 76.XXX.XXX-X
Email confirmación: pizza@maspizza.cl

━━━━━━━━━━━━━━━━━━━━━━
📝 *NOTAS ADICIONALES*
Por favor, sin cebolla en ninguna pizza

━━━━━━━━━━━━━━━━━━━━━━
Pedido generado desde maspizza.cl
Número de orden: MP-LA5K9Q2X
```

**Ventajas de este sistema:**
- ✅ Cliente ve exactamente qué está pidiendo antes de enviar
- ✅ Negocio recibe pedido completo y estructurado
- ✅ Cero posibilidad de confusión
- ✅ Rastro del pedido vía chat de WhatsApp
- ✅ Cliente puede editar antes de enviar final

### 5. **Experiencia Mobile-First**

**80% de los usuarios acceden desde móvil**, por eso todo está optimizado:

- 📱 Diseño responsive perfecto en todos los dispositivos
- 👆 Botones grandes y táctiles
- 🔄 Scrolling suave
- ⚡ Carga rápida (< 2 segundos)
- 🎨 Imágenes optimizadas
- 📍 Sticky header con carrito siempre visible
- 🔘 Sticky footer con botón "Agregar al Carrito"

### 6. **Navegación Intuitiva**

```
Flujo del cliente:

Home (Catálogo)
    ↓ Click en producto
Página de Personalización
    ↓ Personalizar + Agregar al carrito
Carrito de Compras
    ↓ Revisar pedido
Checkout (Formulario)
    ↓ Completar datos
WhatsApp (Enviar pedido)
    ↓ Confirmar con el negocio
```

**Header sticky incluye:**
- 🏠 Logo/Nombre del negocio
- 🛒 Icono de carrito con badge de cantidad
- 📞 Enlace directo a WhatsApp

**Footer incluye:**
- 📱 Redes sociales
- 📍 Dirección del local
- 🕒 Horarios de atención
- 📧 Contacto

---

## 👨‍💼 Panel de Administración

El panel admin es **la joya de la corona** de MenuClick. Permite al dueño del negocio gestionar todo sin tocar código ni llamar a un desarrollador.

### 🔐 **Sistema de Autenticación**

**Acceso seguro:**
- Email + Password (Convex Auth)
- Roles: owner, admin, staff
- Multi-tenant (cada cliente solo ve sus datos)
- Sesiones persistentes
- Logout seguro

**URL de acceso:** `/admin/login`

### 📊 **Dashboard Principal**

Al entrar, el admin ve:

#### 📈 **Estadísticas del Día en Tiempo Real**

```
┌────────────────────────────────────────┐
│  📦 PEDIDOS HOY                        │
│  Total: 23 pedidos                     │
│  Activos: 8                            │
│  Completados: 15                       │
│                                        │
│  💰 VENTAS HOY                         │
│  Total: $457.890                       │
│  Promedio: $19.912 por pedido          │
│                                        │
│  ⏱️ ESTADO ACTUAL                      │
│  En espera: 3                          │
│  En preparación: 4                     │
│  Listos: 1                             │
└────────────────────────────────────────┘
```

#### 📦 **Gestión de Pedidos en Vivo**

**Pedidos Activos:**

Cada pedido muestra:
- 🕐 Hora de recepción
- 📱 Número de orden (ej: MP-LA5K9Q2X)
- 👤 Nombre del cliente
- 📞 Teléfono (click para llamar)
- 📍 Dirección de entrega
- 💳 Método de pago
- 💰 Total del pedido
- 📝 Items del pedido con detalles
- 🏷️ Estado actual

**Estados posibles:**
1. ⏳ **Pendiente** - Recién recibido
2. ✅ **Confirmado** - Negocio aceptó el pedido
3. 👨‍🍳 **En preparación** - Cocinando
4. ✅ **Listo** - Para despachar/retirar
5. 🚚 **Entregado** - Completado
6. ❌ **Cancelado** - No se completó

**Acciones rápidas:**
- 🔄 Cambiar estado con un click
- 💳 Marcar como pagado/no pagado
- 📞 Click-to-call al cliente
- 📍 Ver dirección en mapa
- ❌ Cancelar pedido

**Pedidos Completados del Día:**

Vista histórica con:
- Todos los pedidos entregados/cancelados
- Métricas de tiempo de preparación
- Historial de pagos
- Total de ingresos

### 🍕 **Gestión de Productos**

El admin puede gestionar productos organizados por categorías:

#### **Vista por Categoría**

```
🍕 PIZZAS - LAS DE SIEMPRE
├─ Pizza Margherita         $9.990  ✅ Disponible  [ Editar ] [ 🚫 Desactivar ]
├─ Pizza Pepperoni          $11.500 ✅ Disponible  [ Editar ] [ 🚫 Desactivar ]
├─ Pizza Hawaiana           $11.990 ⛔ No disponible  [ Editar ] [ ✅ Activar ]
└─ Pizza Napolitana         $10.990 ✅ Disponible  [ Editar ] [ 🚫 Desactivar ]

🍕 PIZZAS - ESPECIALES
├─ Pizza 4 Quesos           $13.990 ✅ Disponible  [ Editar ] [ 🚫 Desactivar ]
└─ Pizza Serrano            $15.990 ✅ Disponible  [ Editar ] [ 🚫 Desactivar ]

🍟 ACOMPAÑAMIENTOS
├─ Papas Fritas Caseras     $3.500  ✅ Disponible  [ Editar ] [ 🚫 Desactivar ]
└─ Pan de Ajo               $2.500  ✅ Disponible  [ Editar ] [ 🚫 Desactivar ]

🥤 BEBIDAS
├─ Coca-Cola 1.5L           $2.500  ✅ Disponible  [ Editar ] [ 🚫 Desactivar ]
└─ Fanta 1.5L               $2.500  ✅ Disponible  [ Editar ] [ 🚫 Desactivar ]
```

#### **Edición de Precios en Vivo**

**Flujo rápido:**
1. Click en "Editar" junto a producto
2. Modal aparece con precio actual
3. Escribir nuevo precio
4. Click en "Actualizar"
5. ✅ **Cambio reflejado instantáneamente** en el sitio web

**Ejemplo:**
```
┌─────────────────────────────────┐
│  Editar Precio                  │
│                                 │
│  Pizza Margherita               │
│                                 │
│  Precio actual: $9.990          │
│                                 │
│  Nuevo precio:                  │
│  [ 10990        ]               │
│                                 │
│  [ Cancelar ] [ ✅ Actualizar ] │
└─────────────────────────────────┘
```

**Casos de uso:**
- ⚡ Subir precios por inflación
- 🎉 Crear promociones (bajar precio temporalmente)
- 💰 Ajustar márgenes en tiempo real
- 🎯 Hacer A/B testing de precios

#### **Gestión de Disponibilidad**

**Activar/Desactivar productos:**
- Un simple botón toggle
- Producto desactivado = no aparece en el catálogo
- Útil para:
  - 🚫 Ingredientes agotados
  - 📅 Productos de temporada
  - ⏰ Productos solo disponibles en ciertos horarios

#### **Gestión de Imágenes**

**Subir/Cambiar imágenes de productos:**

**Flujo:**
1. Click en icono de cámara 📷
2. Seleccionar imagen desde galería
3. Upload automático a Convex Storage
4. ✅ Imagen se muestra inmediatamente en el catálogo

**Características:**
- ☁️ Almacenamiento incluido en Convex
- 🗜️ Optimización automática
- 🖼️ Formato: JPG, PNG, WebP
- 📏 Tamaño recomendado: 800x800px
- 🔄 Reemplazo en caliente sin downtime
- 🗑️ Opción de eliminar imagen

**Vista previa en línea:**
```
┌─────────────────────────────┐
│  🍕 Pizza Margherita        │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   [  Imagen Pizza  ]  │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  [ 📷 Cambiar Imagen ]      │
│  [ 🗑️ Eliminar Imagen ]     │
└─────────────────────────────┘
```

### 🧀 **Gestión de Toppings (Ingredientes)**

El admin puede gestionar la lista maestra de toppings:

**Vista de toppings:**
```
🧀 TOPPINGS DISPONIBLES

Quesos:
├─ Mozzarella            $0     ✅ Disponible  [ Editar ]
├─ Parmesano             $1.500 ✅ Disponible  [ Editar ]
└─ Queso Azul            $2.000 ⛔ No disponible  [ Editar ]

Carnes:
├─ Pepperoni             $1.500 ✅ Disponible  [ Editar ]
├─ Jamón                 $1.200 ✅ Disponible  [ Editar ]
├─ Tocino                $1.500 ✅ Disponible  [ Editar ]
└─ Pollo                 $1.500 ✅ Disponible  [ Editar ]

Vegetales:
├─ Tomate                $0     ✅ Disponible  [ Editar ]
├─ Champiñones           $1.000 ✅ Disponible  [ Editar ]
├─ Pimentón              $800   ✅ Disponible  [ Editar ]
└─ Aceitunas             $1.000 ✅ Disponible  [ Editar ]

Especiales:
├─ Piña                  $1.000 ⛔ No disponible  [ Editar ]
└─ Jalapeños             $800   ✅ Disponible  [ Editar ]
```

**Acciones sobre toppings:**
- ✏️ Editar precio
- 🚫/✅ Activar/Desactivar disponibilidad
- ➕ Agregar nuevo topping
- 🗑️ Eliminar topping

**Flujo de edición:**
1. Click en "Editar"
2. Modal con nombre y precio
3. Cambiar precio (ej: de $1.000 a $1.200)
4. Guardar
5. ✅ Todos los productos que usan ese topping se actualizan

**Ventaja:** Un topping se edita en un solo lugar y afecta a todos los productos que lo usan.

### 📊 **Reportes y Analytics**

**Métricas disponibles:**

📈 **Ventas:**
- Total del día/semana/mes
- Promedio por pedido
- Ticket promedio
- Evolución de ventas (gráfico)

📦 **Pedidos:**
- Cantidad por día/semana/mes
- Tiempo promedio de preparación
- Tasa de cancelación
- Horarios pico

🍕 **Productos:**
- Más vendidos
- Menos vendidos
- Productos sin ventas (candidatos a eliminar)
- Combinaciones más comunes

💰 **Pagos:**
- % Efectivo vs Transferencia
- Pedidos pagados/pendientes
- Monto promedio por método

🧀 **Toppings:**
- Extras más pedidos
- Ingredientes más quitados
- Combinaciones populares

### 🔔 **Notificaciones en Tiempo Real**

**El panel admin actualiza automáticamente (sin refresh) cuando:**
- ✅ Llega un nuevo pedido
- 💰 Se completa un pago
- 📊 Cambian las estadísticas del día
- 🔄 Otro admin modifica datos

**Tecnología:** Convex Real-time Subscriptions (WebSocket)

---

## 🏗️ Arquitectura Técnica

### **Stack Tecnológico Completo**

#### **Frontend**
- ⚡ **Next.js 14** - React Framework con App Router
- ⚛️ **React 18** - UI Library
- 🎨 **Tailwind CSS** - Utility-first styling
- 🎨 **CSS Variables** - Theming dinámico
- 📦 **Zustand** - State management (carrito)
- 🔔 **React Toasts** - Notificaciones

#### **Backend**
- 🗄️ **Convex** - Backend-as-a-Service
  - Queries en tiempo real
  - Mutations serverless
  - WebSocket automático
  - Storage para imágenes
  - Búsqueda full-text
- 🔐 **@convex-dev/auth** - Autenticación
  - Password-based auth
  - Multi-tenant support
  - Role-based access

#### **Monorepo**
- 📦 **Turborepo** - Build system
- 📦 **pnpm** - Package manager
- 🔧 **TypeScript** - Strict mode
- ✅ **Vitest** - Testing

#### **Deploy & Hosting**
- 🚀 **Netlify** - Frontend hosting
  - Deploy automático desde Git
  - Preview deployments
  - Custom domains
  - CDN global
- ☁️ **Convex Cloud** - Backend hosting
  - Free tier generoso
  - Escalado automático
  - Backups diarios

### **Arquitectura de Monorepo**

```
menuclick/
│
├── apps/
│   ├── template/                    # 🏗️ Template base (golden source)
│   │   ├── app/
│   │   │   ├── page.tsx            # 🏠 Home con grid de productos
│   │   │   ├── layout.tsx          # 🎨 Layout con theming dinámico
│   │   │   ├── producto/[slug]/
│   │   │   │   └── page.tsx        # 🍕 Página de personalización
│   │   │   ├── carrito/
│   │   │   │   └── page.tsx        # 🛒 Carrito de compras
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx        # 💳 Checkout + WhatsApp
│   │   │   └── admin/
│   │   │       ├── login/page.tsx  # 🔐 Login admin
│   │   │       └── page.tsx        # 👨‍💼 Panel admin completo
│   │   ├── components/
│   │   │   ├── Header.tsx          # 🎯 Header con carrito
│   │   │   ├── Footer.tsx          # 📄 Footer
│   │   │   ├── ProductGrid.tsx     # 🔲 Grid de productos
│   │   │   ├── CategorySection.tsx # 📂 Sección por categoría
│   │   │   └── WhatsAppFloat.tsx   # 💬 Botón flotante WhatsApp
│   │   └── config/
│   │       └── theme.config.ts     # ⚙️ Configuración del cliente
│   │
│   └── clients/
│       └── mas-pizza-nunoa/         # 🍕 Cliente #1 en producción
│           ├── [misma estructura]
│           ├── config/theme.config.ts  # clientId: 'mas-pizza-nunoa'
│           └── public/
│               └── Mas-Pizza-Logo.png
│
├── packages/
│   ├── ui/                          # 🎨 Design System (18 componentes)
│   │   └── src/
│   │       ├── Button.tsx
│   │       ├── ProductCard.tsx
│   │       ├── ToppingGrid.tsx
│   │       ├── ToppingSelector.tsx
│   │       ├── AccompanimentGrid.tsx
│   │       ├── QuantitySelector.tsx
│   │       ├── CartItem.tsx
│   │       ├── CartSummary.tsx
│   │       ├── CheckoutForm.tsx
│   │       ├── OrderSummary.tsx
│   │       ├── PriceDisplay.tsx
│   │       ├── WhatsAppButton.tsx
│   │       ├── Toast.tsx
│   │       └── ... (más componentes)
│   │
│   ├── core/                        # 🧠 Lógica de negocio
│   │   └── src/
│   │       ├── lib/
│   │       │   ├── cart.ts         # 🛒 Zustand store del carrito
│   │       │   ├── pricing.ts      # 💰 Cálculos de precios
│   │       │   ├── whatsapp.ts     # 📱 Formateo de mensajes
│   │       │   └── toast.ts        # 🔔 Sistema de notificaciones
│   │       └── types/
│   │           └── index.ts        # 📋 TypeScript interfaces
│   │
│   └── convex-db/                   # 🗄️ Backend Convex
│       ├── convex/
│       │   ├── schema.ts           # 📐 Schema de base de datos
│       │   ├── auth.ts             # 🔐 Autenticación
│       │   ├── products.ts         # 📦 Queries de productos
│       │   ├── productsMutations.ts # ✏️ Mutations de productos
│       │   ├── toppings.ts         # 🧀 Queries de toppings
│       │   ├── orders.ts           # 📋 Queries de órdenes
│       │   ├── ordersMutations.ts  # ✏️ Mutations de órdenes
│       │   ├── categories.ts       # 📂 Queries de categorías
│       │   └── files.ts            # 📷 Upload de imágenes
│       └── convex.json
│
└── docs/                            # 📚 Documentación completa
```

### **Base de Datos Multi-tenant**

**Schema Convex:**

```typescript
// Todas las tablas tienen clientId para aislamiento

storeConfigs {
  clientId: string                   // 'mas-pizza-nunoa'
  storeName: string
  logo: string
  primaryColor: string
  whatsappNumber: string
  deliveryFee: number
  isActive: boolean
}

categories {
  clientId: string
  name: string                       // 'Promociones'
  slug: string                       // 'promociones'
  order: number
  isActive: boolean
}

products {
  clientId: string
  categoryId: Id<categories>
  name: string                       // 'Pizza Margherita'
  slug: string                       // 'pizza-margherita'
  description: string
  imageUrl: string
  imageStorageId: Id<_storage>
  price: number                      // 9990 (en pesos)
  compareAtPrice: number             // 11990 (precio antes de descuento)
  isAvailable: boolean               // Toggle en admin
  hasToppings: boolean
  defaultToppings: Id<toppings>[]    // [id1, id2, id3]
  availableExtras: Id<toppings>[]    // [id4, id5, id6]
  order: number
}

toppings {
  clientId: string
  name: string                       // 'Mozzarella'
  price: number                      // 0 (si es gratis) o 1500
  isAvailable: boolean               // Toggle en admin
  category: string                   // 'quesos', 'carnes', 'vegetales'
  order: number
}

orders {
  clientId: string
  orderNumber: string                // 'MP-LA5K9Q2X'
  customerName: string
  customerPhone: string
  customerEmail: string?
  deliveryAddress: string?
  items: [{
    productId: Id<products>
    productName: string
    quantity: number
    price: number
    toppings: [{
      toppingId: Id<toppings>
      toppingName: string
      price: number
    }]
    notes: string?
  }]
  subtotal: number
  deliveryFee: number
  discount: number?
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  paymentMethod: 'cash' | 'transfer' | 'whatsapp'
  paymentStatus: 'pending' | 'paid'
  notes: string?
  createdAt: number
  updatedAt: number
}

businessUsers {
  userId: Id<users>
  clientId: string
  email: string
  name: string
  role: 'owner' | 'admin' | 'staff'
  isActive: boolean
}
```

**Índices para performance:**
- `by_clientId` - Todas las queries filtran por cliente
- `by_clientId_available` - Productos disponibles
- `by_category` - Productos por categoría
- `by_clientId_active` - Categorías activas

### **Sistema de Configuración Multi-tenant**

Cada cliente tiene un archivo `theme.config.ts`:

```typescript
export const themeConfig = {
  // Identificador único (aislamiento de datos)
  clientId: 'mas-pizza-nunoa',

  // Branding
  brand: {
    name: 'Más Pizza Ñuñoa',
    tagline: 'Las mejores pizzas artesanales de Ñuñoa',
    logo: '/Mas-Pizza-Logo-Header.png',
    colors: {
      primary: '#EF4444',      // Rojo pizza
      secondary: '#FCD34D',    // Amarillo queso
      accent: '#16A34A',       // Verde albahaca
    },
  },

  // Contacto
  contact: {
    whatsapp: '+56976955978',
    phone: '+56 9 7695 5978',
    email: 'contacto@maspizzanunoa.cl',
    address: 'Av. Irarrázaval 2345, Ñuñoa, Santiago',
  },

  // Delivery
  delivery: {
    enabled: true,
    fee: 1500,
    freeAbove: 25000,
    estimatedTime: '45-60 minutos',
  },

  // Pickup
  pickup: {
    enabled: true,
    estimatedTime: '30-40 minutos',
  },

  // Transferencia
  transfer: {
    bank: 'Banco de Chile',
    accountType: 'Cuenta Corriente',
    accountNumber: '123456789',
    accountName: 'Más Pizza Ñuñoa SpA',
    rut: '76.XXX.XXX-X',
    email: 'pizza@maspizza.cl',
  },

  // Features
  features: {
    showPrices: true,
    enableToppings: true,
    enableLoyalty: false,
    enableCoupons: false,
  },

  // SEO
  seo: {
    title: 'Más Pizza Ñuñoa - Las mejores pizzas artesanales',
    description: 'Pizzas artesanales con ingredientes frescos...',
    keywords: 'pizza, delivery, ñuñoa, santiago',
  },
};
```

**Ventaja:** Crear un nuevo cliente = copiar carpeta + cambiar `theme.config.ts` en < 15 minutos.

### **Sistema de Theming Dinámico**

Los colores del `theme.config.ts` se inyectan como CSS variables:

```css
:root {
  --color-primary: #EF4444;
  --color-secondary: #FCD34D;
  --color-accent: #16A34A;
}
```

**Todos los componentes usan estas variables:**
```tsx
<button className="bg-primary hover:bg-primary/90">
  Agregar al Carrito
</button>
```

**Resultado:** Cambiar marca completa = cambiar 3 líneas de config.

---

## 🚀 Proceso de Onboarding de Nuevo Cliente

### **Timeline: < 1 hora de configuración**

#### **1. Crear Cliente (15 min)**

```bash
# Duplicar template
cd clients/
cp -r ../apps/template nuevo-cliente/

# Configurar branding
cd nuevo-cliente/config/
# Editar theme.config.ts
clientId: 'nuevo-cliente'
brand.name: 'Pizza Express'
brand.colors.primary: '#FF6B00'
contact.whatsapp: '+56912345678'
```

#### **2. Seed de Datos Iniciales (20 min)**

**Crear categorías:**
- Promociones
- Pizzas Clásicas
- Pizzas Premium
- Acompañamientos
- Bebidas

**Crear productos base (ejemplo 20 productos):**
- 12 Pizzas con descripciones
- 5 Acompañamientos
- 3 Bebidas

**Crear toppings (ejemplo 20 ingredientes):**
```javascript
await ctx.db.insert('toppings', {
  clientId: 'nuevo-cliente',
  name: 'Mozzarella',
  price: 0,
  category: 'quesos',
  isAvailable: true,
  order: 1
});
// ... más toppings
```

#### **3. Subir Imágenes (15 min)**

- Logo del negocio
- 10-20 fotos de productos
- Placeholder genérico

**Convex Storage hace el resto automáticamente.**

#### **4. Deploy a Producción (10 min)**

```bash
# Conectar a Netlify
netlify init

# Deploy
pnpm build
netlify deploy --prod
```

**URL generada:** `nuevo-cliente.netlify.app`

#### **5. Crear Usuario Admin (5 min)**

1. Ir a `/admin/login`
2. Sign Up con email del dueño
3. ✅ Listo para usar

**Total: ~1 hora → Cliente operando en producción**

---

## 📈 Ventajas Competitivas

### **vs. Apps de Delivery (UberEats, Rappi, PedidosYa)**

| Característica | MenuClick | Apps de Delivery |
|----------------|---------------|------------------|
| **Comisión por pedido** | 0% | 20-30% |
| **Costo mensual** | Fijo (~$50 USD) | Variable (puede ser $0 o $1000+) |
| **Marca propia** | ✅ 100% | ❌ compartida |
| **Control de datos** | ✅ Completo | ❌ Limitado |
| **Personalización** | ✅ Completa | ❌ Muy limitada |
| **Admin panel** | ✅ Incluido | ⚠️ Limitado |
| **Relación con cliente** | ✅ Directa (WhatsApp) | ❌ Intermediada |

**Ejemplo económico:**

```
Negocio con 100 pedidos/mes promedio $15.000

Con Apps de Delivery (25% comisión):
- Ventas: $1.500.000
- Comisión: -$375.000
- Neto: $1.125.000

Con MenuClick:
- Ventas: $1.500.000
- Costo plataforma: -$50.000
- Neto: $1.450.000

Ahorro: $325.000/mes = $3.900.000/año
```

### **vs. Soluciones White-Label Existentes**

| Característica | MenuClick | Competidores |
|----------------|---------------|--------------|
| **Costo setup** | ~$500 | $2.000 - $10.000 |
| **Costo mensual** | $50 | $200 - $2.000 |
| **Tiempo de setup** | < 1 hora | 1-4 semanas |
| **Personalización** | ✅ Código abierto | ⚠️ Limitada |
| **Soporte técnico** | Incluido | Extra |
| **Hosting** | Incluido | Extra |
| **Updates** | Automático | Manual/Extra |

### **vs. Desarrollar desde Cero**

| Característica | MenuClick | Desarrollo Custom |
|----------------|---------------|-------------------|
| **Costo inicial** | ~$500 | $10.000 - $50.000 |
| **Tiempo** | 1 hora | 3-6 meses |
| **Mantenimiento** | Incluido | $500-2000/mes |
| **Actualizaciones** | Automático | Manual |
| **Bugs/Soporte** | Incluido | Desarrollador externo |

---

## 🎯 Modelo de Negocio

### **Pricing Propuesto**

#### **Plan Básico - $49 USD/mes**
- ✅ Catálogo ilimitado de productos
- ✅ Hasta 3 categorías
- ✅ Panel de administración completo
- ✅ Pedidos por WhatsApp
- ✅ Personalización de marca
- ✅ Hosting y dominio incluido
- ✅ Soporte por email

#### **Plan Profesional - $99 USD/mes**
- ✅ Todo lo del Plan Básico
- ✅ Categorías ilimitadas
- ✅ Sistema de toppings avanzado
- ✅ Reportes y analytics
- ✅ Múltiples usuarios admin
- ✅ Integraciones (Mercadopago próximamente)
- ✅ Soporte prioritario

#### **Plan Enterprise - Custom**
- ✅ Todo lo del Plan Profesional
- ✅ Multi-tienda (franquicias)
- ✅ API custom
- ✅ Desarrollo de features custom
- ✅ Soporte 24/7
- ✅ SLA garantizado

### **Setup Fee (una vez)**
- $500 USD - Incluye:
  - Configuración inicial completa
  - Migración de catálogo existente
  - Subida de imágenes (hasta 50)
  - Capacitación admin panel (1 hora)
  - 1 mes gratis de suscripción

### **Add-ons Opcionales**
- 📸 Fotografía profesional de productos: $300-500
- ✍️ Copywriting de descripciones: $200
- 📱 Gestión de redes sociales: $150/mes
- 📊 Consultoría de marketing digital: $100/hora

---

## 🔮 Roadmap de Funcionalidades

### **En Desarrollo (Q1 2026)**
- ✅ Panel admin mejorado con más métricas
- ✅ Integración Mercadopago (pago online)
- ✅ Sistema de cupones y descuentos
- ✅ Programa de lealtad (puntos)

### **Planeado (Q2 2026)**
- 📱 App móvil nativa (React Native)
- 🔔 Notificaciones push
- 📊 Dashboard analytics avanzado
- 🎨 Temas visuales predefinidos
- 🌐 Multi-idioma (inglés/español)

### **Futuro (Q3-Q4 2026)**
- 🏪 Multi-tienda (franquicias)
- 👥 Sistema de empleados/turnos
- 📦 Integración con POS
- 🚗 Tracking de delivery en vivo
- 💬 Chat integrado en el sitio
- 🤖 Chatbot para WhatsApp Business API

---

## 📊 Casos de Uso Adicionales

MenuClick no es solo para pizzerías. Funciona para:

### **🍱 Restaurantes y Comida Rápida**
- Sushi delivery
- Hamburguesas
- Comida saludable
- Empanadas
- Coffee shops

### **🛒 Minimarkets y Almacenes**
- Despensas locales
- Fruterías
- Carnicerías
- Panaderías

### **🌸 Otros Negocios Locales**
- Floristerías
- Tiendas de mascotas
- Farmacias independientes
- Licorerías

**Ventaja:** El sistema es flexible y se adapta 100% a cada vertical.

---

## 🎬 Material para Video Promocional

### **Estructura Sugerida (60-90 segundos)**

**[0-10s] Hook + Problema:**
```
"¿Sabías que UberEats y Rappi se quedan con hasta 30% de cada pedido?
MenuClick te devuelve el 100% de tus ventas."
```

**[10-25s] Solución - Vista del Cliente:**
```
Muestra móvil navegando por maspizza.cl:
- Catálogo visual
- Personalizar pizza (quitar/agregar ingredientes)
- Precio actualizándose en tiempo real
- Agregar al carrito
- Ver carrito completo
```

**[25-40s] Solución - Vista del Admin:**
```
Muestra panel de admin:
- Dashboard con estadísticas
- Cambiar precio de producto en 5 segundos
- Ver pedidos en vivo
- Cambiar estado de pedido
```

**[40-55s] Flujo WhatsApp:**
```
- Cliente completa checkout
- Mensaje pre-formateado en WhatsApp
- Dueño recibe pedido perfecto
- Confirma en segundos
```

**[55-65s] Beneficios:**
```
✅ 0% de comisión
✅ Setup en < 1 hora
✅ Control total de tu negocio
✅ Desde $49/mes
```

**[65-75s] Prueba Social:**
```
"Más Pizza Ñuñoa ya está usando MenuClick
Ahorra $300.000+ al mes en comisiones"
```

**[75-90s] Call to Action:**
```
Visita menuclick.com
Prueba gratis por 14 días
💬 WhatsApp: +56 9 XXXX XXXX
```

### **Recursos Visuales Necesarios:**

**Grabaciones de pantalla:**
- ✅ Navegación móvil por catálogo (15s)
- ✅ Personalización de pizza (10s)
- ✅ Panel admin (15s)
- ✅ Flujo WhatsApp (10s)

**Assets gráficos:**
- Logo MenuClick
- Screenshots de panel admin
- Mockups móvil/desktop
- Íconos de features
- Comparativa de precios (gráfico)

**Testimonios:**
- Quote del dueño de Más Pizza
- Métricas de ahorro

---

## 🎨 Material para Sitio Web de Ventas

### **Landing Page Structure**

#### **Hero Section**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│   Tu Propio E-Commerce en Menos de 1 Hora         │
│   Sin Comisiones. Sin Intermediarios.             │
│                                                    │
│   [Mockup de iPhone mostrando mas-pizza.cl]       │
│                                                    │
│   [💬 Agendar Demo] [🚀 Empezar Gratis]           │
│                                                    │
└────────────────────────────────────────────────────┘
```

#### **Problema/Solución**
- Comparativa visual: Apps de Delivery vs MenuClick
- Cálculo de ahorro interactivo

#### **Features Destacadas (con íconos)**
- 🍕 Catálogo Digital Profesional
- 🎨 Personalización Completa
- 💰 Panel Admin en Tiempo Real
- 📱 Pedidos por WhatsApp
- 📊 Reportes y Analytics
- ☁️ Todo en la Nube

#### **Demo Interactiva**
- iframe de maspizza.cl funcionando
- "Prueba hacer un pedido"

#### **Caso de Éxito**
- Quote de Más Pizza Ñuñoa
- Métricas visuales
- Link al sitio en producción

#### **Pricing**
- Tabla de planes clara
- Calculadora de ROI

#### **FAQ**
- ¿Cuánto tiempo toma configurar?
- ¿Necesito conocimientos técnicos?
- ¿Qué pasa con mis datos?
- ¿Puedo cambiar de plan?
- etc.

#### **CTA Final**
```
┌────────────────────────────────────────────────────┐
│  Comienza a Ahorrar en Comisiones Hoy             │
│  [📱 +56 9 XXXX XXXX]                             │
│  [✉️ hola@menuclick.com]                       │
│  [🚀 Solicitar Demo Gratis]                       │
└────────────────────────────────────────────────────┘
```

---

## 📞 Contacto y Soporte

### **Para Nuevos Clientes:**
- 🌐 **Website**: menuclick.com (próximamente)
- 📱 **WhatsApp**: +56 9 XXXX XXXX
- ✉️ **Email**: ventas@menuclick.com
- 📅 **Agendar Demo**: [Calendly link]

### **Para Clientes Actuales:**
- 📚 **Documentación**: docs.menuclick.com
- 💬 **Soporte**: soporte@menuclick.com
- 🎓 **Tutoriales**: youtube.com/menuclickpro
- 📖 **Base de Conocimiento**: help.menuclick.com

---

## ✅ Checklist de Implementación para Nuevo Cliente

### **Pre-venta:**
- [ ] Demo personalizada (30 min)
- [ ] Entender necesidades del negocio
- [ ] Propuesta de valor y pricing
- [ ] Contrato firmado

### **Setup (Día 1):**
- [ ] Crear carpeta del cliente en monorepo
- [ ] Configurar theme.config.ts
- [ ] Recibir logo e imágenes del cliente
- [ ] Seed de categorías iniciales

### **Contenido (Día 2-3):**
- [ ] Migrar/crear catálogo de productos
- [ ] Subir imágenes optimizadas
- [ ] Configurar toppings disponibles
- [ ] Revisar descripciones

### **Testing (Día 4):**
- [ ] Prueba de flujo completo
- [ ] Validar cálculos de precios
- [ ] Probar mensaje WhatsApp
- [ ] Revisar responsive mobile

### **Deploy (Día 5):**
- [ ] Deploy a Netlify
- [ ] Configurar dominio custom (opcional)
- [ ] SSL automático
- [ ] Validación final en producción

### **Onboarding (Día 5):**
- [ ] Crear usuario admin del cliente
- [ ] Video tutorial del panel (15 min)
- [ ] Documento de referencia rápida
- [ ] Primer pedido de prueba juntos

### **Go-Live:**
- [ ] Publicar en redes sociales del cliente
- [ ] Enviar mensaje a base de clientes
- [ ] Monitorear primeros pedidos
- [ ] Feedback y ajustes rápidos

---

## 🎓 Conclusión

MenuClick es **mucho más que un simple e-commerce**. Es una solución completa que:

✅ **Empodera** a negocios locales para competir con grandes cadenas  
✅ **Elimina** las comisiones abusivas de apps de delivery  
✅ **Simplifica** la digitalización con setup en < 1 hora  
✅ **Automatiza** el proceso de pedidos sin perder el toque humano  
✅ **Escala** fácilmente de 1 a 100+ clientes  

**Tecnología probada en producción** con Más Pizza Ñuñoa como caso de éxito.

**Listo para vender** con material completo para web, videos y presentaciones.

---

## 📄 Licencia y Propiedad Intelectual

- **Código**: Propietario
- **Marca**: MenuClick ™
- **Cliente de ejemplo**: Más Pizza Ñuñoa (con permiso)
- **Desarrollador**: [Tu nombre/empresa]
- **Copyright**: © 2026 MenuClick. Todos los derechos reservados.

---

**Versión del documento**: 1.0  
**Última actualización**: Febrero 2026  
**Autor**: Equipo MenuClick

---

*Este documento describe todas las funcionalidades implementadas y en producción de MenuClick. Para roadmap completo y features futuras, consultar sección de Roadmap.*
