const {db, DataTypes} = require("../config/db")
const User = require("./user.models")
const EducationCenter = require("./educationCenter.models")

const Like = db.define("Like", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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

module.exports = Like