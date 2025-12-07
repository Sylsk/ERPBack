const pool = require('../db/connection');

async function checkProductColumns() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'producto'
    `);
    console.log('Columnas en producto:', res.rows.map(r => r.column_name));
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
    pool.end();
  }
}

checkProductColumns();
