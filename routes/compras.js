const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.get('/', verificarToken, compraController.listar);
router.get('/:id', verificarToken, compraController.obtenerPorId);
router.post('/', verificarToken, verificarRol('comprador', 'supervisor'), compraController.crear);
router.put('/:id', verificarToken, verificarRol('comprador', 'supervisor'), compraController.actualizar);
router.delete('/:id', verificarToken, verificarRol('supervisor'), compraController.eliminar);

module.exports = router;
