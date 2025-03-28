const { DataTypes, db } = require("../config/database");

const subjectEdu = db.define(
  "subjectEdu",
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
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Subjects",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = subjectEdu;
