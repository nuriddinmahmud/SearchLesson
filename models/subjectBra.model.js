// subjectBra.model.js
const { DataTypes, db } = require("../config/database");

const subjectBra = db.define(
  "subjectBra",
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
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Subjects",
        key: "id",
      },
    },
  },
  { timestamps: false }
);

module.exports = subjectBra;
