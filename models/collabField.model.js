const {db, DataTypes} = require("../config/db")
const Field = require("./field.models")
const EducationCenter = require("./educationCenter.models")
const CollabField = db.define("CollabField", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fieldId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Field,
            key: "id",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
    },
    educationCenterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EducationCenter,
            key: "id",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
    }
})

module.exports = CollabField