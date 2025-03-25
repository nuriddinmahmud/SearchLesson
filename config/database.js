const { Sequelize, DataTypes } = require("sequelize");

<<<<<<< HEAD
const db = new Sequelize("db", "root", "12345678", {
  host: "localhost",
  dialect: "mysql",
=======
const db = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "12345678",
  database: "db",
<<<<<<< HEAD
=======
=======
  dialect: "mysql", 
  host: "localhost",  
  username: "root",   
  password: "12345678",   
  database: "db",  
>>>>>>> 9b06d7e0d15c85f27552123d4e170e681577d75f
>>>>>>> 27f3e6a864fce956eb92aa43d286c9455dd88dce
>>>>>>> 69ea06fd3cebd358294906cc6c5a321e0a31ed58
});

module.exports = { db, DataTypes };
