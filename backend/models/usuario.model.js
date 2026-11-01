const mongoose = require('mongoose');

// Roles permitidos en el sistema
const ROLES = ['admin', 'usuario'];

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true, minlength: 3 },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo no es válido']
    },
    // Aquí se guarda el hash de bcrypt, nunca la contraseña original
    password: { type: String, required: true, select: false },
    rol: { type: String, enum: ROLES, default: 'usuario' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Usuario', usuarioSchema);
module.exports.ROLES = ROLES;