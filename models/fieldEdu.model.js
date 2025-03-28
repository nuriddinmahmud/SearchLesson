const { DataTypes, db } = require("../config/database");

const fieldEdu = db.define(
  "fieldEdu",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { timestamps: false }
);

module.exports = fieldEdu;
