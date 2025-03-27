const { db, DataTypes } = require("../config/database");
const Subject = require("./subject.model");
const EducationalCenter = require("./educationalCenter.model");

const SubjectEdu = db.define(
  "SubjectEdu",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subjectID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
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

EducationalCenter.belongsToMany(Subject, {
  through: SubjectEdu,
  foreignKey: "subjectID",
});
Subject.belongsToMany(EducationalCenter, {
  through: SubjectEdu,
  foreignKey: "educationalCenterID",
});

module.exports = SubjectEdu;
