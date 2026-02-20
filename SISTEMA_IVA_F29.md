# 🧾 Sistema de IVA Chileno - Formulario 29

## 📊 Descripción

Sistema completo de gestión de IVA para el Formulario 29 de Chile, integrado en FinBot Pro. Permite el registro automático de facturas con cálculo de IVA y generación de reportes mensuales para la declaración tributaria.

## 🎯 Características

### 1. Registro Automático de Facturas con IVA
- ✅ Extracción automática de datos tributarios desde PDFs/imágenes de facturas
- ✅ **Reconocimiento automático de fecha** y período tributario (asigna al mes correcto)
- ✅ **Extracción de RUT emisor y receptor** para clasificación precisa
- ✅ **Extracción de folio** y número de documento
- ✅ Cálculo automático de:
  - Monto neto (sin IVA)
  - IVA (19% por defecto)
  - Monto total
- ✅ Clasificación automática: INGRESO (débito fiscal) vs GASTO (crédito fiscal)
- ✅ Soporte para múltiples tipos de documentos:
  - Facturas afectas
  - Facturas exentas
  - Boletas
  - Notas de crédito
  - Notas de débito

### 2. Campos del Schema (Tabla: `contabilidad`)

```typescript
{
  // Montos
  monto_neto: number,           // Monto sin IVA
  monto_iva: number,            // Monto del IVA (19%)
  monto_total: number,          // Monto total con IVA
  
  // Datos tributarios
  afecto_iva: boolean,          // Si está afecto a IVA
  iva_porcentaje: number,       // Porcentaje de IVA (19%)
  tipo_documento: string,       // factura, boleta, nota_credito, etc.
  numero_documento: string,     // Número del documento
  folio: string,                // Folio del documento tributario
  
  // Partes involucradas
  rut_emisor: string,           // RUT de quien emite
  razon_social_emisor: string,  // Razón social del emisor
  rut_receptor: string,         // RUT de quien recibe
  razon_social_receptor: string, // Razón social del receptor
  
  // Período tributario
  periodo_tributario: string,   // "2026-02" (YYYY-MM)
  mes_declaracion: number,      // 1-12
  anio_declaracion: number,     // 2026
}
```

### 3. Queries Disponibles

#### `obtenerResumenIVA`
Calcula el resumen completo de IVA para un período mensual.

**Uso:**
```typescript
await ctx.runQuery(api.functions.ai.gemini.obtenerResumenIVA, {
  periodo: "2026-02" // YYYY-MM
});
```

**Retorna:**
```typescript
{
  periodo: "2026-02",
  
  // VENTAS (Facturas emitidas)
  ventas: {
    ventas_afectas_netas: number,      // Ventas netas
    iva_debito_fiscal: number,         // IVA de ventas
    ventas_totales: number,            // Total ventas
    ventas_exentas: number,            // Ventas exentas
    numero_facturas_emitidas: number   // Cantidad de facturas
  },
  
  // COMPRAS (Facturas recibidas)
  compras: {
    compras_afectas_netas: number,     // Compras netas
    iva_credito_fiscal: number,        // IVA de compras
    compras_totales: number,           // Total compras
    compras_exentas: number,           // Compras exentas
    numero_facturas_recibidas: number  // Cantidad de facturas
  },
  
  // RESUMEN F29
  f29: {
    debito_fiscal: number,      // IVA ventas
    credito_fiscal: number,     // IVA compras
    iva_determinado: number,    // Débito - Crédito
    iva_a_pagar: number,        // Si es positivo
    saldo_a_favor: number       // Si es negativo
  },
  
  total_transacciones: number,
  total_ingresos: number,
  total_gastos: number
}
```

#### `obtenerTransaccionesPorPeriodo`
Lista todas las transacciones de un período específico.

**Uso:**
```typescript
await ctx.runQuery(api.functions.ai.gemini.obtenerTransaccionesPorPeriodo, {
  periodo: "2026-02",
  tipo: "ingreso",      // Opcional: "ingreso" | "gasto"
  afecto_iva: true      // Opcional: true | false
});
```

#### `obtenerPeriodosDisponibles`
Retorna todos los períodos tributarios disponibles.

**Uso:**
```typescript
await ctx.runQuery(api.functions.ai.gemini.obtenerPeriodosDisponibles, {});
// Retorna: ["2026-02", "2026-01", "2025-12", ...]
```

### 4. Mutations Disponibles

#### `registrarTransaccionConIVA`
Registra una transacción con cálculo automático de IVA.

