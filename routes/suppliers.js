const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { validateCreateSupplier, validateUpdateSupplier } = require('../validators/supplierValidator');
const { validateId } = require('../validators/commonValidators');

router.get('/', supplierController.listar);
router.get('/:id', validateId, supplierController.obtenerPorId);
router.get('/:id/products', validateId, supplierController.obtenerProductos);
router.post('/', validateCreateSupplier, supplierController.crear);
router.put('/:id', validateId, validateUpdateSupplier, supplierController.actualizar);
router.delete('/:id', validateId, supplierController.eliminar);

module.exports = router;
