// Crea (o actualiza) un usuario administrador.
// Uso:  node scripts/crear-admin.js "Nombre" correo@ejemplo.com Contraseña123
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

(async () => {
  const [nombre, email, password] = process.argv.slice(2);
  if (!nombre || !email || !password) {
    console.error('Uso: node scripts/crear-admin.js "Nombre" correo@ejemplo.com Contraseña123');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash(password, 10);
  await Usuario.findOneAndUpdate(
    { email: email.toLowerCase() },
    { nombre, email, password: hash, rol: 'admin' },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  console.log(`Administrador listo: ${email}`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});