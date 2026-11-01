require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Sin estas variables el servidor no puede funcionar de forma segura
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Falta MONGO_URI o JWT_SECRET en el archivo .env');
  process.exit(1);
}

const app = express();

// Orígenes permitidos: Angular (4200) y React (5173). En producción se cambian en CORS_ORIGINS.
const origenes = (process.env.CORS_ORIGINS || 'http://localhost:4200,http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({ origin: origenes }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/citas', require('./routes/cita.routes'));
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    const puerto = process.env.PORT || 3000;
    app.listen(puerto, () => console.log(`API en http://localhost:${puerto}`));
  })
  .catch((err) => console.error('Error de conexión:', err.message));