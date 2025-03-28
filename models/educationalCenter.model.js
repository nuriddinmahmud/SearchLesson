const { db, DataTypes } = require("../config/database");
const Region = require("./region.model");

const EducationalCenter = db.define(
  "EducationalCenter",
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
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Region,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);
module.exports = EducationalCenter;
