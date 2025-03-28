const { DataTypes, db } = require("../config/database");

const fieldEdu = db.define(
  "fieldEdu",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    educationalCenterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "EducationalCenters",
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
  {
    timestamps: false,
    tableName: "fieldEdu", 
  }
);

module.exports = fieldEdu;
