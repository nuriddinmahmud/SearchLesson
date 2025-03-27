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

SubjectEdu.belongsTo(Field, { foreignKey: "subjectID", onDelete: "CASCADE", onUpdate: "CASCADE" });
SubjectEdu.belongsTo(EducationalCenter, { foreignKey: "educationalCenterID", onDelete: "CASCADE", onUpdate: "CASCADE" });

Subject.hasMany(SubjectEdu, {foreignKey: "subjectID", onDelete: "CASCADE", onUpdate: "CASCADE" })
EducationalCenter.hasMany(SubjectEdu, {foreignKey: "educationalCenterID", onDelete: "CASCADE", onUpdate: "CASCADE" })

module.exports = SubjectEdu;