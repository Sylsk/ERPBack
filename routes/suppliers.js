const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.get('/', verificarToken, supplierController.listar);
router.get('/:id', verificarToken, supplierController.obtenerPorId);
router.post('/', verificarToken, verificarRol('comprador', 'supervisor'), supplierController.crear);
router.put('/:id', verificarToken, verificarRol('comprador', 'supervisor'), supplierController.actualizar);
router.delete('/:id', verificarToken, verificarRol('supervisor'), supplierController.eliminar);

module.exports = router;
