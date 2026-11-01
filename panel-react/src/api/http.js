import axios from 'axios';

// URL del backend. En producción se define con la variable VITE_API_URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario';

// ---- Manejo de la sesión en el navegador ----
export function getToken() {
  try { return localStorage.getItem(CLAVE_TOKEN); } catch { return null; }
}

export function getUsuario() {
  try { return JSON.parse(localStorage.getItem(CLAVE_USUARIO)); } catch { return null; }
}

export function guardarSesion({ token, usuario }) {
  try {
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  } catch { /* si el navegador bloquea el almacenamiento, no se guarda */ }
}

export function borrarSesion() {
  try {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
  } catch { /* nada que borrar */ }
}

// ---- Cliente Axios (T11) ----
const api = axios.create({ baseURL: API_URL });

// 1) Antes de cada petición: agrega el token JWT
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 2) Si la API responde 401 (token vencido o inválido), se avisa a AuthContext para cerrar sesión
let alNoAutorizado = null;
export function registrarAlNoAutorizado(fn) {
  alNoAutorizado = fn;
}

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const url = error.config?.url || '';
    const esAuth = url.includes('/auth/login') || url.includes('/auth/register');
    if (error.response?.status === 401 && !esAuth && alNoAutorizado) alNoAutorizado();
    return Promise.reject(error);
  }
);

// Convierte un error de Axios en un mensaje para mostrar al usuario
export function mensajeError(error, porDefecto = 'Ocurrió un error') {
  if (error.response?.data?.mensaje) return error.response.data.mensaje;
  if (error.request && !error.response) return 'No se pudo conectar con el servidor';
  return porDefecto;
}

export default api;
