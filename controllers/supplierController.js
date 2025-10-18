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
      const { razon_social, ruc, direccion, telefono, email, contacto_nombre, contacto_telefono } = req.body;

      if (!razon_social || !ruc) {
        return res.status(400).json({ error: 'Razón social y RUC son requeridos' });
      }

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
      const { razon_social, ruc, direccion, telefono, email, contacto_nombre, contacto_telefono, activo } = req.body;

      const proveedorExiste = await Supplier.findById(id);
      if (!proveedorExiste) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }

      const proveedor = await Supplier.update(id, {
        razon_social,
        ruc,
        direccion,
        telefono,
        email,
        contacto_nombre,
        contacto_telefono,
        activo
      });

      res.json(proveedor);
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
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

      if (!proveedor.activo) {
        return res.status(400).json({ error: 'El proveedor ya está eliminado' });
      }

      await Supplier.delete(id);
      res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
  }
};

module.exports = supplierController;
