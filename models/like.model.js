const { db, DataTypes } = require("../config/database");
const User = require("./user.model");
const EducationCenter = require("./educationalCenter.model");

const Like = db.define(
  "Like",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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

Like.belongsTo(User, {
  foreignKey: "userID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Like, {
  foreignKey: "userID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Like.belongsTo(EducationCenter, {
  foreignKey: "educationCenterID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EducationCenter.hasMany(Like, {
  foreignKey: "educationCenterID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Like;
