<<<<<<< HEAD
const { DataTypes, db } = require("sequelize");
=======
const { DataTypes, db } = require("../config/database");
>>>>>>> 9b06d7e0d15c85f27552123d4e170e681577d75f

const User = db.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    yearOfBirth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("Admin", "User", "Ceo", "SuperAdmin"),
      allowNull: false,
    },

    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: true,
      defaultValue: "Inactive",
    },
  },
  { timestamps: true }
);

module.exports = User;
