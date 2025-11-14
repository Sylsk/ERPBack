const { body } = require('express-validator');
const { 
  handleValidationErrors, 
  validateProductCode 
} = require('./commonValidators');

const validateCreateProduct = [
  body('codigo')
    .trim()
    .notEmpty().withMessage('El código es obligatorio')
    .isLength({ min: 3, max: 50 }).withMessage('El código debe tener entre 3 y 50 caracteres')
    .custom(validateProductCode),
  
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 200 }).withMessage('El nombre debe tener entre 3 y 200 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock no puede ser negativo'),
  
  body('unidad_medida')
    .optional()
    .trim()
    .isIn(['UNIDAD', 'CAJA', 'KG', 'LT', 'MT']).withMessage('Unidad de medida no válida'),
  
  handleValidationErrors
];

const validateUpdateProduct = [
  body('codigo')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('El código debe tener entre 3 y 50 caracteres')
    .custom(validateProductCode),
  
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('El nombre debe tener entre 3 y 200 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('precio')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock no puede ser negativo'),
  
  body('unidad_medida')
    .optional()
    .trim()
    .isIn(['UNIDAD', 'CAJA', 'KG', 'LT', 'MT']).withMessage('Unidad de medida no válida'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateProduct,
  validateUpdateProduct
};
