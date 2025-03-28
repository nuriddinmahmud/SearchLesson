// fieldBra.model.js
const { DataTypes, db } = require("../config/database");

const fieldBra = db.define(
  "fieldBra",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Fields",
        key: "id",
      },
    },
  },
  { timestamps: false }
);

module.exports = fieldBra;
