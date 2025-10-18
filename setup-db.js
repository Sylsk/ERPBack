const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  try {
    console.log('Conectando a la base de datos...');
    
    // Leer y ejecutar schema.sql
    console.log('Ejecutando schema.sql...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
    await pool.query(schemaSQL);
    console.log('✅ Tablas creadas exitosamente');
    
    // Leer y ejecutar seed.sql
    console.log('Ejecutando seed.sql...');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), 'utf8');
    await pool.query(seedSQL);
    console.log('✅ Datos iniciales cargados exitosamente');
    
    console.log('🎉 Base de datos configurada correctamente');
    
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
