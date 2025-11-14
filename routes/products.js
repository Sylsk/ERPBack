const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const pool = require('../db/connection');
const { validateId } = require('../validators/commonValidators');
const { validateCreateProduct, validateUpdateProduct } = require('../validators/productValidator');

// GET /api/products - Listar todos los productos o filtrados por proveedor
router.get('/', async (req, res) => {
  try {
    const { supplier_id, include_out_of_stock, with_stock_info } = req.query;
    
    let productos;
    
    if (supplier_id) {
      // Filtrar productos por proveedor (siempre incluye productos sin stock para compras)
      productos = await Product.findBySupplier(supplier_id);
    } else if (with_stock_info === 'true') {
      // Obtener productos con información detallada de stock
      productos = await Product.findAllWithStockInfo();
    } else {
      // Obtener todos los productos (incluye sin stock por defecto)
      productos = await Product.findAll();
    }
    
    res.json(productos);
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/products/available - Obtener solo productos disponibles (estado = true)
router.get('/available', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.producto WHERE estado = true ORDER BY nombre'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos disponibles:', error);
    res.status(500).json({ error: 'Error al obtener productos disponibles' });
  }
});

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Product.findById(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

module.exports = router;