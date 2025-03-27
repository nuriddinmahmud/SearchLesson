const { db, DataTypes } = require("../config/database");
const User = require("./user.model");
const EducationCenter = require("./educationalCenter.model");
const Field = require("./field.model");
const Branch = require("./educationalCenter.model");

const Reception = db.define(
  "Reception",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fieldID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Field,
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    branchID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Branch,
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    educationCenterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EducationCenter,
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
  },
  { timestamps: false }
);

module.exports = Reception;
