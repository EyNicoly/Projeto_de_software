// backend/config/database.js

const { Sequelize } = require('sequelize');
require('dotenv').config({ path: __dirname + '/../.env' }); // Aponta para o .env na pasta backend

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

module.exports = sequelize;