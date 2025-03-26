<<<<<<< HEAD
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
=======
const { DataTypes, db } = require("../config/database");

const User = db.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

>>>>>>> ddf8b46dccd4dea8361d7f3bc8987b0f30b61266
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
<<<<<<< HEAD
=======

>>>>>>> ddf8b46dccd4dea8361d7f3bc8987b0f30b61266
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
<<<<<<< HEAD
=======

>>>>>>> ddf8b46dccd4dea8361d7f3bc8987b0f30b61266
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
<<<<<<< HEAD
=======

>>>>>>> ddf8b46dccd4dea8361d7f3bc8987b0f30b61266
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
<<<<<<< HEAD
=======

>>>>>>> ddf8b46dccd4dea8361d7f3bc8987b0f30b61266
    yearOfBirth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
<<<<<<< HEAD
=======

>>>>>>> ddf8b46dccd4dea8361d7f3bc8987b0f30b61266
    role: {
      type: DataTypes.ENUM("Admin", "User", "Ceo", "SuperAdmin"),
      allowNull: false,
    },
<<<<<<< HEAD
=======

>>>>>>> ddf8b46dccd4dea8361d7f3bc8987b0f30b61266
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
<<<<<<< HEAD
=======

>>>>>>> ddf8b46dccd4dea8361d7f3bc8987b0f30b61266
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: true,
      defaultValue: "Inactive",
    },
  },
  { timestamps: true }
);

module.exports = User;
