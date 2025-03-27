const { db, DataTypes } = require("../config/database");

const Field = db.define("Field", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Field;
