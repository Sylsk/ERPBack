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

  exists: async (id) => {
    const result = await pool.query(
      'SELECT id_producto FROM public.producto WHERE id_producto = $1 AND estado = true',
      [id]
    );
    return result.rows.length > 0;
  }
};

module.exports = Product;
