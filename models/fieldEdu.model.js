const { db, DataTypes } = require("../config/database");
const Field = require("./field.model");
const EducationalCenter = require("./educationalCenter.model");

const FieldEdu = db.define(
  "FieldEdu",
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
    educationalCenterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EducationalCenter,
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
  },
  {
    timestamps: true,
  }
);

FieldEdu.belongsToMany(Field, { through: FieldEdu, foreignKey: "fieldID" });
FieldEdu.belongsToMany(EducationalCenter, {
  through: FieldEdu,
  foreignKey: "educationalCenterID",
});

module.exports = FieldEdu;
