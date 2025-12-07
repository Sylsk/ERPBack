const fs = require('fs');
const path = require('path');
const pool = require('./db/connection');

async function setupViews() {
  try {
    const sqlPath = path.join(__dirname, 'powerbi_views.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Ejecutando script SQL para crear vistas de Power BI...');
    await pool.query(sql);
    console.log('Vistas creadas exitosamente.');
  } catch (error) {
    console.error('Error al crear las vistas:', error);
  } finally {
    await pool.end();
  }
}

setupViews();
