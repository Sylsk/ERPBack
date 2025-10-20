const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.get('/', purchaseController.listar);
router.get('/info-completa', purchaseController.obtenerInfoCompleta);
router.get('/:id_orden_compra', purchaseController.obtenerPorId);
router.post('/', purchaseController.crear);
router.put('/:id_orden_compra', purchaseController.actualizar);
router.delete('/:id_orden_compra', purchaseController.eliminar);

module.exports = router;
