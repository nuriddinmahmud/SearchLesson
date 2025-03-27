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
      }
    },
    educationalCenterID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EducationalCenter,
            key: "id",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        }
    }
    
  },
  {
    timestamps: true,
  }
);

FieldEdu.belongsTo(Field, { foreignKey: "fieldID", onDelete: "CASCADE", onUpdate: "CASCADE" });
FieldEdu.belongsTo(EducationalCenter, { foreignKey: "educationalCenterID", onDelete: "CASCADE", onUpdate: "CASCADE" });

Field.hasMany(FieldEdu, {foreignKey: "fieldID", onDelete: "CASCADE", onUpdate: "CASCADE" })
EducationalCenter.hasMany(FieldEdu, {foreignKey: "educationalCenterID", onDelete: "CASCADE", onUpdate: "CASCADE" })

module.exports = FieldEdu;