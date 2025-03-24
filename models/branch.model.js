const { db, DataTypes } = require("../config/database");
const Region = require("./region.model");
const EducationalCenter = require("./educationalCenter.model");

const Branch = db.define("Branch", {
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
    references: {
      model: Region,
      key: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    allowNull: false,
  },

  centreID: {
    type: DataTypes.INTEGER,
    references: {
      model: EducationalCenter,
      key: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    allowNull: false,
  },
}, { timestamps: false });  

module.exports = Branch;
