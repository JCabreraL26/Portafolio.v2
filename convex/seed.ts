import { mutation } from "./_generated/server";

// Script de inicialización - Carga datos de empresa
export const seedEmpresa = mutation({
  handler: async (ctx) => {
    // Verificar si ya existe configuración de empresa
    const existente = await ctx.db
      .query("configuracion")
      .filter(q => q.eq(q.field("clave"), "empresa_rut"))
      .first();
    
    if (existente) {
      return {
        success: false,
        mensaje: "Los datos de empresa ya están configurados. Usa el comando /empresa para actualizarlos."
      };
    }
    
    // Insertar RUT de empresa
    await ctx.db.insert("configuracion", {
      clave: "empresa_rut",
      valor: "78318808-2",
      tipo: "string",
      categoria: "contabilidad",
      acceso: "privado",
      descripcion: "RUT de ÁPERCA SPA",
      creado_por: "seed",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    // Insertar Razón Social
    await ctx.db.insert("configuracion", {
      clave: "empresa_razon_social",
      valor: "ÁPERCA SPA",
      tipo: "string",
      categoria: "contabilidad",
      acceso: "privado",
      descripcion: "Razón Social de la empresa",
      creado_por: "seed",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    console.log("✅ Datos de empresa configurados: ÁPERCA SPA (RUT: 78318808-2)");
    
    return {
      success: true,
      mensaje: "Empresa ÁPERCA SPA configurada correctamente",
      datos: {
        rut: "78318808-2",
        razon_social: "ÁPERCA SPA"
      }
    };
  },
});
