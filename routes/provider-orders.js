const express = require('express');
const router = express.Router();
const providerOrderController = require('../controllers/providerOrderController');
const { param } = require('express-validator');
const { handleValidationErrors } = require('../validators/commonValidators');

const validateProviderOrderId = [
  param('id_oc_proveedor').isInt({ min: 1 }).toInt(),
  handleValidationErrors
];

// Rutas para órdenes de compra de proveedores
router.get('/', providerOrderController.listar);
router.get('/:id_oc_proveedor', validateProviderOrderId, providerOrderController.obtenerPorId);
router.put('/:id_oc_proveedor/pagar', validateProviderOrderId, providerOrderController.marcarComoPagada);

module.exports = router;
