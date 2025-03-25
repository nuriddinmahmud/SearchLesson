const { Sequelize, DataTypes } = require("sequelize");

const db = new Sequelize("db", "root", "12345678", {
  host: "localhost",
  dialect: "mysql",})

module.exports = { db, DataTypes };
