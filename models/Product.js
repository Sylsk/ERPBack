const pool = require('../db/connection');

const Product = {
  findAll: async () => {
    const result = await pool.query(
      'SELECT * FROM public.producto ORDER BY estado DESC, nombre'
    );
    return result.rows;
  },

  findAllWithStockInfo: async () => {
    const result = await pool.query(`
      SELECT 
        *,
        CASE 
          WHEN cantidad = 0 THEN 'Sin Stock'
          WHEN cantidad <= 5 THEN 'Stock Bajo'
          ELSE 'Disponible'
        END as estado_stock
      FROM public.producto 
      ORDER BY estado DESC, cantidad ASC, nombre
    `);
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM public.producto WHERE id_producto = $1',
      [id]
    );
    return result.rows[0];
  },

  // Obtener productos que vende un proveedor específico (incluye productos sin stock)
  findBySupplier: async (supplierId) => {
    const result = await pool.query(`
      SELECT 
        p.*,
        pp.precio_proveedor,
        CASE 
          WHEN p.cantidad = 0 THEN 'Sin Stock'
          WHEN p.cantidad <= 5 THEN 'Stock Bajo'
          ELSE 'Disponible'
        END as estado_stock
      FROM public.producto p
      INNER JOIN producto_proveedor pp ON p.id_producto = pp.id_producto
      WHERE pp.id_proveedor = $1 
        AND pp.activo = true
      ORDER BY p.estado DESC, p.cantidad ASC, p.nombre
    `, [supplierId]);
    return result.rows;
  },

  exists: async (id) => {
    const result = await pool.query(
      'SELECT id_producto FROM public.producto WHERE id_producto = $1 AND estado = true',
      [id]
    );
    return result.rows.length > 0;
  }
};

module.exports = Product;
