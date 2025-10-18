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

async function checkSupplier() {
  try {
    console.log('🔍 Revisando proveedor ID 2...');
    
    const result = await pool.query(
      'SELECT id_proveedor, razon_social, activo FROM proveedores WHERE id_proveedor = 2'
    );
    
    if (result.rows.length > 0) {
      const proveedor = result.rows[0];
      console.log('✅ Proveedor encontrado:');
      console.log('- ID:', proveedor.id_proveedor);
      console.log('- Razón Social:', proveedor.razon_social);
      console.log('- Activo:', proveedor.activo);
      
      if (proveedor.activo === false) {
        console.log('💡 El proveedor está marcado como INACTIVO (eliminado lógicamente)');
      } else {
        console.log('💡 El proveedor está ACTIVO');
      }
    } else {
      console.log('❌ No se encontró proveedor con ID 2');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSupplier();
