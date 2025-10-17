const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const proveedoresRoutes = require('./routes/proveedores');
const comprasRoutes = require('./routes/compras');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/compras', comprasRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API ERP - Módulo de Compras',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      proveedores: '/api/proveedores',
      compras: '/api/compras'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

module.exports = app;
