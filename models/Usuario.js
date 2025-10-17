const pool = require('../db/conexion');

const Usuario = {
  findByUsername: async (username) => {
    const result = await pool.query(
      `SELECT u.*, e.nombre, e.apellido, e.email, e.cargo
       FROM usuarios u
       LEFT JOIN empleados e ON u.id_empleado = e.id_empleado
       WHERE u.username = $1 AND u.activo = true`,
      [username]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT id_usuario, username, rol, id_empleado, activo FROM usuarios WHERE id_usuario = $1',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = Usuario;
