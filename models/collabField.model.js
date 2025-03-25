const { db, DataTypes } = require("../config/database");
const Field = require("./field.model");
<<<<<<< HEAD
const EducationCenter = require("./educationalCenter.model");
=======
const EducationCenter = require("./educationCenter.model");
>>>>>>> 9b06d7e0d15c85f27552123d4e170e681577d75f

const collabField = db.define(
  "collabField",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Field,
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    educationCenterId: {
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
