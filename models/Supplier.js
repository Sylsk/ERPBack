const pool = require('../db/connection');

const Supplier = {
  findAll: async () => {
    const result = await pool.query(
      'SELECT * FROM proveedores WHERE activo = true ORDER BY razon_social'
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM proveedores WHERE id_proveedor = $1 AND activo = true',
      [id]
    );
    return result.rows[0];
  },

  findByIdIncludeInactive: async (id) => {
    const result = await pool.query(
      'SELECT * FROM proveedores WHERE id_proveedor = $1',
      [id]
    );
    return result.rows[0];
  },

  create: async (data) => {
    const { razon_social, ruc, direccion, telefono, email, contacto_nombre, contacto_telefono } = data;
    const result = await pool.query(
      `INSERT INTO proveedores (razon_social, ruc, direccion, telefono, email, contacto_nombre, contacto_telefono)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [razon_social, ruc, direccion, telefono, email, contacto_nombre, contacto_telefono]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.razon_social !== undefined) { fields.push(`razon_social = $${paramCount++}`); values.push(data.razon_social); }
    if (data.ruc !== undefined) { fields.push(`ruc = $${paramCount++}`); values.push(data.ruc); }
    if (data.direccion !== undefined) { fields.push(`direccion = $${paramCount++}`); values.push(data.direccion); }
    if (data.telefono !== undefined) { fields.push(`telefono = $${paramCount++}`); values.push(data.telefono); }
    if (data.email !== undefined) { fields.push(`email = $${paramCount++}`); values.push(data.email); }
    if (data.contacto_nombre !== undefined) { fields.push(`contacto_nombre = $${paramCount++}`); values.push(data.contacto_nombre); }
    if (data.contacto_telefono !== undefined) { fields.push(`contacto_telefono = $${paramCount++}`); values.push(data.contacto_telefono); }
    if (data.activo !== undefined) { fields.push(`activo = $${paramCount++}`); values.push(data.activo); }

    if (fields.length === 0) throw new Error('No hay campos para actualizar');

    values.push(id);
    const query = `UPDATE proveedores SET ${fields.join(', ')} WHERE id_proveedor = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(
      'UPDATE proveedores SET activo = false WHERE id_proveedor = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = Supplier;
