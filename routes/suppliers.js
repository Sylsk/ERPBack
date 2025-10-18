const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.get('/', supplierController.listar);
router.get('/:id', supplierController.obtenerPorId);
router.post('/', supplierController.crear);
router.put('/:id', supplierController.actualizar);
router.delete('/:id', supplierController.eliminar);

module.exports = router;
