const express = require('express');
const router = express.Router();
const productRequestController = require('../controllers/productRequestController');

// GET /api/product-requests/pending
router.get('/pending', productRequestController.getPendingRequests);

module.exports = router;
