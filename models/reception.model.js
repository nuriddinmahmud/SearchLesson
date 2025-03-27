const { db, DataTypes } = require("../config/database");
const User = require("./user.model");
const EducationCenter = require("./educationalCenter.model");
const Field = require("./field.model");
const Branch = require("./branch.model"); // **Branch modelini to'g'ri import qildim**

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

Reception.belongsTo(Field, {
  foreignKey: "fieldID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Field.hasMany(Reception, {
  foreignKey: "fieldID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Reception.belongsTo(Branch, {
  foreignKey: "branchID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Branch.hasMany(Reception, {
  foreignKey: "branchID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Reception.belongsTo(User, {
  foreignKey: "userID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Reception, {
  foreignKey: "userID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Reception.belongsTo(EducationCenter, {
  foreignKey: "educationCenterID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EducationCenter.hasMany(Reception, {
  foreignKey: "educationCenterID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Reception;
