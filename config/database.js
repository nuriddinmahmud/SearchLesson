const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const db = new Sequelize(
  "exaaaaaaaam",
  "root",
  "0901",
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