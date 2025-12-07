const pool = require('../db/connection');

async function checkColumns() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'productos_sin_stock'
    `);
    console.log('Columnas en productos_sin_stock:', res.rows.map(r => r.column_name));
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
    pool.end();
  }
}

checkColumns();
