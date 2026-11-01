const router = require('express').Router();
const c = require('../controllers/auth.controllers');
const { verificarToken } = require('../middlewares/auth.middleware');

router.post('/register', c.registrar);
router.post('/login', c.login);
router.get('/perfil', verificarToken, c.perfil);

module.exports = router;