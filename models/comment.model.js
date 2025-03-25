const { db, DataTypes } = require("../config/database");
const User = require("./user.model");
const EducationCenter = require("./educationCenter.model");

const Comment = db.define("Comment", {
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  educationCenterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EducationCenter,
      key: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
}, { timestamps: false });

module.exports = Comment;
