
const mysql2 = require('mysql2/promise');
require('dotenv').config();

const db = new mysql2.createPool({
    host: 'localhost',
    user: 'root',
    database: 'emptracker',
    password: process.env.db_passwd,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

module.exports = db;