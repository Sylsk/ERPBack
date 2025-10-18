const pool = require('../db/connection');

const Supplier = {
  findAll: async () => {
    const result = await pool.query(
      'SELECT * FROM public.proveedor ORDER BY nombre'
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM public.proveedor WHERE id_proveedor = $1',
      [id]
    );
    return result.rows[0];
  },

  findByIdIncludeInactive: async (id) => {
    const result = await pool.query(
      'SELECT * FROM public.proveedor WHERE id_proveedor = $1',
      [id]
    );
    return result.rows[0];
  },

  create: async (data) => {
    const { nombre, rut, direccion, telefono, email, contacto } = data;
    const result = await pool.query(
      `INSERT INTO public.proveedor (nombre, rut, direccion, telefono, email, contacto)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, rut, direccion, telefono, email, contacto]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { nombre, rut, direccion, telefono, email, contacto } = data;
    const result = await pool.query(
      `UPDATE public.proveedor 
       SET nombre = $1, rut = $2, direccion = $3, telefono = $4, 
           email = $5, contacto = $6
       WHERE id_proveedor = $7 RETURNING *`,
      [nombre, rut, direccion, telefono, email, contacto, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(
      'DELETE FROM public.proveedor WHERE id_proveedor = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = Supplier;
