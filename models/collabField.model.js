const { db, DataTypes } = require("../config/database");
const Field = require("./field.model");
const EducationalCenter = require("./educationalCenter.model");

const CollabField = db.define(
  "CollabField",
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
      },
    },

    educationCenterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EducationalCenter,
        key: "id",
      },
    },
  },
  { timestamps: false }
);

Field.hasMany(CollabField, { foreignKey: "fieldID", onDelete: "CASCADE", onUpdate: "CASCADE" });
CollabField.belongsTo(Field, { foreignKey: "fieldID" });

EducationalCenter.hasMany(CollabField, { foreignKey: "educationCenterID", onDelete: "CASCADE", onUpdate: "CASCADE" });
CollabField.belongsTo(EducationalCenter, { foreignKey: "educationCenterID" });

module.exports = CollabField;
