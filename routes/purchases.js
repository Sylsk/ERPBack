const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { validateCreatePurchase, validateUpdatePurchase, validatePurchaseBusinessRules } = require('../validators/purchaseValidator');
const { param } = require('express-validator');
const { handleValidationErrors } = require('../validators/commonValidators');

const validatePurchaseId = [
  param('id_orden_compra').isInt({ min: 1 }).toInt(),
  handleValidationErrors
];

// Rutas principales de órdenes de compra
router.get('/', purchaseController.listar);
router.get('/info-completa', purchaseController.obtenerInfoCompleta);
router.get('/:id_orden_compra', validatePurchaseId, purchaseController.obtenerPorId);
router.post('/', validateCreatePurchase, validatePurchaseBusinessRules, purchaseController.crear);
router.put('/:id_orden_compra', validatePurchaseId, validateUpdatePurchase, purchaseController.actualizar);
router.delete('/:id_orden_compra', validatePurchaseId, purchaseController.eliminar);

// Rutas para manejo de facturas
router.post('/:id_orden_compra/generar-factura', purchaseController.generarFactura);
router.get('/:id_orden_compra/descargar-factura', purchaseController.descargarFactura);

module.exports = router;
