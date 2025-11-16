const ProviderOrder = require('../models/ProviderOrder');

const providerOrderController = {
  /**
   * Listar todas las órdenes de compra de proveedores
   */
  listar: async (req, res) => {
    try {
      const ordenes = await ProviderOrder.findAll();
      res.json(ordenes);
    } catch (error) {
      console.error('Error al listar órdenes de proveedores:', error);
      res.status(500).json({ error: 'Error al obtener órdenes de proveedores' });
    }
  },

  /**
   * Obtener orden de proveedor por ID
   */
  obtenerPorId: async (req, res) => {
    try {
      const { id_oc_proveedor } = req.params;
      const orden = await ProviderOrder.findById(id_oc_proveedor);

      if (!orden) {
        return res.status(404).json({ error: 'Orden de proveedor no encontrada' });
      }

      res.json(orden);
    } catch (error) {
      console.error('Error al obtener orden de proveedor:', error);
      res.status(500).json({ error: 'Error al obtener orden de proveedor' });
    }
  },

  /**
   * Marcar como pagada una orden de compra del proveedor
   * Solo se puede pagar si el estado_proveedor es 'ACEPTADA'
   */
  marcarComoPagada: async (req, res) => {
    try {
      const { id_oc_proveedor } = req.params;

      const ordenActualizada = await ProviderOrder.marcarComoPagada(id_oc_proveedor);

      res.json({
        mensaje: 'Orden de compra marcada como pagada correctamente',
        orden: ordenActualizada,
        puede_generar_factura: true
      });

    } catch (error) {
      console.error('Error al marcar como pagada:', error);

      // Manejo de errores específicos
      if (error.message === 'ORDEN_NO_ENCONTRADA') {
        return res.status(404).json({ 
          error: 'Orden de proveedor no encontrada' 
        });
      }

      if (error.message === 'ESTADO_NO_ACEPTADA') {
        return res.status(400).json({ 
          error: 'Solo se pueden marcar como pagadas las órdenes que hayan sido aceptadas por el proveedor',
          detalle: 'El estado_proveedor debe ser ACEPTADA'
        });
      }

      if (error.message === 'YA_PAGADA') {
        return res.status(400).json({ 
          error: 'Esta orden ya fue marcada como pagada anteriormente' 
        });
      }

      res.status(500).json({ 
        error: 'Error al procesar el pago de la orden',
        detalle: error.message 
      });
    }
  }
};

module.exports = providerOrderController;
