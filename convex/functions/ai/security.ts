/**
 * Helpers de seguridad para prompts de IA
 * Protegen contra prompt injection y sanitizan inputs
 */

/**
 * Delimita el input del usuario usando XML tags para evitar prompt injection.
 * Esto aisla estructuralmente el input del usuario del system prompt.
 * 
 * Referencia: OWASP LLM Top 10 - Prompt Injection
 */
export function delimitarUsuarioInput(input: string): string {
  // Escapar secuencias que podrían cerrar los tags XML
  const escapado = input
    .replace(/<\/user_input>/gi, "\\u003C/user_input\\u003E")
    .replace(/<user_input>/gi, "\\u003Cuser_input\\u003E");

  return `<user_input>\n${escapado}\n</user_input>`;
}

/**
 * Valida y trunca mensajes de usuario para prevenir abuso de tokens.
 */
export function validarMensajeUsuario(
  mensaje: string,
  opciones: { maxLength?: number; permitirHtml?: boolean } = {}
): { valido: boolean; mensaje: string; error?: string } {
  const { maxLength = 2000, permitirHtml = false } = opciones;

  if (!mensaje || mensaje.trim().length === 0) {
    return { valido: false, mensaje: "", error: "Mensaje vacío" };
  }

  if (mensaje.length > maxLength) {
    return {
      valido: false,
      mensaje: mensaje.slice(0, maxLength),
      error: `Mensaje excede ${maxLength} caracteres`,
    };
  }

  // Si no se permite HTML, escapar tags peligrosos
  if (!permitirHtml) {
    const mensajeLimpio = mensaje
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "[script-blocked]")
      .replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gi, "[iframe-blocked]")
      .replace(/javascript:/gi, "[js-blocked:]");
    return { valido: true, mensaje: mensajeLimpio };
  }

  return { valido: true, mensaje };
}

/**
 * Sanitiza el output del LLM antes de renderizar en el frontend.
 * Elimina tags peligrosos permitiendo solo markdown/HTML seguro.
 */
export function sanitizarOutputBot(texto: string): string {
  if (!texto) return "";

  // Eliminar tags peligrosos
  const textoLimpio = texto
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gi, "")
    .replace(/<object\b[^>]*>([\s\S]*?)<\/object>/gi, "")
    .replace(/<embed\b[^>]*>([\s\S]*?)<\/embed>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, ""); // event handlers: onclick, onerror, etc.

  return textoLimpio;
}

/**
 * Regex simple para validar email.
 */
export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Regex para validar que un nombre no contiene caracteres peligrosos.
 */
export function validarNombre(nombre: string): boolean {
  return /^[\p{L}\p{M}\s'-]{2,100}$/u.test(nombre.trim());
}

/**
 * Validar que un timestamp es razonable (no en el pasado lejano, no en el futuro lejano).
 */
export function validarTimestampRazonable(
  timestamp: number,
  opciones: { minDesdeAhora?: number; maxDiasFuturo?: number } = {}
): boolean {
  const { minDesdeAhora = -1, maxDiasFuturo = 365 } = opciones;
  const ahora = Date.now();
  const minMs = minDesdeAhora >= 0 ? ahora + minDesdeAhora : ahora - 365 * 24 * 60 * 60 * 1000;
  const maxMs = ahora + maxDiasFuturo * 24 * 60 * 60 * 1000;

  return timestamp >= minMs && timestamp <= maxMs;
}
