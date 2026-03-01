import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

const db = pool.promise();
export default db;