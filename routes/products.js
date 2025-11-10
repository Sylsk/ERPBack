const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { validateId } = require('../validators/commonValidators');
const { validateCreateProduct, validateUpdateProduct } = require('../validators/productValidator');

// GET /api/products - Listar todos los productos o filtrados por proveedor
router.get('/', async (req, res) => {
  try {
    const { supplier_id } = req.query;
    
    let productos;
    if (supplier_id) {
      // Filtrar productos por proveedor
      productos = await Product.findBySupplier(supplier_id);
    } else {
      // Obtener todos los productos
      productos = await Product.findAll();
    }
    
    res.json(productos);
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
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