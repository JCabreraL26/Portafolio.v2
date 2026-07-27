# 🗑️ Plan: Sistema Avanzado de Eliminación de Facturas

## 📋 Resumen Ejecutivo

Mejora del sistema de eliminación de facturas para FinBot Pro, agregando capacidades avanzadas de eliminación con seguridad, auditoría y recuperación.

---

## 🎯 Objetivos

1. ✅ **Eliminación segura** con confirmación y auditoría
2. ✅ **Múltiples criterios** de eliminación (por folio, RUT, período, etc.)
3. ✅ **Papelera de reciclaje** con capacidad de restaurar
4. ✅ **Eliminación masiva** por lotes con validación
5. ✅ **Historial de auditoría** completo de todas las eliminaciones

---

## 🏗️ Arquitectura Propuesta

### 1. **Soft Delete** (Eliminación Lógica)

En lugar de borrar permanentemente, marcar facturas como eliminadas:

```typescript
// Schema mejorado en contabilidad
{
  // ... campos existentes ...
  
  // Nuevos campos para soft delete
  eliminado: boolean,                  // false por defecto
  eliminado_en: number,               // Timestamp de eliminación
  eliminado_por: string,              // "usuario_telegram", "admin", etc.
  razon_eliminacion: string,          // Motivo de eliminación
}
```

### 2. **Tabla de Auditoría**

Nueva tabla para rastrear todas las operaciones de eliminación:

```typescript
auditoria_eliminaciones: defineTable({
  accion: "eliminar" | "restaurar",
  entidad: "contabilidad",           // Nombre de la tabla
  registro_id: Id<"contabilidad">,   // ID del registro afectado
  
  // Datos del registro antes de eliminar
  datos_previos: any,                // Copia de la factura
  
  // Información de la eliminación
  razon: string,                     // Motivo
  criterio_usado: string,            // "por_id", "por_folio", "por_periodo", etc.
  parametros: any,                   // Parámetros usados para eliminar
  
  // Usuario que realizó la acción
  usuario: string,
  chat_id: string,
  timestamp: number,
}).index("por_registro", ["registro_id"])
  .index("por_accion", ["accion"])
  .index("por_timestamp", ["timestamp"])
```

### 3. **Papelera de Reciclaje**

Vista de facturas eliminadas con capacidad de restauración:

```typescript
// Query para ver papelera
obtenerPapelera(args: {
  limite?: number,
  tipo?: "ingreso" | "gasto",
  periodo?: string,
})

// Retorna facturas donde eliminado = true
// Con opción de restaurar en los últimos 30 días
```

---

## 🛠️ Funcionalidades a Implementar

### **FASE 1: Soft Delete y Auditoría** ⭐ CRÍTICO

#### 1.1 Modificar Schema

```typescript
// convex/schema.ts
contabilidad: defineTable({
  // ... campos existentes ...
  
  // Soft delete
  eliminado: v.optional(v.boolean()),
  eliminado_en: v.optional(v.number()),
  eliminado_por: v.optional(v.string()),
  razon_eliminacion: v.optional(v.string()),
})
.index("por_eliminado", ["eliminado"])
.index("por_eliminado_timestamp", ["eliminado", "eliminado_en"])

// Nueva tabla
auditoria_eliminaciones: defineTable({
  accion: v.union(v.literal("eliminar"), v.literal("restaurar")),
  entidad: v.string(),
  registro_id: v.string(),
  datos_previos: v.any(),
  razon: v.string(),
  criterio_usado: v.string(),
  parametros: v.optional(v.any()),
  usuario: v.string(),
  chat_id: v.optional(v.string()),
  timestamp: v.number(),
})
.index("por_registro", ["registro_id"])
.index("por_accion", ["accion"])
.index("por_timestamp", ["timestamp"])
```

#### 1.2 Refactorizar eliminarTransaccion

```typescript
export const eliminarTransaccion = mutation({
  args: {
    id: v.id("contabilidad"),
    razon: v.optional(v.string()),
    permanente: v.optional(v.boolean()), // true = delete, false = soft delete
  },
  handler: async (ctx, args) => {
    const transaccion = await ctx.db.get(args.id);
    if (!transaccion) {
      throw new Error("Transacción no encontrada");
    }
    
    if (args.permanente) {
      // Eliminación permanente (solo admin)
      await ctx.db.delete(args.id);
    } else {
      // Soft delete (default)
      await ctx.db.patch(args.id, {
        eliminado: true,
        eliminado_en: Date.now(),
        eliminado_por: "telegram_bot",
        razon_eliminacion: args.razon || "Sin razón especificada",
      });
    }
    
    // Registrar en auditoría
    await ctx.db.insert("auditoria_eliminaciones", {
      accion: "eliminar",
      entidad: "contabilidad",
      registro_id: args.id,
      datos_previos: transaccion,
      razon: args.razon || "Sin razón",
      criterio_usado: "por_id",
      parametros: { id: args.id },
      usuario: "telegram_bot",
      timestamp: Date.now(),
    });
    
    return { success: true, mensaje: "Factura eliminada (recuperable)" };
  },
});
```

