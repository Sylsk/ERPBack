const pool = require('../db/connection');

/**
 * Script para probar el endpoint de productos por proveedor
 * Verifica que ahora incluya productos sin stock
 */

const probarProductosPorProveedor = async () => {
  try {
    console.log('🧪 Probando endpoint de productos por proveedor...\n');

    // 1. Mostrar todos los proveedores disponibles
    console.log('1️⃣ Proveedores disponibles:');
    const proveedores = await pool.query(
      'SELECT id_proveedor, nombre FROM public.proveedor WHERE activo = true ORDER BY nombre'
    );

    if (proveedores.rows.length === 0) {
      console.log('❌ No hay proveedores activos');
      return;
    }

    console.log('=' .repeat(50));
    proveedores.rows.forEach(p => {
      console.log(`ID: ${p.id_proveedor} | ${p.nombre}`);
    });
    console.log('=' .repeat(50));

    // 2. Probar con el primer proveedor
    const primerProveedor = proveedores.rows[0];
    console.log(`\n2️⃣ Probando con proveedor: ${primerProveedor.nombre} (ID: ${primerProveedor.id_proveedor})`);

    // Usar el modelo Product directamente
    const Product = require('../models/Product');
    const productosProveedor = await Product.findBySupplier(primerProveedor.id_proveedor);

    console.log(`\n📦 Productos del proveedor ${primerProveedor.nombre}:`);
    console.log('=' .repeat(100));
    console.log('ID  | Nombre                          | Cantidad | Estado | Stock     | Precio Prov.');
    console.log('=' .repeat(100));

    if (productosProveedor.length === 0) {
      console.log('❌ No hay productos para este proveedor');
    } else {
      productosProveedor.forEach(p => {
        const estadoIcon = p.estado ? '✅' : '❌';
        const stockIcon = p.cantidad > 0 ? '📦' : '🔴';
        console.log(
          `${String(p.id_producto).padEnd(3)} | ` +
          `${String(p.nombre).substring(0, 31).padEnd(31)} | ` +
          `${String(p.cantidad).padEnd(8)} | ` +
          `${estadoIcon}     | ` +
          `${String(p.estado_stock || 'N/A').padEnd(9)} | ` +
          `$${p.precio_proveedor}`
        );
      });
    }
    console.log('=' .repeat(100));
    console.log(`Total productos: ${productosProveedor.length}`);
    console.log(`Con stock: ${productosProveedor.filter(p => p.cantidad > 0).length}`);
    console.log(`Sin stock: ${productosProveedor.filter(p => p.cantidad === 0).length}`);

    // 3. Mostrar URLs para probar en el navegador/frontend
    console.log('\n🌐 URLs para probar en tu frontend:');
    console.log('=' .repeat(70));
    proveedores.rows.slice(0, 3).forEach(p => {
      console.log(`• Proveedor "${p.nombre}": http://localhost:3000/api/products?supplier_id=${p.id_proveedor}`);
    });
    console.log('=' .repeat(70));

    // 4. Verificar la tabla producto_proveedor
    console.log('\n4️⃣ Verificando relaciones producto-proveedor:');
    const relaciones = await pool.query(`
      SELECT 
        pp.id_proveedor,
        prov.nombre as proveedor,
        COUNT(*) as total_productos,
        COUNT(CASE WHEN p.estado = true THEN 1 END) as productos_activos,
        COUNT(CASE WHEN p.cantidad = 0 THEN 1 END) as productos_sin_stock
      FROM producto_proveedor pp
      INNER JOIN public.proveedor prov ON pp.id_proveedor = prov.id_proveedor
      INNER JOIN public.producto p ON pp.id_producto = p.id_producto
      WHERE pp.activo = true
      GROUP BY pp.id_proveedor, prov.nombre
      ORDER BY total_productos DESC
    `);

    console.log('\nResumen por proveedor:');
    console.log('=' .repeat(80));
    console.log('Proveedor                | Total | Activos | Sin Stock');
    console.log('=' .repeat(80));
    relaciones.rows.forEach(r => {
      console.log(
        `${String(r.proveedor).substring(0, 24).padEnd(24)} | ` +
        `${String(r.total_productos).padEnd(5)} | ` +
        `${String(r.productos_activos).padEnd(7)} | ` +
        `${r.productos_sin_stock}`
      );
    });
    console.log('=' .repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
    console.log('\n🔌 Conexión cerrada');
  }
};

probarProductosPorProveedor();