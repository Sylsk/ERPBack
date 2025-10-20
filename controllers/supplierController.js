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
      const { nombre, rut, direccion, telefono, email, contacto } = req.body;

      if (!nombre || !rut) {
        return res.status(400).json({ error: 'Nombre y RUT son requeridos' });
      }

      const proveedor = await Supplier.create({
        nombre,
        rut,
        direccion,
        telefono,
        email,
        contacto
      });

      res.status(201).json(proveedor);
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'El RUT ya está registrado' });
      }
      res.status(500).json({ error: 'Error al crear proveedor' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, rut, direccion, telefono, email, contacto } = req.body;

      const proveedorExiste = await Supplier.findById(id);
      if (!proveedorExiste) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }

      const proveedor = await Supplier.update(id, {
        nombre,
        rut,
        direccion,
        telefono,
        email,
        contacto
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
          nombre: proveedor.nombre
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
