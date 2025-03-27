const { db, DataTypes } = require("../config/database");
const Region = require("./region.model");
const EducationalCenter = require("./educationalCenter.model");

const Branch = db.define(
  "Branch",
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

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    regionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Region,
        key: "id",
      },
    },

    centreID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EducationalCenter,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

Region.hasMany(Branch, {
  foreignKey: "regionID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Branch.belongsTo(Region, { foreignKey: "regionID" });

EducationalCenter.hasMany(Branch, {
  foreignKey: "centreID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Branch.belongsTo(EducationalCenter, { foreignKey: "centreID" });

module.exports = Branch;
