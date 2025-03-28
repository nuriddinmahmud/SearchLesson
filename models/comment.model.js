const { db, DataTypes } = require("../config/database");
const User = require("./user.model");
const EducationalCenter = require("./educationalCenter.model");

const Comment = db.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    star: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    educationalCenterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EducationalCenter,
        key: "id",
      },
    },
  },
  { timestamps: false }
);
module.exports = Comment;
