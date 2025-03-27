const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const db = new Sequelize(
  "db",
  "root",
  "12345678",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

module.exports = {
  db,
  DataTypes,
  Sequelize,
};