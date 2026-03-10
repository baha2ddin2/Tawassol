import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'bahaeddine' ,
  password: process.env.DB_PASSWORD||'itsBAHAE99@',
  database: process.env.DB_DATABASE ||'Tawassol'
});

pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

const db = pool.promise();
export default db;