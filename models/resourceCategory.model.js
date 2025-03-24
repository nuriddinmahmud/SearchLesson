const { db, DataTypes } = require("../config/database");

const resourceCategory = db.define(
  "resourceCategory",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = resourceCategory;
