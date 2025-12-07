const ProductRequest = require('../models/ProductRequest');

const productRequestController = {
  getPendingRequests: async (req, res) => {
    try {
      const requests = await ProductRequest.findPending();
      res.json(requests);
    } catch (error) {
      console.error('Error al obtener solicitudes pendientes:', error);
      res.status(500).json({ error: 'Error al obtener solicitudes pendientes' });
    }
  }
};

module.exports = productRequestController;
