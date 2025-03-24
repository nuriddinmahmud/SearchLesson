const { db, DataTypes } = require("../config/database");
const Course = require("./course.model");

const Field = db.define("Field", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  courseID: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    allowNull: false,
  },
});

module.exports = Field;
