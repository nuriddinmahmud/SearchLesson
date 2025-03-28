const { DataTypes, db } = require("../config/database");

const subjectBra = db.define(
  "subjectBra",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { timestamps: false }
);

module.exports = subjectBra;
