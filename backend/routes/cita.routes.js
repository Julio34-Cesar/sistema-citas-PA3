const router = require('express').Router();
const c = require('../controllers/cita.controllers');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

router.use(verificarToken);

router.get('/', c.listar);
router.get('/:id', c.obtener);
router.post('/', c.crear);

router.put('/:id', permitirRoles('admin'), c.actualizar);
router.delete('/:id', permitirRoles('admin'), c.eliminar);

module.exports = router;