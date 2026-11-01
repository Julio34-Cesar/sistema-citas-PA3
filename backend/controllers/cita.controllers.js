const Cita = require('../models/cita.model');

const manejarError = (err, res) => {
  if (err.name === 'ValidationError') return res.status(400).json({ mensaje: Object.values(err.errors).map(e => e.message).join(', ') });
  if (err.name === 'CastError') return res.status(400).json({ mensaje: 'ID inválido' });
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
};

exports.listar = async (req, res) => {
  try { res.json(await Cita.find().sort({ fecha: 1, hora: 1 })); } catch (e) { manejarError(e, res); }
};

exports.obtener = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id);
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    res.json(cita);
  } catch (e) { manejarError(e, res); }
};

exports.crear = async (req, res) => {
  try { res.status(201).json(await Cita.create(req.body)); } catch (e) { manejarError(e, res); }
};

exports.actualizar = async (req, res) => {
  try {
    const cita = await Cita.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    res.json(cita);
  } catch (e) { manejarError(e, res); }
};

exports.eliminar = async (req, res) => {
  try {
    const cita = await Cita.findByIdAndDelete(req.params.id);
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    res.json({ mensaje: 'Cita eliminada correctamente' });
  } catch (e) { manejarError(e, res); }
};