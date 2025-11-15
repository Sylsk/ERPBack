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
      const { subtotalCalculado, ivaCalculado, totalCalculado } = req;

      for (const item of detalle) {
        item.subtotal = item.cantidad * item.precio_unitario;
      }

      const compra = await PurchaseOrder.create({
        id_proveedor,
        id_empleado,
        detalle,
        subtotal: subtotalCalculado,
        iva: ivaCalculado,
        total: totalCalculado,
        fecha_entrega_esperada,
        observaciones
      });

      const compraCompleta = await PurchaseOrder.findWithDetails(compra.id_orden_compra);
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

      // Validar que el estado sea válido (aceptar mayúsculas y minúsculas)
      const estadoUpper = estado?.toUpperCase();
      const estadosValidos = ['PENDIENTE', 'APROBADA', 'RECHAZADA'];
      if (!estadosValidos.includes(estadoUpper)) {
        return res.status(400).json({ 
          error: 'Estado no válido. Debe ser: PENDIENTE, APROBADA o RECHAZADA' 
        });
      }

      const compraExiste = await PurchaseOrder.findById(id_orden_compra);
      if (!compraExiste) {
        return res.status(404).json({ error: 'Orden de compra no encontrada' });
      }

      // Actualizar el estado (usar mayúsculas)
      const compra = await PurchaseOrder.update(id_orden_compra, { estado: estadoUpper });

      // Respuesta simple sin generar PDF
      res.json({
        ...compra,
        mensaje: `Orden de compra ${estadoUpper} correctamente`,
        puede_generar_factura: estadoUpper === 'APROBADA' // Indica si se puede generar factura
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
      if (ordenCompleta.estado !== 'APROBADA') {
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

      if (orden.estado !== 'APROBADA') {
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
