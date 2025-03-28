const { db, DataTypes } = require("../config/database");

const Reception = db.define(
  "Reception",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    branchID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    educationCenterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);
module.exports = Reception;