### **FASE 2: Eliminación por Múltiples Criterios** 🎯

#### 2.1 Eliminar por Folio

```typescript
export const eliminarPorFolio = mutation({
  args: {
    folio: v.string(),
    razon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Buscar factura por folio
    const facturas = await ctx.db
      .query("contabilidad")
      .filter(q => q.eq(q.field("folio"), args.folio))
      .filter(q => q.neq(q.field("eliminado"), true))
      .collect();
    
    if (facturas.length === 0) {
      throw new Error(`No se encontró factura con folio ${args.folio}`);
    }
    
    // Eliminar (soft delete) cada factura encontrada
    const eliminadas = [];
    for (const factura of facturas) {
      await ctx.db.patch(factura._id, {
        eliminado: true,
        eliminado_en: Date.now(),
        eliminado_por: "telegram_bot",
        razon_eliminacion: args.razon || `Eliminado por folio ${args.folio}`,
      });
      
      // Auditoría
      await ctx.db.insert("auditoria_eliminaciones", {
        accion: "eliminar",
        entidad: "contabilidad",
        registro_id: factura._id,
        datos_previos: factura,
        razon: args.razon || `Eliminado por folio`,
        criterio_usado: "por_folio",
        parametros: { folio: args.folio },
        usuario: "telegram_bot",
        timestamp: Date.now(),
      });
      
      eliminadas.push(factura);
    }
    
    return {
      success: true,
      cantidad: eliminadas.length,
      mensaje: `${eliminadas.length} factura(s) con folio ${args.folio} eliminada(s)`,
    };
  },
});
```

#### 2.2 Eliminar por RUT Emisor

```typescript
export const eliminarPorRutEmisor = mutation({
  args: {
    rut: v.string(),
    razon: v.optional(v.string()),
    confirmar: v.boolean(), // Requiere confirmación explícita
  },
  handler: async (ctx, args) => {
    if (!args.confirmar) {
      throw new Error("Debe confirmar la eliminación masiva");
    }
    
    const facturas = await ctx.db
      .query("contabilidad")
      .filter(q => q.eq(q.field("rut_emisor"), args.rut))
      .filter(q => q.neq(q.field("eliminado"), true))
      .collect();
    
    // Similar a eliminarPorFolio...
    // Soft delete + auditoría para cada factura
    
    return {
      success: true,
      cantidad: facturas.length,
      mensaje: `${facturas.length} facturas del RUT ${args.rut} eliminadas`,
    };
  },
});
```

#### 2.3 Eliminar por Período

```typescript
export const eliminarPorPeriodo = mutation({
  args: {
    periodo: v.string(), // "2026-02"
    razon: v.optional(v.string()),
    confirmar: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Similar a las anteriores...
    // Buscar por periodo_tributario
  },
});
```

### **FASE 3: Restauración** ♻️

#### 3.1 Restaurar Factura

```typescript
export const restaurarTransaccion = mutation({
  args: {
    id: v.id("contabilidad"),
  },
  handler: async (ctx, args) => {
    const transaccion = await ctx.db.get(args.id);
    if (!transaccion) {
      throw new Error("Transacción no encontrada");
    }
    
    if (!transaccion.eliminado) {
      throw new Error("La transacción no está eliminada");
    }
    
    // Verificar que no hayan pasado más de 30 días
    const diasDesdeEliminacion = (Date.now() - (transaccion.eliminado_en || 0)) / (1000 * 60 * 60 * 24);
    if (diasDesdeEliminacion > 30) {
      throw new Error("No se puede restaurar facturas eliminadas hace más de 30 días");
    }
    
    // Restaurar
    await ctx.db.patch(args.id, {
      eliminado: false,
      eliminado_en: undefined,
      eliminado_por: undefined,
      razon_eliminacion: undefined,
    });
    
    // Auditoría
    await ctx.db.insert("auditoria_eliminaciones", {
      accion: "restaurar",
      entidad: "contabilidad",
      registro_id: args.id,
      datos_previos: transaccion,
      razon: "Restauración manual",
      criterio_usado: "por_id",
      parametros: { id: args.id },
      usuario: "telegram_bot",
      timestamp: Date.now(),
    });
    
    return {
      success: true,
      mensaje: `Factura restaurada: ${transaccion.descripcion}`,
    };
  },
});
```

