import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { borrarSesion, getToken, getUsuario, guardarSesion, registrarAlNoAutorizado } from '../api/http.js';
import { msHastaExpirar, tokenVigente } from '../utils/jwt.js';

const AuthContext = createContext(null);

// Recupera la sesión guardada; si el token ya venció, la borra
function leerSesion() {
  const token = getToken();
  if (token && tokenVigente(token)) return getUsuario();
  borrarSesion();
  return null;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(leerSesion);

  const logout = useCallback(
    (motivo) => {
      borrarSesion();
      setUsuario(null);
      navigate('/login', { replace: true, state: typeof motivo === 'string' ? { motivo } : null });
    },
    [navigate]
  );

  // Si cualquier petición recibe 401, se cierra la sesión (token vencido o inválido)
  useEffect(() => {
    registrarAlNoAutorizado(() => logout('expirada'));
    return () => registrarAlNoAutorizado(null);
  }, [logout]);

  // Cierra la sesión automáticamente cuando el token vence
  useEffect(() => {
    const token = getToken();
    if (!usuario || !token) return undefined;
    const ms = msHastaExpirar(token);
    if (ms <= 0) {
      logout('expirada');
      return undefined;
    }
    const id = setTimeout(() => logout('expirada'), Math.min(ms, 2 ** 31 - 1));
    return () => clearTimeout(id);
  }, [usuario, logout]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    guardarSesion(data);
    setUsuario(data.usuario);
    return data.usuario;
  }, []);

  const value = useMemo(
    () => ({ usuario, esAdmin: usuario?.rol === 'admin', login, logout }),
    [usuario, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto en cualquier componente
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
