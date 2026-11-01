import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { mensajeError } from '../api/http.js';
import { useCitas } from '../context/CitasContext.jsx';

const VACIO = { cliente: '', telefono: '', fecha: '', hora: '', motivo: '' };

// Las mismas reglas que el formulario de Angular y el esquema de Mongoose
function validar(v) {
  const e = {};
  if (v.cliente.trim().length < 3) e.cliente = 'Mínimo 3 caracteres';
  if (!/^\d{9}$/.test(v.telefono)) e.telefono = '9 dígitos numéricos';
  if (!v.fecha) e.fecha = 'La fecha es obligatoria';
  if (!v.hora) e.hora = 'La hora es obligatoria';
  if (v.motivo.trim().length < 5) e.motivo = 'Mínimo 5 caracteres';
  return e;
}

// Sirve para crear (/citas/nueva) y para editar (/citas/:id/editar)
export default function CitaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { crear, actualizar } = useCitas();

  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  // En modo edición se carga la cita desde la API
  useEffect(() => {
    if (!id) return;
    api
      .get(`/citas/${id}`)
      .then(({ data }) =>
        setValores({
          cliente: data.cliente, telefono: data.telefono, fecha: data.fecha, hora: data.hora, motivo: data.motivo
        })
      )
      .catch((e) => setError(mensajeError(e, 'No se pudo cargar la cita')));
  }, [id]);

  const cambiar = (e) => setValores((v) => ({ ...v, [e.target.name]: e.target.value }));

  const guardar = async (e) => {
    e.preventDefault();
    const encontrados = validar(valores);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setGuardando(true);
    setError('');
    try {
      if (id) await actualizar(id, valores);
      else await crear(valores);
      setMensaje('Cita guardada correctamente');
      setTimeout(() => navigate('/citas'), 700);
    } catch (err) {
      setError(mensajeError(err, 'Error al guardar'));
      setGuardando(false);
    }
  };

  const campo = (nombre, etiqueta, props = {}) => (
    <>
      <label>
        {etiqueta}
        <input name={nombre} value={valores[nombre]} onChange={cambiar} {...props} />
      </label>
      {errores[nombre] && <small className="error">{errores[nombre]}</small>}
    </>
  );

  return (
    <>
      <h2>{id ? 'Editar' : 'Nueva'} cita</h2>
      {mensaje && <p className="ok">{mensaje}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={guardar} noValidate>
        {campo('cliente', 'Cliente')}
        {campo('telefono', 'Teléfono', { maxLength: 9 })}
        {campo('fecha', 'Fecha', { type: 'date' })}
        {campo('hora', 'Hora', { type: 'time' })}
        <label>
          Motivo
          <textarea name="motivo" value={valores.motivo} onChange={cambiar} />
        </label>
        {errores.motivo && <small className="error">{errores.motivo}</small>}

        <div className="acciones">
          <button className="btn" type="submit" disabled={guardando}>Guardar</button>
          <Link className="btn secundario" to="/citas">Cancelar</Link>
        </div>
      </form>
    </>
  );
}
