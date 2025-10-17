const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.get('/', verificarToken, proveedorController.listar);
router.get('/:id', verificarToken, proveedorController.obtenerPorId);
router.post('/', verificarToken, verificarRol('comprador', 'supervisor'), proveedorController.crear);
router.put('/:id', verificarToken, verificarRol('comprador', 'supervisor'), proveedorController.actualizar);
router.delete('/:id', verificarToken, verificarRol('supervisor'), proveedorController.eliminar);

module.exports = router;
