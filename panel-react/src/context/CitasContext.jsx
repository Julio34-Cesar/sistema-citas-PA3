import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { mensajeError } from '../api/http.js';
import { useAuth } from './AuthContext.jsx';

const CitasContext = createContext(null);

// Ordena por fecha y hora, igual que el backend
const ordenar = (lista) =>
  [...lista].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));

export function CitasProvider({ children }) {
  const { usuario } = useAuth();
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const { data } = await api.get('/citas');
      setCitas(ordenar(data));
    } catch (e) {
      setError(mensajeError(e, 'No se pudo cargar la lista de citas'));
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga las citas al iniciar sesión y las limpia al cerrarla
  useEffect(() => {
    if (usuario) cargar();
    else setCitas([]);
  }, [usuario, cargar]);

  const crear = useCallback(async (cita) => {
    const { data } = await api.post('/citas', cita);
    setCitas((prev) => ordenar([...prev, data]));
    return data;
  }, []);

  const actualizar = useCallback(async (id, cita) => {
    const { data } = await api.put(`/citas/${id}`, cita);
    setCitas((prev) => ordenar(prev.map((c) => (c._id === id ? data : c))));
    return data;
  }, []);

  const eliminar = useCallback(async (id) => {
    await api.delete(`/citas/${id}`);
    setCitas((prev) => prev.filter((c) => c._id !== id));
  }, []);

  const value = useMemo(
    () => ({ citas, cargando, error, cargar, crear, actualizar, eliminar }),
    [citas, cargando, error, cargar, crear, actualizar, eliminar]
  );

  return <CitasContext.Provider value={value}>{children}</CitasContext.Provider>;
}

export function useCitas() {
  const ctx = useContext(CitasContext);
  if (!ctx) throw new Error('useCitas debe usarse dentro de <CitasProvider>');
  return ctx;
}
