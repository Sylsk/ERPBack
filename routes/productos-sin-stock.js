const express = require('express');
const router = express.Router();
const ProductosSinStockController = require('../controllers/productosSinStockController');

/**
 * Rutas para visualización de productos sin stock (productos faltantes)
 * Prefix: /api/productos-sin-stock
 */

// GET /api/productos-sin-stock - Obtener todos los productos sin stock
router.get('/', ProductosSinStockController.obtenerProductosSinStock);

// GET /api/productos-sin-stock/paginado - Obtener productos sin stock con paginación
router.get('/paginado', ProductosSinStockController.obtenerProductosSinStockPaginado);

// GET /api/productos-sin-stock/:id - Obtener un producto específico sin stock
router.get('/:id', ProductosSinStockController.obtenerProductoSinStockPorId);

module.exports = router;