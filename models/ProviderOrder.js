const pool = require('../db/connection');

const ProviderOrder = {
  /**
   * Obtener todas las órdenes de compra de proveedores
   */
  findAll: async () => {
    const result = await pool.query(
      `SELECT op.*, 
              p.nombre as proveedor_nombre,
              e.nombre || ' ' || e.apellido as empleado_nombre
       FROM public.oc_proveedores op
       INNER JOIN public.proveedor p ON op.id_proveedor = p.id_proveedor
       INNER JOIN public.empleado e ON op.id_empleado = e.id_empleado
       ORDER BY op.fecha DESC`
    );
    return result.rows;
  },

  /**
   * Obtener todas las órdenes de compra de proveedores que NO están finalizadas
   */
  findActive: async () => {
    const result = await pool.query(
      `SELECT op.*, 
              p.nombre as proveedor_nombre,
              e.nombre || ' ' || e.apellido as empleado_nombre,
              oc.estado as estado_compra
       FROM public.oc_proveedores op
       INNER JOIN public.proveedor p ON op.id_proveedor = p.id_proveedor
       INNER JOIN public.empleado e ON op.id_empleado = e.id_empleado
       INNER JOIN "Compras".compras_oc oc ON op.id_orden_compra = oc.id_orden_compra
       WHERE oc.estado != 'FINALIZADA'
       ORDER BY op.fecha DESC`
    );
    return result.rows;
  },

  /**
   * Obtener orden de proveedor por ID
   */
  findById: async (id) => {
    const result = await pool.query(
      `SELECT op.*, 
              p.nombre as proveedor_nombre,
              p.rut as proveedor_rut,
              p.direccion as proveedor_direccion,
              e.nombre || ' ' || e.apellido as empleado_nombre
       FROM public.oc_proveedores op
       INNER JOIN public.proveedor p ON op.id_proveedor = p.id_proveedor
       INNER JOIN public.empleado e ON op.id_empleado = e.id_empleado
       WHERE op.id_oc_proveedor = $1`,
      [id]
    );
    return result.rows[0];
  },

  /**
   * Obtener orden de proveedor por ID de orden de compra
   */
  findByOrderId: async (id_orden_compra) => {
    const result = await pool.query(
      `SELECT op.*, 
              p.nombre as proveedor_nombre,
              e.nombre || ' ' || e.apellido as empleado_nombre
       FROM public.oc_proveedores op
       INNER JOIN public.proveedor p ON op.id_proveedor = p.id_proveedor
       INNER JOIN public.empleado e ON op.id_empleado = e.id_empleado
       WHERE op.id_orden_compra = $1`,
      [id_orden_compra]
    );
    return result.rows[0];
  },

  /**
   * Marcar como pagada una orden de compra del proveedor
   * Solo puede marcarse como pagada si el estado_proveedor es 'ACEPTADA'
   */
  marcarComoPagada: async (id_oc_proveedor) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Verificar que existe y que está aceptada
      const checkResult = await client.query(
        `SELECT id_oc_proveedor, estado_proveedor, pago_realizado, id_orden_compra
         FROM public.oc_proveedores 
         WHERE id_oc_proveedor = $1`,
        [id_oc_proveedor]
      );

      if (checkResult.rows.length === 0) {
        throw new Error('ORDEN_NO_ENCONTRADA');
      }

      const orden = checkResult.rows[0];

      if (orden.estado_proveedor !== 'ACEPTADA') {
        throw new Error('ESTADO_NO_ACEPTADA');
      }

      if (orden.pago_realizado) {
        throw new Error('YA_PAGADA');
      }

      // Actualizar a pagada
      const result = await client.query(
        `UPDATE public.oc_proveedores 
         SET pago_realizado = true,
             fecha_respuesta_proveedor = CASE 
               WHEN fecha_respuesta_proveedor IS NULL THEN NOW()
               ELSE fecha_respuesta_proveedor
             END
         WHERE id_oc_proveedor = $1 
         RETURNING *`,
        [id_oc_proveedor]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Verificar si una orden está pagada por ID de orden de compra
   */
  isPagada: async (id_orden_compra) => {
    const result = await pool.query(
      `SELECT pago_realizado, estado_proveedor 
       FROM public.oc_proveedores 
       WHERE id_orden_compra = $1`,
      [id_orden_compra]
    );
    
    if (result.rows.length === 0) {
      return { existe: false, pagada: false, aceptada: false };
    }

    return {
      existe: true,
      pagada: result.rows[0].pago_realizado,
      aceptada: result.rows[0].estado_proveedor === 'ACEPTADA'
    };
  }
};

module.exports = ProviderOrder;
