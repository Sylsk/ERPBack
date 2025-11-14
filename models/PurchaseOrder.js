const pool = require('../db/connection');

const PurchaseOrder = {
  findAll: async () => {
    const result = await pool.query(
      `SELECT c.*, p.razon_social as proveedor_nombre, 
              e.nombre || ' ' || e.apellido as empleado_nombre
       FROM compras_oc c
       INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
       INNER JOIN empleados e ON c.id_empleado = e.id_empleado
       ORDER BY c.fecha_emision DESC`
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      `SELECT c.*, p.razon_social as proveedor_nombre, 
              e.nombre || ' ' || e.apellido as empleado_nombre
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
      `SELECT c.*, p.razon_social as proveedor_nombre, p.ruc, p.direccion as proveedor_direccion,
              e.nombre || ' ' || e.apellido as empleado_nombre, e.email as empleado_email
       FROM compras_oc c
       INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
       INNER JOIN empleados e ON c.id_empleado = e.id_empleado
       WHERE c.id_compra = $1`,
      [id]
    );
    
    const detalle = await pool.query(
      `SELECT d.*, prod.nombre as producto_nombre
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

      const { id_proveedor, id_empleado, detalle, subtotal, igv, total, fecha_entrega_esperada, observaciones } = data;

      const numeroOC = await PurchaseOrder.generateNumeroOC();

      const compraResult = await client.query(
        `INSERT INTO compras_oc 
         (numero_oc, id_proveedor, id_empleado, estado, subtotal, igv, total, fecha_entrega_esperada, observaciones)
         VALUES ($1, $2, $3, 'PENDIENTE', $4, $5, $6, $7, $8) RETURNING *`,
        [numeroOC, id_proveedor, id_empleado, subtotal, igv, total, fecha_entrega_esperada, observaciones]
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
    const allowedFields = ['estado', 'fecha_entrega_esperada', 'observaciones'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No hay campos válidos para actualizar');
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE compras_oc 
       SET ${fields.join(', ')}
       WHERE id_compra = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      await client.query(
        'DELETE FROM compras_detalle WHERE id_compra = $1',
        [id]
      );
      
      const result = await client.query(
        'DELETE FROM compras_oc WHERE id_compra = $1 RETURNING *',
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
    const result = await pool.query(
      'SELECT numero_oc FROM compras_oc ORDER BY id_compra DESC LIMIT 1'
    );
    
    if (result.rows.length === 0) {
      return 'OC-000001';
    }
    
    const lastNumero = result.rows[0].numero_oc;
    const numero = parseInt(lastNumero.split('-')[1]) + 1;
    return `OC-${numero.toString().padStart(6, '0')}`;
  },

  findAllWithCompleteInfo: async () => {
    try {
      const result = await pool.query(
        `SELECT 
          oc.id_compra,
          oc.numero_oc,
          oc.id_proveedor,
          oc.id_empleado,
          oc.fecha_emision,
          oc.fecha_entrega_esperada,
          oc.estado,
          oc.subtotal,
          oc.igv,
          oc.total,
          oc.observaciones,
          p.razon_social as proveedor_nombre,
          p.ruc as proveedor_ruc,
          p.direccion as proveedor_direccion,
          p.contacto_telefono as proveedor_telefono,
          e.nombre || ' ' || e.apellido as empleado_nombre,
          e.email as empleado_email,
          d.id_detalle,
          d.id_producto,
          prod.nombre as producto_nombre,
          prod.descripcion as producto_descripcion,
          d.cantidad,
          d.precio_unitario,
          d.subtotal as detalle_subtotal
        FROM compras_oc oc
        INNER JOIN proveedores p ON oc.id_proveedor = p.id_proveedor
        INNER JOIN empleados e ON oc.id_empleado = e.id_empleado
        LEFT JOIN compras_detalle d ON oc.id_compra = d.id_compra
        LEFT JOIN productos prod ON d.id_producto = prod.id_producto
        ORDER BY oc.fecha_emision DESC, oc.id_compra, d.id_detalle`
      );

      const comprasMap = new Map();
      
      result.rows.forEach(row => {
        const compraId = row.id_compra;
        
        if (!comprasMap.has(compraId)) {
          comprasMap.set(compraId, {
            id_compra: row.id_compra,
            numero_oc: row.numero_oc,
            id_proveedor: row.id_proveedor,
            id_empleado: row.id_empleado,
            fecha_emision: row.fecha_emision,
            fecha_entrega_esperada: row.fecha_entrega_esperada,
            estado: row.estado,
            subtotal: parseFloat(row.subtotal) || 0,
            igv: parseFloat(row.igv) || 0,
            total: parseFloat(row.total) || 0,
            observaciones: row.observaciones,
            proveedor: {
              nombre: row.proveedor_nombre,
              ruc: row.proveedor_ruc,
              direccion: row.proveedor_direccion,
              telefono: row.proveedor_telefono
            },
            empleado: {
              nombre: row.empleado_nombre,
              email: row.empleado_email
            },
            detalle: []
          });
        }
        
        if (row.id_detalle) {
          comprasMap.get(compraId).detalle.push({
            id_detalle: row.id_detalle,
            id_producto: row.id_producto,
            producto_nombre: row.producto_nombre,
            producto_descripcion: row.producto_descripcion,
            cantidad: parseInt(row.cantidad),
            precio_unitario: parseFloat(row.precio_unitario),
            subtotal: parseFloat(row.detalle_subtotal)
          });
        }
      });

      return Array.from(comprasMap.values());
    } catch (error) {
      throw error;
    }
  }
};

module.exports = PurchaseOrder;
