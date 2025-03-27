const { db, DataTypes } = require("../config/database");

const Session = db.define(
  "Session",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deviceInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false }
);

module.exports = Session;
