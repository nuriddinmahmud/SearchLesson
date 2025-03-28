const { db, DataTypes } = require("../config/database");

const Branch = db.define(
  "Branch",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    regionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    educationalCenterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "centreID",
    },
  },
  { timestamps: true }
);
module.exports = Branch;
