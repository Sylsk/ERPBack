const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Rutas principales de órdenes de compra
router.get('/', purchaseController.listar);
router.get('/info-completa', purchaseController.obtenerInfoCompleta);
router.get('/:id_orden_compra', purchaseController.obtenerPorId);
router.post('/', purchaseController.crear);
router.put('/:id_orden_compra', purchaseController.actualizar);
router.delete('/:id_orden_compra', purchaseController.eliminar);

// Rutas para manejo de facturas
router.post('/:id_orden_compra/generar-factura', purchaseController.generarFactura);
router.get('/:id_orden_compra/descargar-factura', purchaseController.descargarFactura);

module.exports = router;
