const { db, DataTypes } = require("../config/database");
const Region = require("./region.model");

const User = db.define(
  "User",
  {
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
    regionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Region,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
  }
);

User.belongsTo(Region, { foreignKey: "regionID", onDelete: "CASCADE", onUpdate: "CASCADE" });
Region.hasMany(User, { foreignKey: "regionID", onDelete: "CASCADE", onUpdate: "CASCADE" });

module.exports = User;
