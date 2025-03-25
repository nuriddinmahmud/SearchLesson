const { Sequelize, DataTypes } = require("sequelize");

const db = new Sequelize({
<<<<<<< HEAD
  dialect: "mysql", 
  host: "localhost",  
  username: "root",   
  password: "1234",   
  database: "mock",  
=======
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "12345678",
  database: "db",
>>>>>>> 723e08f8d868f856c842d28690a0513c636f0e4e
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
