const pool = require('../db/connection');
const ProductRequest = require('../models/ProductRequest');
// const Product = require('../models/Product'); // Ya no es necesario

const productController = {
  createFromRequest: async (req, res) => {
    const client = await pool.connect();
    
    try {
      const { solicitud_id, producto, vinculacion_proveedor } = req.body;

      // Validaciones básicas
      if (!solicitud_id || !producto || !vinculacion_proveedor) {
        return res.status(400).json({ error: 'Faltan datos requeridos en el payload' });
      }

      await client.query('BEGIN');

      // Paso 1: Crear el Producto
      // El código se genera automáticamente por el trigger (ahora corregido)
      const insertProductQuery = `
        INSERT INTO public.producto 
        (nombre, descripcion, precio_venta, cantidad, estado)
        VALUES ($1, $2, $3, 0, true)
        RETURNING id_producto
      `;
      
      const productResult = await client.query(insertProductQuery, [
        producto.nombre,
        producto.descripcion,
        producto.precio_venta
      ]);
      
      const id_producto = productResult.rows[0].id_producto;

      // Paso 2: Vincular Proveedor (producto_proveedor)
      const insertProdProvQuery = `
        INSERT INTO public.producto_proveedor 
        (id_producto, id_proveedor, precio_proveedor, activo)
        VALUES ($1, $2, $3, true)
      `;
      
      await client.query(insertProdProvQuery, [
        id_producto,
        vinculacion_proveedor.id_proveedor,
        vinculacion_proveedor.precio_costo
      ]);

      // Paso 3: Cerrar Solicitud
      await ProductRequest.closeRequest(solicitud_id, client);

      // Paso 4: Commit
      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Producto creado y vinculado al proveedor exitosamente',
        data: {
          id_producto
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en createFromRequest:', error);
      
      // Manejo de errores específicos
      if (error.code === '23505') { // unique_violation
        return res.status(400).json({ 
          error: 'Error de duplicidad: Conflicto único en la creación del producto.' 
        });
      }

      res.status(500).json({ 
        error: 'Error interno al procesar la solicitud',
        details: error.message 
      });
    } finally {
      client.release();
    }
  }
};

module.exports = productController;
