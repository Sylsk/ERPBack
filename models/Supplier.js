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
    const { razon_social, ruc, direccion, telefono, email, contacto_nombre, contacto_telefono, activo } = data;
    const result = await pool.query(
      `UPDATE proveedores 
       SET razon_social = $1, ruc = $2, direccion = $3, telefono = $4, 
           email = $5, contacto_nombre = $6, contacto_telefono = $7, activo = $8
       WHERE id_proveedor = $9 RETURNING *`,
      [razon_social, ruc, direccion, telefono, email, contacto_nombre, contacto_telefono, activo, id]
    );
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
