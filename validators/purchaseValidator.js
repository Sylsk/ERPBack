const { body } = require('express-validator');
const { handleValidationErrors, isFutureDate } = require('./commonValidators');

const validateCreatePurchase = [
  body('id_proveedor').notEmpty().isInt({ min: 1 }).toInt(),
  body('id_empleado').notEmpty().isInt({ min: 1 }).toInt(),
  body('fecha_entrega_esperada').optional().isISO8601().custom(isFutureDate).withMessage('La fecha de entrega debe ser futura').toDate(),
  body('observaciones').optional().isLength({ max: 1000 }).trim().escape(),
  
  body('detalle').notEmpty().isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  body('detalle.*.id_producto').notEmpty().isInt({ min: 1 }).toInt(),
  body('detalle.*.cantidad').notEmpty().isInt({ min: 1, max: 1000000 }).toInt(),
  body('detalle.*.precio_unitario').notEmpty().isFloat({ min: 0, max: 9999999.99 }).toFloat(),

  body('detalle').custom((detalle) => {
    const productIds = detalle.map(item => item.id_producto);
    const uniqueIds = new Set(productIds);
    if (productIds.length !== uniqueIds.size) {
      throw new Error('No se pueden incluir productos duplicados');
    }
    return true;
  }),

  handleValidationErrors
];

const validateUpdatePurchase = [
  body('estado')
    .notEmpty()
    .isIn(['PENDIENTE', 'APROBADA', 'RECHAZADA', 'RECIBIDA', 'CANCELADA'])
    .withMessage('Estado inválido'),
  body('observaciones').optional().isLength({ max: 1000 }).trim().escape(),

  handleValidationErrors
];

const validatePurchaseBusinessRules = (req, res, next) => {
  const { detalle } = req.body;
  if (!detalle || detalle.length === 0) return next();

  let subtotalCalculado = 0;
  for (const item of detalle) {
    const subtotalItem = item.cantidad * item.precio_unitario;
    if (subtotalItem > 10000000) {
      return res.status(400).json({
        error: 'El subtotal del item excede el límite (10,000,000)',
        producto_id: item.id_producto
      });
    }
    subtotalCalculado += subtotalItem;
  }

  req.subtotalCalculado = subtotalCalculado;
  req.ivaCalculado = subtotalCalculado * 0.18;
  req.totalCalculado = subtotalCalculado + req.ivaCalculado;
  next();
};

module.exports = { validateCreatePurchase, validateUpdatePurchase, validatePurchaseBusinessRules };
