const PurchaseOrder = require('../models/PurchaseOrder');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const Employee = require('../models/Employee');

const purchaseController = {
  listar: async (req, res) => {
    try {
      const compras = await PurchaseOrder.findAll();
      res.json(compras);
    } catch (error) {
      console.error('Error al listar compras:', error);
      res.status(500).json({ error: 'Error al obtener órdenes de compra' });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const id = req.params.id_orden_compra || req.params.id_compra;
      const compra = await PurchaseOrder.findWithDetails(id);

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
      const { id_proveedor, id_empleado, detalle, fecha_entrega_esperada, observaciones } = req.body;
      const { subtotalCalculado, igvCalculado, totalCalculado } = req;

      for (const item of detalle) {
        item.subtotal = item.cantidad * item.precio_unitario;
      }

      const compra = await PurchaseOrder.create({
        id_proveedor,
        id_empleado,
        detalle,
        subtotal: subtotalCalculado,
        igv: igvCalculado,
        total: totalCalculado,
        fecha_entrega_esperada,
        observaciones
      });

      const compraCompleta = await PurchaseOrder.findWithDetails(compra.id_compra);
      res.status(201).json(compraCompleta);
    } catch (error) {
      console.error('Error al crear compra:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({ error: 'El número de OC ya existe' });
      }
      
      res.status(500).json({ error: 'Error al crear orden de compra' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id_orden_compra } = req.params;
      const { estado } = req.body;

      const compraExiste = await PurchaseOrder.findById(id_orden_compra);
      if (!compraExiste) {
        return res.status(404).json({ error: 'Orden de compra no encontrada' });
      }

      const compra = await PurchaseOrder.update(id_orden_compra, { estado });
      res.json(compra);
    } catch (error) {
      console.error('Error al actualizar compra:', error);
      res.status(500).json({ error: 'Error al actualizar orden de compra' });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id_orden_compra } = req.params;

      const compra = await PurchaseOrder.findById(id_orden_compra);
      if (!compra) {
        return res.status(404).json({ error: 'Orden de compra no encontrada' });
      }

      await PurchaseOrder.delete(id_orden_compra);
      res.json({ message: 'Orden de compra eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar compra:', error);
      res.status(500).json({ error: 'Error al eliminar orden de compra' });
    }
  },

  obtenerInfoCompleta: async (req, res) => {
    try {
      const comprasCompletas = await PurchaseOrder.findAllWithCompleteInfo();
      res.json(comprasCompletas);
    } catch (error) {
      console.error('Error al obtener información completa de compras:', error);
      res.status(500).json({ error: 'Error al obtener información completa de compras' });
    }
  }
};

module.exports = purchaseController;
