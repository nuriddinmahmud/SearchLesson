const { db, DataTypes } = require("../config/database");
const Field = require("./field.model");
const EducationCenter = require("./educationalCenter.model");

const collabField = db.define(
  "collabField",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fieldID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Field,
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    educationCenterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EducationCenter,
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
  },
  { timestamps: false }
);

module.exports = collabField;
