const {db, DataTypes} = require("../config/db")
const User = require("./user.models")
const EducationCenter = require("./educationCenter.models")
const Field = require("./field.models")
const Branch = require("./educationCenter.models")

const Reception = db.define("Reception", {
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
    branchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Branch,
            key: "id",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
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

module.exports = Reception