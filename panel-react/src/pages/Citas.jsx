import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCitas } from '../context/CitasContext.jsx';
import { mensajeError } from '../api/http.js';

export default function Citas() {
  const { esAdmin } = useAuth();
  const { citas, cargando, error, eliminar } = useCitas();
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorLocal, setErrorLocal] = useState('');

  // Filtra por cliente o motivo mientras se escribe
  const visibles = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    if (!t) return citas;
    return citas.filter((c) => c.cliente.toLowerCase().includes(t) || c.motivo.toLowerCase().includes(t));
  }, [citas, busqueda]);

  const borrar = async (c) => {
    if (!window.confirm(`¿Eliminar la cita de ${c.cliente}?`)) return;
    try {
      await eliminar(c._id);
      setMensaje('Cita eliminada correctamente');
      setErrorLocal('');
    } catch (e) {
      setMensaje('');
      setErrorLocal(mensajeError(e, 'No se pudo eliminar'));
    }
  };

  return (
    <>
      <h2>Lista de citas</h2>
      {mensaje && <p className="ok">{mensaje}</p>}
      {(error || errorLocal) && <p className="error">{error || errorLocal}</p>}
      {cargando && <p>Cargando…</p>}

      <input
        className="buscador"
        placeholder="Buscar por cliente o motivo"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {visibles.length === 0 && !cargando ? (
        <p>No hay citas registradas.</p>
      ) : (
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Cliente</th><th>Teléfono</th><th>Fecha</th><th>Hora</th><th>Motivo</th>
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {visibles.map((c) => (
                <tr key={c._id}>
                  <td>{c.cliente}</td><td>{c.telefono}</td><td>{c.fecha}</td><td>{c.hora}</td><td>{c.motivo}</td>
                  {/* Solo el administrador puede editar y eliminar */}
                  {esAdmin && (
                    <td className="acciones">
                      <Link className="btn secundario" to={`/citas/${c._id}/editar`}>Editar</Link>
                      <button className="btn peligro" type="button" onClick={() => borrar(c)}>Eliminar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