**Uso:**
```typescript
await ctx.runMutation(api.functions.ai.gemini.registrarTransaccionConIVA, {
  tipo: "ingreso",
  categoria: "servicios_profesionales",
  descripcion: "Diseño web",
  
  // Opción 1: Proporcionar monto_total (con IVA incluido)
  monto_total: 119000,
  
  // Opción 2: Proporcionar monto_neto (sin IVA)
  // monto_neto: 100000,
  
  // Datos tributarios
  afecto_iva: true,
  iva_porcentaje: 19,
  tipo_documento: "factura",
  numero_documento: "12345",
  folio: "12345",
  
  rut_emisor: "78318808-2",
  razon_social_emisor: "ÁPERCA SPA",
  rut_receptor: "77123456-7",
  razon_social_receptor: "Cliente ABC",
});
```

**Cálculos Automáticos:**
- Si envías `monto_total = 119000`:
  - `monto_neto = 100000` (119000 / 1.19)
  - `monto_iva = 19000` (119000 - 100000)

- Si envías `monto_neto = 100000`:
  - `monto_iva = 19000` (100000 * 0.19)
  - `monto_total = 119000` (100000 + 19000)

## 📱 Comandos de Telegram

### 1. Consultar IVA del mes actual
```
/iva
```

### 2. Consultar IVA de un mes específico
```
/iva 2026-02
/iva febrero
/iva enero 2026
```

### 3. Subir factura (registro automático)
Simplemente envía una foto o PDF de la factura. El bot:
1. ✅ Extrae RUTs, razón social, montos, folio
2. ✅ Detecta si es INGRESO (emites tú) o GASTO (pagas tú)
3. ✅ Calcula monto neto, IVA y total
4. ✅ Registra la transacción con todos los datos para F29

### 4. Registro manual con IVA
```
/gasto $119000 servicios
```
El bot calculará automáticamente:
- Monto neto: $100,000
- IVA: $19,000
- Total: $119,000

## 🔄 Flujo de Trabajo

### Para una Factura Recibida (GASTO - Crédito Fiscal)
1. Recibes factura de un proveedor
2. Subes foto/PDF a Telegram
3. Bot detecta: RUT emisor = proveedor → GASTO
4. Extrae: monto_neto, IVA, total, número factura
5. Registra como crédito fiscal del mes

### Para una Factura Emitida (INGRESO - Débito Fiscal)
1. Emites factura a un cliente
2. Subes foto/PDF a Telegram
3. Bot detecta: RUT emisor = tu empresa → INGRESO
4. Extrae: monto_neto, IVA, total, número factura
5. Registra como débito fiscal del mes

### Generar Reporte F29
1. Al finalizar el mes, ejecuta:
   ```
   /iva 2026-02
   ```
2. Obtienes:
   - Total ventas netas
   - IVA débito fiscal
   - Total compras netas
   - IVA crédito fiscal
   - **IVA a pagar o saldo a favor**

## 📊 Ejemplo de Reporte F29

```
📊 Resumen IVA - 2026-02
📝 Formulario 29 (Chile)

💰 VENTAS (Débito Fiscal)
   Facturas emitidas: 5
   Ventas netas: $500,000
   IVA débito: $95,000

💸 COMPRAS (Crédito Fiscal)
   Facturas recibidas: 8
   Compras netas: $300,000
   IVA crédito: $57,000

🧾 DECLARACIÓN F29
━━━━━━━━━━━━━━━━━━━━
Débito fiscal:  $95,000
Crédito fiscal: -$57,000
━━━━━━━━━━━━━━━━━━━━
✅ IVA a Pagar: $38,000

📅 Total transacciones: 13
```

## 🏢 Configuración de Empresa

Asegúrate de tener configurada tu empresa:

```
/empresa 78318808-2 | ÁPERCA SPA
```

Esto permite:
- ✅ Detección automática de INGRESO vs GASTO
- ✅ Llenado automático de RUT emisor en facturas emitidas
- ✅ Clasificación correcta para F29

## 🔧 Tecnología

- **Backend:** Convex (https://bright-rooster-475.convex.cloud)
- **AI:** Google Gemini 3 Flash Preview
- **Base de Datos:** Convex Real-time Database
- **Integración:** Telegram Bot API
- **Índices:** Optimizados para consultas por período

## 📝 Notas Importantes

1. **IVA Chile:** 19% estándar
2. **Período de declaración:** Mensual (12-20 de cada mes según RUT)
3. **Documentos que generan crédito fiscal:**
   - ✅ Facturas afectas
   - ❌ Boletas (no generan crédito)
   - ✅ Notas de crédito (restan)
   - ✅ Notas de débito (suman)

4. **Facturas exentas:** No incluyen IVA (`afecto_iva: false`)

## 🚀 Próximas Mejoras

- [ ] Exportación a Excel/PDF del F29
- [ ] Alertas de plazos de declaración
- [ ] Integración con SII
- [ ] Gráficos de evolución mensual
- [ ] Proyección anual de IVA

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0.0  
**Deployment:** bright-rooster-475.convex.cloud
