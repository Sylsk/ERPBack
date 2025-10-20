const pool = require('../db/connection');

const Product = {
  findAll: async () => {
    const result = await pool.query(
      'SELECT * FROM public.producto WHERE estado = true ORDER BY nombre'
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM public.producto WHERE id_producto = $1',
      [id]
    );
    return result.rows[0];
  },

  // Obtener productos que vende un proveedor específico
  findBySupplier: async (supplierId) => {
    const result = await pool.query(`
      SELECT 
        p.*,
        pp.precio_proveedor
      FROM public.producto p
      INNER JOIN producto_proveedor pp ON p.id_producto = pp.id_producto
      WHERE pp.id_proveedor = $1 
        AND p.estado = true 
        AND pp.activo = true
      ORDER BY p.nombre
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
