const Supplier = require('../models/Supplier');

const supplierController = {
  listar: async (req, res) => {
    try {
      const proveedores = await Supplier.findAll();
      res.json(proveedores);
    } catch (error) {
      console.error('Error al listar proveedores:', error);
      res.status(500).json({ error: 'Error al obtener proveedores' });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const proveedor = await Supplier.findById(id);

      if (!proveedor) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }

      res.json(proveedor);
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      res.status(500).json({ error: 'Error al obtener proveedor' });
    }
  },

  crear: async (req, res) => {
    try {
      const razon_social = req.body.razon_social || req.body.nombre;
      const ruc = req.body.ruc || req.body.rut;
      const contacto_nombre = req.body.contacto_nombre || req.body.contacto;
      const { direccion, telefono, email, contacto_telefono } = req.body;

      const proveedor = await Supplier.create({
        razon_social,
        ruc,
        direccion,
        telefono,
        email,
        contacto_nombre,
        contacto_telefono
      });

      res.status(201).json(proveedor);
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'El RUC ya está registrado' });
      }
      res.status(500).json({ error: 'Error al crear proveedor' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const proveedorExiste = await Supplier.findById(id);
      if (!proveedorExiste) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }

      const dataToUpdate = { ...req.body };
      if (req.body.nombre) dataToUpdate.razon_social = req.body.nombre;
      if (req.body.rut) dataToUpdate.ruc = req.body.rut;
      if (req.body.contacto) dataToUpdate.contacto_nombre = req.body.contacto;

      const proveedor = await Supplier.update(id, dataToUpdate);
      res.json(proveedor);
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'El RUC ya está registrado por otro proveedor' });
      }
      res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const proveedor = await Supplier.findById(id);
      if (!proveedor) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }

      await Supplier.delete(id);
      res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
  },

  // Obtener productos que vende un proveedor
  obtenerProductos: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si el proveedor existe
      const proveedor = await Supplier.findById(id);
      if (!proveedor) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }

      const Product = require('../models/Product');
      const productos = await Product.findBySupplier(id);
      
      res.json({
        proveedor: {
          id_proveedor: proveedor.id_proveedor,
          razon_social: proveedor.razon_social
        },
        productos: productos
      });
    } catch (error) {
      console.error('Error al obtener productos del proveedor:', error);
      res.status(500).json({ error: 'Error al obtener productos del proveedor' });
    }
  }
};

module.exports = supplierController;
