const fs = require('fs');
const path = require('path');
const pool = require('./db/connection');

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Inicializando base de datos...');
    
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'db', 'schema.sql'),
      'utf8'
    );
    
    console.log('Ejecutando schema.sql...');
    await client.query(schemaSQL);
    console.log('Schema creado exitosamente');
    
    const seedSQL = fs.readFileSync(
      path.join(__dirname, 'db', 'seed.sql'),
      'utf8'
    );
    
    console.log('Ejecutando seed.sql...');
    await client.query(seedSQL);
    console.log('Datos de prueba insertados exitosamente');
    
    console.log('Base de datos inicializada correctamente');
    
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initializeDatabase()
  .then(() => {
    console.log('Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
