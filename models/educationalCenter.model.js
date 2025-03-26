<<<<<<< HEAD
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Region = require("./regions.model");
const Users = require("./users.model");

const EducationCenter = sequelize.define(
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
        model: Users,
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
  { timestamps: true }
);

=======
const { DataTypes, db } = require("../config/database.js");
const Region = require("./region.model.js");
const Users = require("./user.model.js");

const EducationCenter = db.define(
  "EducationCenter",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
        model: Users,
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
  },
  { timestamps: true }
);

>>>>>>> ddf8b46dccd4dea8361d7f3bc8987b0f30b61266
module.exports = EducationCenter;
