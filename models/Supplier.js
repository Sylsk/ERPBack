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
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.nombre !== undefined) { fields.push(`nombre = $${paramCount++}`); values.push(data.nombre); }
    if (data.rut !== undefined) { fields.push(`rut = $${paramCount++}`); values.push(data.rut); }
    if (data.direccion !== undefined) { fields.push(`direccion = $${paramCount++}`); values.push(data.direccion); }
    if (data.telefono !== undefined) { fields.push(`telefono = $${paramCount++}`); values.push(data.telefono); }
    if (data.email !== undefined) { fields.push(`email = $${paramCount++}`); values.push(data.email); }
    if (data.contacto !== undefined) { fields.push(`contacto = $${paramCount++}`); values.push(data.contacto); }

    if (fields.length === 0) throw new Error('No hay campos para actualizar');

    values.push(id);
    const query = `UPDATE public.proveedor SET ${fields.join(', ')} WHERE id_proveedor = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
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
