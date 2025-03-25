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
  password: "1234",   
  database: "mock",  
>>>>>>> a237af67e865a2ce069f3cceb9a6e485fedd6062
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
