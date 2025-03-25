const { Sequelize, DataTypes } = require("sequelize");

const db = new Sequelize({
<<<<<<< HEAD
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "12345678",
  database: "db",
=======
  dialect: "mysql", 
  host: "localhost",  
  username: "root",   
  password: "12345678",   
  database: "db",  
>>>>>>> 9b06d7e0d15c85f27552123d4e170e681577d75f
});

async function connect() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully!");
    db.sync({ force: true });
    console.log("Database synced!");
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
}

module.exports = { db, DataTypes, connect };
