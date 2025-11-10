const pool = require('../db/connection');

const ProductosSinStockController = {
  
  /**
   * Obtener todos los productos sin stock desde la tabla automática
   * GET /api/productos-sin-stock
   */
  obtenerProductosSinStock: async (req, res) => {
    try {
      const query = `
        SELECT 
          pss.id_producto,
          pss.nombre,
          pss.descripcion,
          pss.precio_unitario,
          pss.codigo,
          pss.precio_venta,
          pss.fecha_sin_stock,
          p.cantidad,
          p.estado
        FROM public.productos_sin_stock pss
        LEFT JOIN public.producto p ON pss.id_producto = p.id_producto
        ORDER BY pss.fecha_sin_stock DESC;
      `;

      const result = await pool.query(query);
      
      res.status(200).json({
        success: true,
        message: `Se encontraron ${result.rows.length} productos faltantes`,
        data: result.rows,
        total: result.rows.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al obtener productos sin stock:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  /**
   * Obtener un producto específico sin stock por ID
   * GET /api/productos-sin-stock/:id
   */
  obtenerProductoSinStockPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          pss.id_producto,
          pss.nombre,
          pss.descripcion,
          pss.precio_unitario,
          pss.codigo,
          pss.precio_venta,
          pss.fecha_sin_stock,
          p.cantidad,
          p.estado
        FROM public.productos_sin_stock pss
        LEFT JOIN public.producto p ON pss.id_producto = p.id_producto
        WHERE pss.id_producto = $1;
      `;

      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado en la lista de productos sin stock'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Producto sin stock encontrado',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Error al obtener producto sin stock por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  /**
   * Obtener productos sin stock con paginación
   * GET /api/productos-sin-stock/paginado?page=1&limit=10
   */
  obtenerProductosSinStockPaginado: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Consulta con paginación
      const query = `
        SELECT 
          pss.id_producto,
          pss.nombre,
          pss.descripcion,
          pss.precio_unitario,
          pss.codigo,
          pss.precio_venta,
          pss.fecha_sin_stock,
          p.cantidad,
          p.estado
        FROM public.productos_sin_stock pss
        LEFT JOIN public.producto p ON pss.id_producto = p.id_producto
        ORDER BY pss.fecha_sin_stock DESC
        LIMIT $1 OFFSET $2;
      `;

      // Consulta para contar total
      const countQuery = 'SELECT COUNT(*) as total FROM public.productos_sin_stock';

      const [dataResult, countResult] = await Promise.all([
        pool.query(query, [limit, offset]),
        pool.query(countQuery)
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      res.status(200).json({
        success: true,
        message: `Página ${page} de productos sin stock`,
        data: dataResult.rows,
        pagination: {
          current_page: page,
          per_page: limit,
          total_items: total,
          total_pages: totalPages,
          has_next_page: page < totalPages,
          has_prev_page: page > 1
        }
      });

    } catch (error) {
      console.error('Error al obtener productos sin stock paginados:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

};

module.exports = ProductosSinStockController;