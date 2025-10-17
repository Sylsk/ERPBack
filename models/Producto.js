const pool = require('../db/conexion');

const Producto = {
  findAll: async () => {
    const result = await pool.query(
      'SELECT * FROM productos WHERE activo = true ORDER BY nombre'
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM productos WHERE id_producto = $1',
      [id]
    );
    return result.rows[0];
  },

  exists: async (id) => {
    const result = await pool.query(
      'SELECT id_producto FROM productos WHERE id_producto = $1 AND activo = true',
      [id]
    );
    return result.rows.length > 0;
  }
};

module.exports = Producto;
