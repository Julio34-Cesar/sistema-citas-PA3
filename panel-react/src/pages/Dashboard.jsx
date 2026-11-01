import { useMemo } from 'react';
import { useCitas } from '../context/CitasContext.jsx';

// Fecha local en formato AAAA-MM-DD (igual que se guarda en la base de datos)
const aTexto = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;

export default function Dashboard() {
  const { citas, cargando, error } = useCitas();

  // Los totales se recalculan solo cuando cambian las citas
  const resumen = useMemo(() => {
    const hoy = new Date();
    const hoyTexto = aTexto(hoy);
    const en7 = new Date(hoy);
    en7.setDate(en7.getDate() + 7);
    const en7Texto = aTexto(en7);

    const proximas = citas.filter((c) => c.fecha >= hoyTexto);
    return {
      total: citas.length,
      hoy: citas.filter((c) => c.fecha === hoyTexto).length,
      semana: proximas.filter((c) => c.fecha <= en7Texto).length,
      lista: proximas.slice(0, 5)
    };
  }, [citas]);

  return (
    <>
      <h2>Panel de control</h2>
      {error && <p className="error">{error}</p>}
      {cargando && <p>Cargando…</p>}

      <div className="tarjetas">
        <div className="tarjeta"><h3>{resumen.total}</h3><p>Citas registradas</p></div>
        <div className="tarjeta"><h3>{resumen.hoy}</h3><p>Citas de hoy</p></div>
        <div className="tarjeta"><h3>{resumen.semana}</h3><p>Próximos 7 días</p></div>
      </div>

      <h3>Próximas citas</h3>
      {resumen.lista.length === 0 ? (
        <p>No hay citas próximas.</p>
      ) : (
        <ul>
          {resumen.lista.map((c) => (
            <li key={c._id}>{c.fecha} {c.hora} - {c.cliente} ({c.motivo})</li>
          ))}
        </ul>
      )}
    </>
  );
}
