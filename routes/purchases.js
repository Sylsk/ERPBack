const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.get('/', verificarToken, purchaseController.listar);
router.get('/:id', verificarToken, purchaseController.obtenerPorId);
router.post('/', verificarToken, verificarRol('comprador', 'supervisor'), purchaseController.crear);
router.put('/:id', verificarToken, verificarRol('comprador', 'supervisor'), purchaseController.actualizar);
router.delete('/:id', verificarToken, verificarRol('supervisor'), purchaseController.eliminar);

module.exports = router;
