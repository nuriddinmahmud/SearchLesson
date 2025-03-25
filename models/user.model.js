<<<<<<< HEAD
const {db, DataTypes} = require("../config/database")
const User = db.define("User", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
=======
const { DataTypes, db } = require("sequelize");

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
>>>>>>> a237af67e865a2ce069f3cceb9a6e485fedd6062
  },
  { timestamps: true }
);

<<<<<<< HEAD
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
}, {timestamps: true});

module.exports=  User;
=======
module.exports = User;
>>>>>>> a237af67e865a2ce069f3cceb9a6e485fedd6062
