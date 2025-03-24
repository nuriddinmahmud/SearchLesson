const {db, DataTypes} = require("../config/db")
const User = require("./user.models")
const EducationCenter = require("./educationCenter.models")

const Comment = db.define("Comment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    star: {
        type: DataTypes.INTEGER,
        allowNull: true
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


module.exports = Comment