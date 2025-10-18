const pool = require('../db/connection');

const PurchaseOrder = {
  findAll: async () => {
    const result = await pool.query(
      `SELECT c.*, p.razon_social, e.nombre || ' ' || e.apellido as empleado_nombre
       FROM compras_oc c
       INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
       INNER JOIN empleados e ON c.id_empleado = e.id_empleado
       ORDER BY c.fecha_creacion DESC`
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      `SELECT c.*, p.razon_social, e.nombre || ' ' || e.apellido as empleado_nombre
       FROM compras_oc c
       INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
       INNER JOIN empleados e ON c.id_empleado = e.id_empleado
       WHERE c.id_compra = $1`,
      [id]
    );
    return result.rows[0];
  },

  findWithDetails: async (id) => {
    const compra = await pool.query(
      `SELECT c.*, p.razon_social, p.ruc, p.direccion as proveedor_direccion,
              e.nombre || ' ' || e.apellido as empleado_nombre, e.email as empleado_email
       FROM compras_oc c
       INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
       INNER JOIN empleados e ON c.id_empleado = e.id_empleado
       WHERE c.id_compra = $1`,
      [id]
    );
    
    const detalle = await pool.query(
      `SELECT d.*, prod.codigo, prod.nombre, prod.unidad_medida
       FROM compras_detalle d
       INNER JOIN productos prod ON d.id_producto = prod.id_producto
       WHERE d.id_compra = $1
       ORDER BY d.id_detalle`,
      [id]
    );

    if (compra.rows.length > 0) {
      return {
        ...compra.rows[0],
        detalle: detalle.rows
      };
    }
    return null;
  },

  create: async (data) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { numero_oc, id_proveedor, id_empleado, fecha_entrega_esperada, observaciones, detalle } = data;

      let subtotal = 0;
      detalle.forEach(item => {
        subtotal += parseFloat(item.subtotal);
      });
      const igv = subtotal * 0.18;
      const total = subtotal + igv;

      const compraResult = await client.query(
        `INSERT INTO compras_oc (numero_oc, id_proveedor, id_empleado, fecha_entrega_esperada, 
                                  estado, subtotal, igv, total, observaciones)
         VALUES ($1, $2, $3, $4, 'PENDIENTE', $5, $6, $7, $8) RETURNING *`,
        [numero_oc, id_proveedor, id_empleado, fecha_entrega_esperada, subtotal, igv, total, observaciones]
      );

      const id_compra = compraResult.rows[0].id_compra;

      for (const item of detalle) {
        await client.query(
          `INSERT INTO compras_detalle (id_compra, id_producto, cantidad, precio_unitario, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [id_compra, item.id_producto, item.cantidad, item.precio_unitario, item.subtotal]
        );
      }

      await client.query('COMMIT');
      return compraResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  update: async (id, data) => {
    const { fecha_entrega_esperada, estado, observaciones, aprobado_por } = data;
    const result = await pool.query(
      `UPDATE compras_oc 
       SET fecha_entrega_esperada = $1, estado = $2, observaciones = $3, 
           aprobado_por = $4, fecha_aprobacion = CASE WHEN $2 = 'APROBADA' THEN CURRENT_TIMESTAMP ELSE fecha_aprobacion END
       WHERE id_compra = $5 RETURNING *`,
      [fecha_entrega_esperada, estado, observaciones, aprobado_por, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(
      'DELETE FROM compras_oc WHERE id_compra = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  generateNumeroOC: async () => {
    const result = await pool.query(
      `SELECT numero_oc FROM compras_oc 
       WHERE numero_oc LIKE 'OC-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-%'
       ORDER BY numero_oc DESC LIMIT 1`
    );
    
    if (result.rows.length > 0) {
      const lastNumber = parseInt(result.rows[0].numero_oc.split('-')[2]);
      const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
      return `OC-${new Date().getFullYear()}-${nextNumber}`;
    } else {
      return `OC-${new Date().getFullYear()}-001`;
    }
  }
};

module.exports = PurchaseOrder;
