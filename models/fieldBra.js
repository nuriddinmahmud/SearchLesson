const { DataTypes, db } = require("../config/database");

const fieldBra = db.define(
  "fieldBra",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { timestamps: false }
);

module.exports = fieldBra;
