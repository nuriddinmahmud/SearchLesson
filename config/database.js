const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const db = new Sequelize(
<<<<<<< HEAD
  "exam3",
=======
  "db",
>>>>>>> 297ffa73910667d0a866be08e75b6529deffdce7
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