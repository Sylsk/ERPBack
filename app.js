const express = require('express');
const cors = require('cors');
require('dotenv').config();

const suppliersRoutes = require('./routes/suppliers');
const purchasesRoutes = require('./routes/purchases');
const employeesRoutes = require('./routes/employees');
const productsRoutes = require('./routes/products');
const productosSinStockRoutes = require('./routes/productos-sin-stock');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/suppliers', suppliersRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/productos-sin-stock', productosSinStockRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API ERP - Módulo de Compras',
    version: '1.0.0',
    endpoints: {
      suppliers: '/api/suppliers',
      purchases: '/api/purchases',
      employees: '/api/employees',
      products: '/api/products',
      'productos-sin-stock': '/api/productos-sin-stock'
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
