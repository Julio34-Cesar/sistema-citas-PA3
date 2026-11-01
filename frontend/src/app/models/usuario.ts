export type Rol = 'admin' | 'usuario';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}

// Respuesta de /api/auth/login y /api/auth/register
export interface RespuestaAuth {
  token: string;
  usuario: Usuario;
}