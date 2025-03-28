const { DataTypes, db } = require("../config/database");

const subjectEdu = db.define(
  "subjectEdu",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { timestamps: false }
);

module.exports = subjectEdu;
