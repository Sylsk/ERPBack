const CompraOC = require('../models/CompraOC');
const Proveedor = require('../models/Proveedor');
const Producto = require('../models/Producto');
const Empleado = require('../models/Empleado');

const compraController = {
  listar: async (req, res) => {
    try {
      const compras = await CompraOC.findAll();
      res.json(compras);
    } catch (error) {
      console.error('Error al listar compras:', error);
      res.status(500).json({ error: 'Error al obtener órdenes de compra' });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const compra = await CompraOC.findWithDetails(id);

      if (!compra) {
        return res.status(404).json({ error: 'Orden de compra no encontrada' });
      }

      res.json(compra);
    } catch (error) {
      console.error('Error al obtener compra:', error);
      res.status(500).json({ error: 'Error al obtener orden de compra' });
    }
  },

  crear: async (req, res) => {
    try {
      const { id_proveedor, id_empleado, fecha_entrega_esperada, observaciones, detalle } = req.body;

      if (!id_proveedor) {
        return res.status(400).json({ error: 'El proveedor es obligatorio' });
      }

      if (!id_empleado) {
        return res.status(400).json({ error: 'El empleado es obligatorio' });
      }

      if (!detalle || detalle.length === 0) {
        return res.status(400).json({ error: 'Debe incluir al menos un producto' });
      }

      const proveedor = await Proveedor.findById(id_proveedor);
      if (!proveedor) {
        return res.status(400).json({ error: 'El proveedor no existe' });
      }

      const empleadoExiste = await Empleado.exists(id_empleado);
      if (!empleadoExiste) {
        return res.status(400).json({ error: 'El empleado no existe' });
      }

      for (const item of detalle) {
        if (!item.id_producto || !item.cantidad || !item.precio_unitario) {
          return res.status(400).json({ error: 'Datos incompletos en el detalle' });
        }

        if (item.cantidad <= 0) {
          return res.status(400).json({ error: 'La cantidad debe ser mayor a cero' });
        }

        if (item.precio_unitario < 0) {
          return res.status(400).json({ error: 'El precio no puede ser negativo' });
        }

        const productoExiste = await Producto.exists(item.id_producto);
        if (!productoExiste) {
          return res.status(400).json({ error: `El producto ${item.id_producto} no existe en inventario` });
        }

        item.subtotal = item.cantidad * item.precio_unitario;
      }

      const numero_oc = await CompraOC.generateNumeroOC();

      const compra = await CompraOC.create({
        numero_oc,
        id_proveedor,
        id_empleado,
        fecha_entrega_esperada,
        observaciones,
        detalle
      });

      const compraCompleta = await CompraOC.findWithDetails(compra.id_compra);
      res.status(201).json(compraCompleta);
    } catch (error) {
      console.error('Error al crear compra:', error);
      res.status(500).json({ error: 'Error al crear orden de compra' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { fecha_entrega_esperada, estado, observaciones } = req.body;

      const compraExiste = await CompraOC.findById(id);
      if (!compraExiste) {
        return res.status(404).json({ error: 'Orden de compra no encontrada' });
      }

      let aprobado_por = null;
      if (estado === 'APROBADA') {
        aprobado_por = req.usuario.id_empleado;
      }

      const compra = await CompraOC.update(id, {
        fecha_entrega_esperada,
        estado,
        observaciones,
        aprobado_por
      });

      res.json(compra);
    } catch (error) {
      console.error('Error al actualizar compra:', error);
      res.status(500).json({ error: 'Error al actualizar orden de compra' });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const compra = await CompraOC.findById(id);
      if (!compra) {
        return res.status(404).json({ error: 'Orden de compra no encontrada' });
      }

      await CompraOC.delete(id);
      res.json({ message: 'Orden de compra eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar compra:', error);
      res.status(500).json({ error: 'Error al eliminar orden de compra' });
    }
  }
};

module.exports = compraController;
