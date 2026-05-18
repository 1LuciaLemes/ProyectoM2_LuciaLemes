const {Pool} = require('pg');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
  // Producción en Railway
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // obligatorio para Railway
  });
} else {
  // Desarrollo local
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'miniblog_db',
    password: process.env.DB_PASSWORD || 'mipassword',
    port: process.env.DB_PORT || 5432,
  });
}
module.exports = pool;