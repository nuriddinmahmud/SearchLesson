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

<<<<<<< HEAD
EducationalCenter.belongsToMany(Subject, {
  through: SubjectEdu,
  foreignKey: "subjectID",
});
Subject.belongsToMany(EducationalCenter, {
  through: SubjectEdu,
  foreignKey: "educationalCenterID",
});
=======
SubjectEdu.belongsTo(Subject, { foreignKey: "subjectID", onDelete: "CASCADE", onUpdate: "CASCADE" });
SubjectEdu.belongsTo(EducationalCenter, { foreignKey: "educationalCenterID", onDelete: "CASCADE", onUpdate: "CASCADE" });
>>>>>>> 519c9fec0640cf3815049629b36c6738d8fcd915

module.exports = SubjectEdu;