#### 3.2 Ver Papelera

```typescript
export const obtenerPapelera = query({
  args: {
    limite: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const eliminados = await ctx.db
      .query("contabilidad")
      .withIndex("por_eliminado", q => q.eq("eliminado", true))
      .order("desc")
      .take(args.limite || 20);
    
    return eliminados.map(t => ({
      _id: t._id,
      tipo: t.tipo,
      descripcion: t.descripcion,
      monto_total: t.monto_total,
      folio: t.folio,
      numero_documento: t.numero_documento,
      eliminado_en: t.eliminado_en,
      razon_eliminacion: t.razon_eliminacion,
      puede_restaurar: (Date.now() - (t.eliminado_en || 0)) < (30 * 24 * 60 * 60 * 1000),
    }));
  },
});
```

### **FASE 4: Comandos de Telegram** 📱

#### Nuevos comandos a implementar:

```bash
# Eliminación básica (ya existe, mejorar)
/eliminar <ID> [razón]

# Eliminar por folio
/eliminar_folio <folio> [razón]

# Eliminar por RUT
/eliminar_rut <RUT> [razón]

# Eliminar por período
/eliminar_periodo <periodo> [razón]
/eliminar_periodo 2026-02 "facturas duplicadas"

# Ver papelera
/papelera
/papelera 50  # Ver últimas 50

# Restaurar factura
/restaurar <ID>

# Ver historial de eliminaciones
/auditoria
/auditoria eliminaciones  # Solo eliminaciones
/auditoria restauraciones # Solo restauraciones

# Confirmación interactiva
/eliminar_periodo 2026-02 --preview  # Ver qué se eliminará
/eliminar_periodo 2026-02 --confirm  # Confirmar eliminación
```

#### Ejemplo de flujo con confirmación:

```
Usuario: /eliminar_rut 12345678-9

Bot: ⚠️ Estás a punto de eliminar:
     📊 15 facturas
     💰 Total: $4,567,890
     📅 Período: Enero - Febrero 2026
     
     ¿Confirmar eliminación?
     Responde: /confirmar_eliminar
     Cancelar: /cancelar

Usuario: /confirmar_eliminar

Bot: ✅ Eliminadas 15 facturas del RUT 12345678-9
     Pueden ser restauradas en los próximos 30 días
     Usa /papelera para ver facturas eliminadas
```

---

## 🔒 Seguridad y Validaciones

### Reglas de Seguridad

1. **Soft Delete por Defecto**
   - Solo marcar como eliminado, no borrar permanentemente
   - Ventana de 30 días para restaurar

2. **Confirmación para Eliminación Masiva**
   - Requerir flag `--confirm` para eliminar múltiples facturas
   - Mostrar preview antes de confirmar

3. **Auditoría Completa**
   - Registrar TODA eliminación y restauración
   - Guardar copia de datos antes de eliminar
   - Rastrear usuario, timestamp y razón

4. **Limitaciones**
   - No permitir eliminar facturas de períodos cerrados (declarados)
   - No permitir restaurar después de 30 días
   - Limitar eliminación masiva a períodos específicos

5. **Validaciones**
   ```typescript
   // No eliminar si el período ya fue declarado
   if (factura.periodo_declarado) {
     throw new Error("No se puede eliminar facturas de períodos ya declarados");
   }
   
   // Confirmar eliminaciones masivas (>5 facturas)
   if (facturas.length > 5 && !args.confirmar) {
     throw new Error(`Se eliminarán ${facturas.length} facturas. Usa --confirm`);
   }
   ```

---

## 📊 Queries Adicionales

### Estadísticas de Eliminaciones

```typescript
export const obtenerEstadisticasEliminaciones = query({
  args: {
    periodo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const eliminaciones = await ctx.db
      .query("auditoria_eliminaciones")
      .filter(q => q.eq(q.field("accion"), "eliminar"))
      .collect();
    
    return {
      total_eliminaciones: eliminaciones.length,
      ultimas_24h: eliminaciones.filter(e => Date.now() - e.timestamp < 24*60*60*1000).length,
      por_criterio: {
        por_id: eliminaciones.filter(e => e.criterio_usado === "por_id").length,
        por_folio: eliminaciones.filter(e => e.criterio_usado === "por_folio").length,
        por_periodo: eliminaciones.filter(e => e.criterio_usado === "por_periodo").length,
        por_rut: eliminaciones.filter(e => e.criterio_usado === "por_rut").length,
      },
    };
  },
});
```

