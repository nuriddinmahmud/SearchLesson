const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const db = new Sequelize(
<<<<<<< HEAD
  "exaaaaaaaam",
=======
  "db",
>>>>>>> acef5f98e2889aa7d90f88bfc01d4c01309d7d07
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