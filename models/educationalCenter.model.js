const { db, DataTypes } = require("../config/database");
const Region = require("./region.model");
const User = require("./user.model");

const EducationalCenter = db.define(
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      allowNull: false,
    },
    regionID: {
      type: DataTypes.INTEGER,
      references: {
        model: Region,
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = EducationalCenter;
