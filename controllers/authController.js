const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
      }

      const usuario = await User.findByUsername(username);

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const passwordValido = await bcrypt.compare(password, usuario.password_hash);

      if (!passwordValido) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        {
          id_usuario: usuario.id_usuario,
          username: usuario.username,
          rol: usuario.rol,
          id_empleado: usuario.id_empleado
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.json({
        message: 'Login exitoso',
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          username: usuario.username,
          rol: usuario.rol,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          cargo: usuario.cargo
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  },

  verificar: async (req, res) => {
    try {
      const usuario = await User.findById(req.usuario.id_usuario);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        rol: usuario.rol
      });
    } catch (error) {
      console.error('Error en verificación:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};

module.exports = authController;
