const { Sequelize, DataTypes } = require("sequelize");

<<<<<<< HEAD
const db = new Sequelize({
  dialect: "mysql", 
  host: "localhost",  
  username: "root",   
  password: "1234",   
  database: "mock",  
});
=======
const db = new Sequelize("db", "root", "12345678", {
  host: "localhost",
  dialect: "mysql",})
>>>>>>> ddf8b46dccd4dea8361d7f3bc8987b0f30b61266

module.exports = { db, DataTypes, Sequelize };
