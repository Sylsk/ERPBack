const pool = require('../db/connection');

/**
 * Script para probar los endpoints de productos modificados
 * Verifica que ahora se muestren productos sin stock
 */

const probarEndpointsProductos = async () => {
  try {
    console.log('🧪 Probando endpoints de productos modificados...\n');

    // 1. Probar consulta directa a la tabla
    console.log('1️⃣ Consultando directamente la tabla producto:');
    const todosLosProductos = await pool.query(
      'SELECT id_producto, nombre, cantidad, estado FROM public.producto ORDER BY estado DESC, nombre'
    );

    console.log('=' .repeat(80));
    console.log('ID  | Nombre                          | Cantidad | Estado');
    console.log('=' .repeat(80));
    todosLosProductos.rows.forEach(p => {
      const estadoIcon = p.estado ? '✅' : '❌';
      const stockIcon = p.cantidad > 0 ? '📦' : '🔴';
      console.log(
        `${String(p.id_producto).padEnd(3)} | ` +
        `${String(p.nombre).substring(0, 31).padEnd(31)} | ` +
        `${String(p.cantidad).padEnd(8)} | ` +
        `${estadoIcon} ${p.estado} ${stockIcon}`
      );
    });
    console.log('=' .repeat(80));
    console.log(`Total productos: ${todosLosProductos.rows.length}\n`);

    // 2. Probar método findAll del modelo
    console.log('2️⃣ Probando Product.findAll() (método modificado):');
    const Product = require('../models/Product');
    const productosModelo = await Product.findAll();
    console.log(`   Productos obtenidos: ${productosModelo.length}`);
    console.log(`   Incluye productos sin stock: ${productosModelo.some(p => p.cantidad === 0) ? 'SÍ ✅' : 'NO ❌'}`);
    console.log(`   Incluye productos deshabilitados: ${productosModelo.some(p => p.estado === false) ? 'SÍ ✅' : 'NO ❌'}\n`);

    // 3. Probar método con información de stock
    console.log('3️⃣ Probando Product.findAllWithStockInfo():');
    const productosConInfo = await Product.findAllWithStockInfo();
    console.log(`   Productos con info de stock: ${productosConInfo.length}`);
    
    const estadosStock = productosConInfo.reduce((acc, p) => {
      acc[p.estado_stock] = (acc[p.estado_stock] || 0) + 1;
      return acc;
    }, {});
    
    console.log('   Distribución por estado de stock:');
    Object.entries(estadosStock).forEach(([estado, cantidad]) => {
      console.log(`   • ${estado}: ${cantidad} productos`);
    });

    // 4. Mostrar ejemplos de URLs para el frontend
    console.log('\n🌐 URLs disponibles para el frontend:');
    console.log('=' .repeat(60));
    console.log('• Todos los productos (incluye sin stock):');
    console.log('  GET http://localhost:3000/api/products');
    console.log('');
    console.log('• Productos con información de stock:');
    console.log('  GET http://localhost:3000/api/products?with_stock_info=true');
    console.log('');
    console.log('• Solo productos disponibles:');
    console.log('  GET http://localhost:3000/api/products/available');
    console.log('');
    console.log('• Productos de un proveedor específico:');
    console.log('  GET http://localhost:3000/api/products?supplier_id=1');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
    console.log('\n🔌 Conexión cerrada');
  }
};

probarEndpointsProductos();