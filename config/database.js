const { Sequelize, DataTypes } = require("sequelize");

const db = new Sequelize({
  dialect: "mysql", 
  host: "localhost",  
  username: "root",   
  password: "1234",   
  database: "mock",  
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
