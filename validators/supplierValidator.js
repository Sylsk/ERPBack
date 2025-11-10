const { body } = require('express-validator');
const { handleValidationErrors, validateRUC, validatePhone, validateEmail } = require('./commonValidators');

const validateCreateSupplier = [
  body(['razon_social', 'nombre'])
    .if((value, { req }) => !req.body.razon_social && !req.body.nombre)
    .notEmpty().withMessage('La razón social o nombre es requerido'),
  
  body(['razon_social', 'nombre'])
    .optional()
    .isLength({ min: 3, max: 200 }).withMessage('La razón social debe tener entre 3 y 200 caracteres')
    .trim().escape(),

  body(['ruc', 'rut'])
    .if((value, { req }) => !req.body.ruc && !req.body.rut)
    .notEmpty().withMessage('El RUC/RUT es requerido'),
  
  body(['ruc', 'rut'])
    .optional()
    .custom(validateRUC).withMessage('El RUC debe ser válido (11 dígitos que comienzan con 10, 15, 16, 17 o 20)')
    .trim(),

  body('direccion').optional().isLength({ max: 500 }).trim().escape(),
  body('telefono').optional().custom(validatePhone).withMessage('El teléfono debe tener entre 7 y 15 dígitos').trim(),
  body('email').optional().custom(validateEmail).withMessage('El email no es válido').trim().normalizeEmail(),
  body(['contacto_nombre', 'contacto']).optional().isLength({ min: 2, max: 100 }).trim().escape(),
  body('contacto_telefono').optional().custom(validatePhone).trim(),
  body('activo').optional().isBoolean().toBoolean(),

  handleValidationErrors
];

const validateUpdateSupplier = [
  body(['razon_social', 'nombre']).optional().isLength({ min: 3, max: 200 }).trim().escape(),
  body(['ruc', 'rut']).optional().custom(validateRUC).withMessage('El RUC debe ser válido').trim(),
  body('direccion').optional().isLength({ max: 500 }).trim().escape(),
  body('telefono').optional().custom(validatePhone).trim(),
  body('email').optional().custom(validateEmail).trim().normalizeEmail(),
  body(['contacto_nombre', 'contacto']).optional().isLength({ min: 2, max: 100 }).trim().escape(),
  body('contacto_telefono').optional().custom(validatePhone).trim(),
  body('activo').optional().isBoolean().toBoolean(),

  handleValidationErrors
];

module.exports = { validateCreateSupplier, validateUpdateSupplier };
