const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  cliente: { type: String, required: [true, 'El cliente es obligatorio'], trim: true },
  telefono: { type: String, required: [true, 'El teléfono es obligatorio'], match: [/^\d{9}$/, 'Teléfono de 9 dígitos'] },
  fecha: { type: String, required: [true, 'La fecha es obligatoria'] },   // YYYY-MM-DD
  hora: { type: String, required: [true, 'La hora es obligatoria'], match: [/^\d{2}:\d{2}$/, 'Formato HH:mm'] },
  motivo: { type: String, required: [true, 'El motivo es obligatorio'], trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Cita', citaSchema);