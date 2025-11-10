const pool = require('../db/connection');

const Employee = {
  findAll: async () => {
    const result = await pool.query(
      'SELECT * FROM empleados WHERE activo = true ORDER BY apellido, nombre'
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM empleados WHERE id_empleado = $1 AND activo = true',
      [id]
    );
    return result.rows[0];
  },

  exists: async (id) => {
    const result = await pool.query(
      'SELECT id_empleado FROM empleados WHERE id_empleado = $1 AND activo = true',
      [id]
    );
    return result.rows.length > 0;
  }
};

module.exports = Employee;
