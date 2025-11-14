const { body } = require('express-validator');
const { 
  handleValidationErrors, 
  validateEmail, 
  validatePhone 
} = require('./commonValidators');

const validateCreateEmployee = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras'),
  
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres')
    .matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/).withMessage('El apellido solo puede contener letras'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .custom(validateEmail),
  
  body('telefono')
    .optional({ checkFalsy: true })
    .trim()
    .custom(validatePhone),
  
  body('cargo')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El cargo no puede exceder 100 caracteres'),
  
  body('departamento')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El departamento no puede exceder 100 caracteres'),
  
  handleValidationErrors
];

const validateUpdateEmployee = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras'),
  
  body('apellido')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres')
    .matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/).withMessage('El apellido solo puede contener letras'),
  
  body('email')
    .optional()
    .trim()
    .custom(validateEmail),
  
  body('telefono')
    .optional({ checkFalsy: true })
    .trim()
    .custom(validatePhone),
  
  body('cargo')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El cargo no puede exceder 100 caracteres'),
  
  body('departamento')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El departamento no puede exceder 100 caracteres'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateEmployee,
  validateUpdateEmployee
};
