const pool = require('../db/connection');

const Employee = {
  findAll: async () => {
    const result = await pool.query(
      'SELECT * FROM public.empleado ORDER BY apellido, nombre'
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM public.empleado WHERE id_empleado = $1',
      [id]
    );
    return result.rows[0];
  },

  exists: async (id) => {
    const result = await pool.query(
      'SELECT id_empleado FROM public.empleado WHERE id_empleado = $1',
      [id]
    );
    return result.rows.length > 0;
  }
};

module.exports = Employee;
