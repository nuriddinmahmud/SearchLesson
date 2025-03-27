const { db, DataTypes } = require("../config/database");
const Region = require("./region.model");
const User = require("./user.model");

const EducationalCenter = db.define(
  "EducationalCenter",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    regionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Region,
        key: "id",
      },
    },

  },
  {
    timestamps: false,
  }
);

User.hasMany(EducationalCenter, {
  foreignKey: "userID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EducationalCenter.belongsTo(User, { foreignKey: "userID" });

Region.hasMany(EducationalCenter, {
  foreignKey: "regionID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EducationalCenter.belongsTo(Region, { foreignKey: "regionID" });

module.exports = EducationalCenter;
