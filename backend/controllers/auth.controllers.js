const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

// Crea el token JWT con el id y el rol del usuario
const crearToken = (usuario) =>
  jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  });

// Datos del usuario que sí se pueden enviar al cliente (sin contraseña)
const datosPublicos = (u) => ({ id: u._id, nombre: u.nombre, email: u.email, rol: u.rol });

// POST /api/auth/register
exports.registrar = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }
    if (await Usuario.findOne({ email: String(email).toLowerCase().trim() })) {
      return res.status(400).json({ mensaje: 'Ese correo ya está registrado' });
    }
    // El rol NO se toma del body: todo registro público es "usuario".
    // Así nadie puede crearse como admin desde la API.
    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email, password: hash, rol: 'usuario' });
    res.status(201).json({ token: crearToken(usuario), usuario: datosPublicos(usuario) });
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ mensaje: Object.values(e.errors).map((x) => x.message).join('. ') });
    }
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }
    const usuario = await Usuario.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
    // Mismo mensaje si falla el correo o la contraseña (no revela cuál es)
    const ok = usuario && (await bcrypt.compare(password, usuario.password));
    if (!ok) return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    res.json({ token: crearToken(usuario), usuario: datosPublicos(usuario) });
  } catch (e) {
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// GET /api/auth/perfil  (requiere token) - sirve para validar la sesión desde Angular/React
exports.perfil = async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id);
  if (!usuario) return res.status(401).json({ mensaje: 'Usuario no encontrado' });
  res.json({ usuario: datosPublicos(usuario) });
};