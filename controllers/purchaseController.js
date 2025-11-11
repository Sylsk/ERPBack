const PurchaseOrder = require('../models/PurchaseOrder');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const Employee = require('../models/Employee');
const PDFService = require('../services/pdfService');
const path = require('path');

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
      const { id_orden_compra } = req.params;
      const compra = await PurchaseOrder.findWithDetails(id_orden_compra);

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
      const { id_proveedor, id_empleado, detalle } = req.body;

      if (!id_proveedor) {
        return res.status(400).json({ error: 'El proveedor es obligatorio' });
      }

      if (!id_empleado) {
        return res.status(400).json({ error: 'El empleado es obligatorio' });
      }

      if (!detalle || detalle.length === 0) {
        return res.status(400).json({ error: 'Debe incluir al menos un producto' });
      }

      const proveedor = await Supplier.findById(id_proveedor);
      if (!proveedor) {
        return res.status(400).json({ error: 'El proveedor no existe' });
      }

      const empleadoExiste = await Employee.exists(id_empleado);
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

        const productoExiste = await Product.exists(item.id_producto);
        if (!productoExiste) {
          return res.status(400).json({ error: `El producto ${item.id_producto} no existe en inventario` });
        }

        item.subtotal = item.cantidad * item.precio_unitario;
      }

      // Calcular subtotal, IVA (19%) y total
      const subtotal = detalle.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
      const iva = subtotal * 0.19;
      const total = subtotal + iva;

      const compra = await PurchaseOrder.create({
        id_proveedor,
        id_empleado,
        detalle,
        subtotal,
        iva,
        total
      });

      const compraCompleta = await PurchaseOrder.findWithDetails(compra.id_orden_compra);
      res.status(201).json(compraCompleta);
    } catch (error) {
      console.error('Error al crear compra:', error);
      res.status(500).json({ error: 'Error al crear orden de compra' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id_orden_compra } = req.params;
      const { estado } = req.body;

      // Validar que el estado sea válido
      const estadosValidos = ['pendiente', 'aprobada', 'rechazada'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado no válido. Debe ser: pendiente, aprobada o rechazada' });
      }

      const compraExiste = await PurchaseOrder.findById(id_orden_compra);
      if (!compraExiste) {
        return res.status(404).json({ error: 'Orden de compra no encontrada' });
      }

      // Actualizar el estado (sin generar PDF automáticamente)
      const compra = await PurchaseOrder.update(id_orden_compra, { estado });

      // Respuesta simple sin generar PDF
      res.json({
        ...compra,
        mensaje: `Orden de compra ${estado} correctamente`,
        puede_generar_factura: estado === 'aprobada' // Indica si se puede generar factura
      });

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
  },

  generarFactura: async (req, res) => {
    try {
      const { id_orden_compra } = req.params;

      // Verificar que la orden existe
      const ordenCompleta = await PurchaseOrder.findWithDetails(id_orden_compra);
      if (!ordenCompleta) {
        return res.status(404).json({ error: 'Orden de compra no encontrada' });
      }

      // Verificar que la orden esté aprobada
      if (ordenCompleta.estado !== 'aprobada') {
        return res.status(400).json({ 
          error: 'Solo se pueden generar facturas para órdenes aprobadas',
          estado_actual: ordenCompleta.estado
        });
      }

      // Generar el PDF temporalmente
      const rutaPDF = await PDFService.generarFacturaCompra(ordenCompleta);

      res.json({
        mensaje: 'Factura generada correctamente (temporal)',
        id_orden_compra: id_orden_compra,
        factura_generada: true,
        nota: 'Use el endpoint de descarga para obtener el archivo'
      });

      // Eliminar el archivo después de un tiempo (opcional)
      setTimeout(() => {
        PDFService.eliminarPDF(rutaPDF);
      }, 300000); // Eliminar después de 5 minutos

    } catch (error) {
      console.error('Error al generar factura:', error);
      res.status(500).json({ error: 'Error al generar factura: ' + error.message });
    }
  },

  descargarFactura: async (req, res) => {
    try {
      const { id_orden_compra } = req.params;

      // Verificar que la orden existe y está aprobada
      const orden = await PurchaseOrder.findById(id_orden_compra);
      if (!orden) {
        return res.status(404).json({ error: 'Orden de compra no encontrada' });
      }

      if (orden.estado !== 'aprobada') {
        return res.status(400).json({ error: 'La orden debe estar aprobada para descargar la factura' });
      }

      // Obtener datos completos para generar el PDF
      const ordenCompleta = await PurchaseOrder.findWithDetails(id_orden_compra);
      if (!ordenCompleta) {
        return res.status(500).json({ error: 'No se pudieron obtener los datos completos de la orden' });
      }

      // Generar el PDF temporalmente
      const rutaArchivo = await PDFService.generarFacturaCompra(ordenCompleta);
      const nombreArchivo = path.basename(rutaArchivo);

      // Configurar headers para la descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

      // Enviar el archivo y eliminarlo después
      res.sendFile(rutaArchivo, (err) => {
        // Eliminar el archivo después de enviarlo (independientemente de si hubo error o no)
        setTimeout(() => {
          PDFService.eliminarPDF(rutaArchivo);
        }, 1000); // Esperar 1 segundo antes de eliminar para asegurar que se envió

        if (err) {
          console.error('Error al enviar archivo:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Error al descargar la factura' });
          }
        }
      });

    } catch (error) {
      console.error('Error al generar/descargar factura:', error);
      res.status(500).json({ error: 'Error al procesar descarga: ' + error.message });
    }
  }
};

module.exports = purchaseController;
