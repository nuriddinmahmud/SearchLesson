const { Sequelize, DataTypes } = require("sequelize");

const db = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "12345678",
  database: "db",
});

module.exports = { db, DataTypes };
