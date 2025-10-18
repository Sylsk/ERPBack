const pool = require('../db/connection');

const PurchaseOrder = {
  findAll: async () => {
    const result = await pool.query(
      `SELECT c.*, p.nombre as proveedor_nombre, e.nombre || ' ' || e.apellido as empleado_nombre
       FROM "Compras".compras_oc c
       INNER JOIN public.proveedor p ON c.id_proveedor = p.id_proveedor
       INNER JOIN public.empleado e ON c.id_empleado = e.id_empleado
       ORDER BY c.fecha DESC`
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      `SELECT c.*, p.nombre as proveedor_nombre, e.nombre || ' ' || e.apellido as empleado_nombre
       FROM "Compras".compras_oc c
       INNER JOIN public.proveedor p ON c.id_proveedor = p.id_proveedor
       INNER JOIN public.empleado e ON c.id_empleado = e.id_empleado
       WHERE c.id_orden_compra = $1`,
      [id]
    );
    return result.rows[0];
  },

  findWithDetails: async (id) => {
    const compra = await pool.query(
      `SELECT c.*, p.nombre as proveedor_nombre, p.rut, p.direccion as proveedor_direccion,
              e.nombre || ' ' || e.apellido as empleado_nombre, e.email as empleado_email
       FROM "Compras".compras_oc c
       INNER JOIN public.proveedor p ON c.id_proveedor = p.id_proveedor
       INNER JOIN public.empleado e ON c.id_empleado = e.id_empleado
       WHERE c.id_orden_compra = $1`,
      [id]
    );
    
    const detalle = await pool.query(
      `SELECT d.*, prod.nombre as producto_nombre
       FROM "Compras".compras_detalle d
       INNER JOIN public.producto prod ON d.id_producto = prod.id_producto
       WHERE d.id_orden_compra = $1
       ORDER BY d.id_detalle_compra`,
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

      const { id_proveedor, id_empleado, detalle } = data;

      let total_compra = 0;
      detalle.forEach(item => {
        total_compra += parseFloat(item.subtotal);
      });

      const compraResult = await client.query(
        `INSERT INTO "Compras".compras_oc (id_proveedor, id_empleado, estado)
         VALUES ($1, $2, 'pendiente') RETURNING *`,
        [id_proveedor, id_empleado]
      );

      const id_orden_compra = compraResult.rows[0].id_orden_compra;

      for (const item of detalle) {
        await client.query(
          `INSERT INTO "Compras".compras_detalle (id_orden_compra, id_producto, cantidad, precio_unitario, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [id_orden_compra, item.id_producto, item.cantidad, item.precio_unitario, item.subtotal]
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
    const { estado } = data;
    const result = await pool.query(
      `UPDATE "Compras".compras_oc 
       SET estado = $1
       WHERE id_orden_compra = $2 RETURNING *`,
      [estado, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    // Usamos una transacción para eliminar en cascada
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Primero eliminamos los detalles
      await client.query(
        'DELETE FROM "Compras".compras_detalle WHERE id_orden_compra = $1',
        [id]
      );
      
      // Luego eliminamos la orden principal
      const result = await client.query(
        'DELETE FROM "Compras".compras_oc WHERE id_orden_compra = $1 RETURNING *',
        [id]
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

  generateNumeroOC: async () => {
    // Esta función ya no es necesaria según la nueva estructura
    const timestamp = Date.now();
    return `OC-${timestamp}`;
  }
};

module.exports = PurchaseOrder;
