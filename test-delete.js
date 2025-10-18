const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function testDelete() {
  try {
    console.log('🧪 Probando eliminación de proveedor...');
    
    // Ver estado actual del proveedor 2
    console.log('\n📋 Estado ANTES de "eliminar":');
    const before = await pool.query('SELECT id_proveedor, razon_social, activo FROM proveedores WHERE id_proveedor = 2');
    console.log(before.rows);
    
    // "Eliminar" (actualizar activo = false)
    console.log('\n🗑️ Ejecutando "eliminación":');
    const deleteResult = await pool.query(
      'UPDATE proveedores SET activo = false WHERE id_proveedor = 2 RETURNING *'
    );
    console.log('Filas afectadas:', deleteResult.rowCount);
    console.log('Resultado:', deleteResult.rows[0]?.razon_social || 'Sin resultado');
    
    // Ver estado después
    console.log('\n📋 Estado DESPUÉS de "eliminar":');
    const after = await pool.query('SELECT id_proveedor, razon_social, activo FROM proveedores WHERE id_proveedor = 2');
    console.log(after.rows);
    
    // Intentar "eliminar" de nuevo
    console.log('\n🗑️ Intentando "eliminar" otra vez:');
    const deleteAgain = await pool.query(
      'UPDATE proveedores SET activo = false WHERE id_proveedor = 2 RETURNING *'
    );
    console.log('Filas afectadas:', deleteAgain.rowCount);
    console.log('¿Siempre devuelve resultado?', deleteAgain.rows.length > 0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testDelete();
