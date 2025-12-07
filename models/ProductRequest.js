const pool = require('../db/connection');

const ProductRequest = {
  findPending: async () => {
    const result = await pool.query(
      'SELECT * FROM public.solicitud_producto WHERE estado_solicitud = false ORDER BY fecha_solicitud ASC'
    );
    return result.rows;
  },

  closeRequest: async (id, client) => {
    const query = 'UPDATE public.solicitud_producto SET estado_solicitud = true WHERE id_solicitud = $1';
    if (client) {
      await client.query(query, [id]);
    } else {
      await pool.query(query, [id]);
    }
  }
};

module.exports = ProductRequest;
