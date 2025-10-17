const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/verificar', verificarToken, authController.verificar);

module.exports = router;
