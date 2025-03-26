const { db, DataTypes } = require("../config/database");
const Region = require("./region.model");
const User = require("./user.model");

const EducationCenter = db.define(
  "EducationCenter",
  {
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
    star: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    regionID: {
      type: DataTypes.INTEGER,
      references: {
        model: Region,
        key: "id",
      },
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = EducationCenter;
