// Lee el campo "exp" (fecha de expiración) que trae el JWT. No necesita la clave secreta.
function leerPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// Milisegundos que faltan para que el token venza (negativo o 0 = ya venció o es inválido)
export function msHastaExpirar(token) {
  const payload = leerPayload(token || '');
  if (!payload || typeof payload.exp !== 'number') return 0;
  return payload.exp * 1000 - Date.now();
}

export function tokenVigente(token) {
  return msHastaExpirar(token) > 0;
}