---

## 🎯 Plan de Implementación

### Sprint 1 (2-3 horas) - CORE ⭐
- [x] Planificación completa
- [ ] Modificar schema con campos de soft delete
- [ ] Crear tabla auditoria_eliminaciones
- [ ] Refactorizar eliminarTransaccion para soft delete
- [ ] Tests básicos

### Sprint 2 (2 horas) - CRITERIOS 🎯
- [ ] Implementar eliminarPorFolio
- [ ] Implementar eliminarPorRutEmisor
- [ ] Implementar eliminarPorPeriodo
- [ ] Query obtenerPapelera

### Sprint 3 (1-2 horas) - RESTAURACIÓN ♻️
- [ ] Implementar restaurarTransaccion
- [ ] Validación de período de 30 días
- [ ] Tests de restauración

### Sprint 4 (2-3 horas) - TELEGRAM 📱
- [ ] Nuevos comandos de Telegram
- [ ] Sistema de confirmación interactiva
- [ ] Previews antes de eliminar
- [ ] Mensajes informativos mejorados

### Sprint 5 (1 hora) - POLISH ✨
- [ ] Documentación completa
- [ ] Estadísticas y queries adicionales
- [ ] Validaciones de seguridad
- [ ] Tests end-to-end

---

## 📝 Ejemplo de Uso Completo

```typescript
// Caso 1: Eliminación simple con razón
await ctx.runMutation(api.functions.ai.gemini.eliminarTransaccion, {
  id: "abc123",
  razon: "Factura duplicada"
});

// Caso 2: Eliminar todas las facturas de un proveedor
await ctx.runMutation(api.functions.ai.gemini.eliminarPorRutEmisor, {
  rut: "76123456-7",
  razon: "Proveedor cancelado",
  confirmar: true
});

// Caso 3: Ver papelera y restaurar
const papelera = await ctx.runQuery(api.functions.ai.gemini.obtenerPapelera, {
  limite: 10
});

await ctx.runMutation(api.functions.ai.gemini.restaurarTransaccion, {
  id: papelera[0]._id
});

// Caso 4: Auditoría completa
const auditoria = await ctx.runQuery(api.functions.ai.gemini.obtenerAuditoria, {
  accion: "eliminar",
  desde: Date.now() - 7*24*60*60*1000 // Últimos 7 días
});
```

---

## 🚀 Beneficios

1. ✅ **Seguridad**: Ninguna factura se pierde permanentemente
2. ✅ **Flexibilidad**: Múltiples formas de eliminar facturas
3. ✅ **Auditoría**: Trazabilidad completa de todas las operaciones
4. ✅ **Recuperación**: Papelera con restauración en 30 días
5. ✅ **UX**: Comandos intuitivos desde Telegram
6. ✅ **Prevención**: Confirmaciones para evitar errores

---

## ⚠️ Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Eliminación accidental masiva | Alto | Requiere confirmación explícita + preview |
| Pérdida de datos después de 30 días | Medio | Warning al usuario antes de que expire |
| Queries lentas en tabla grande | Medio | Índices optimizados en schema |
| Usuario elimina período declarado | Alto | Validación que bloquea eliminación |

---

## 📈 Métricas de Éxito

- ✅ 0 eliminaciones permanentes accidentales
- ✅ 100% de eliminaciones auditadas
- ✅ <1% de facturas restauradas (buena precisión al eliminar)
- ✅ Tiempo de respuesta <500ms para eliminaciones individuales
- ✅ Prevención de eliminación de períodos declarados

---

## 🎓 Conclusión

Este plan transforma el sistema de eliminación de facturas de una operación simple y peligrosa a un sistema robusto, seguro y auditable que:

1. **Protege** contra eliminaciones accidentales
2. **Permite** recuperar facturas eliminadas  
3. **Registra** todas las operaciones
4. **Facilita** la gestión desde Telegram
5. **Escala** para operaciones masivas

**Próximo paso**: Implementar Sprint 1 con schema y soft delete básico.

---

**Versión**: 1.0  
**Fecha**: 2026-02-20  
**Autor**: FinBot Pro Team
