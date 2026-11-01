const jwt = require('jsonwebtoken');


exports.verificarToken = (req, res, next) => {
  const cabecera = req.headers.authorization || '';
  const [tipo, token] = cabecera.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensaje: 'Token requerido', codigo: 'TOKEN_REQUERIDO' });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET); // { id, rol, iat, exp }
    next();
  } catch (e) {
    const expirado = e.name === 'TokenExpiredError';
    return res.status(401).json({
      mensaje: expirado ? 'La sesión ha expirado' : 'Token inválido',
      codigo: expirado ? 'TOKEN_EXPIRADO' : 'TOKEN_INVALIDO'
    });
  }
};

// Permite el acceso solo a ciertos roles. Ejemplo: permitirRoles('admin')
exports.permitirRoles = (...roles) => (req, res, next) => {
  if (!req.usuario || !roles.includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: 'No tienes permiso para realizar esta acción', codigo: 'SIN_PERMISO' });
  }
  next();
};