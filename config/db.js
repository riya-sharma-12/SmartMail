// const { Client } = require('pg');
// const dotenv = require('dotenv');
// dotenv.config();

// const db = new Client({
//   host: process.env.PG_HOST,
//   port: process.env.PG_PORT,
//   user: process.env.PG_USER,
//   password: process.env.PG_PASSWORD,
//   database: process.env.PG_DATABASE
// });

// db.connect();

// module.exports = db;


// config/sequelize.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

/* ─────────────────────────  Sequelize instance  ───────────────────────── */

const sequelize = new Sequelize(
  process.env.PG_DATABASE,          // database name
  process.env.PG_USER,              // username
  process.env.PG_PASSWORD,          // password
  {
    host:     process.env.PG_HOST,
    port:     process.env.PG_PORT,
    dialect:  'postgres',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

/* ──────────────────────────  Test the connection  ─────────────────────── */

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅  Sequelize connected to PostgreSQL');
  } catch (err) {
    console.error('❌  Unable to connect:', err.message);
    process.exit(1);
  }
}

testConnection();

module.exports = sequelize;
