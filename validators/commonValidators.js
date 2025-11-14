const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Error de validación',
      detalles: errors.array().map(err => ({
        campo: err.path || err.param,
        mensaje: err.msg,
        valor: err.value
      }))
    });
  }
  next();
};

const validateRUC = (value) => {
  if (!value) return false;
  const cleanRUC = value.replace(/\s/g, '').replace(/-/g, '');
  if (!/^\d{11}$/.test(cleanRUC)) return false;
  const prefijo = cleanRUC.substring(0, 2);
  const prefijosValidos = ['10', '15', '16', '17', '20'];
  return prefijosValidos.includes(prefijo);
};

const validatePhone = (value) => {
  if (!value) return true;
  const cleanPhone = value.replace(/[\s\-\(\)\+]/g, '');
  return /^\d{7,15}$/.test(cleanPhone);
};

const validateEmail = (value) => {
  if (!value) return true;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
};

const validateProductCode = (value) => {
  if (!value) return false;
  return /^[A-Za-z0-9_-]{3,50}$/.test(value);
};

const isFutureDate = (value) => {
  if (!value) return true;
  const inputDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

const isPastOrPresentDate = (value) => {
  if (!value) return true;
  const inputDate = new Date(value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return inputDate <= today;
};

const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
    .toInt(),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRUC,
  validatePhone,
  validateEmail,
  validateProductCode,
  isFutureDate,
  isPastOrPresentDate,
  validateId
};
