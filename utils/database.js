const Sequelize = require('sequelize')

const sequelize = new Sequelize("sequelized", "root", "@selassie123", {
  dialect: "mysql",
  host: "localhost",
});

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-tut",
  password: "@selassie123",
});

const databases = {
  pool: pool.promise(),
  sequelize
};

module.exports = databases;
