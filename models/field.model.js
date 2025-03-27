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
    allowNull: false,
    references: {
      model: Course,
      key: "id",
    },
  },
});

Course.hasMany(Field, { foreignKey: "courseID", onDelete: "CASCADE", onUpdate: "CASCADE" });
Field.belongsTo(Course, { foreignKey: "courseID" });

module.exports = Field;
