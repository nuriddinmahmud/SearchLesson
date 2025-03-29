const Branch = require("./branch.model");
const educationalCenter = require("./educationalCenter.model");
const Field = require("./field.model");
const Region = require("./region.model");
const Reception = require("./reception.model");
const User = require("./user.model");
const resourceCategory = require("./resourceCategory.model");
const Subject = require("./subject.model");
const Comment = require("./comment.model");
const Resource = require("./resource.model");
const Like = require("./like.model");
const fieldBra = require("./fieldBra.model");
const subjectBra = require("./subjectBra.model");
const fieldEdu = require("./fieldEdu.model");
const subjectEdu = require("./subjectEdu.model");

User.hasMany(Comment, { foreignKey: "userID" });
Comment.belongsTo(User, { foreignKey: "userID" });

User.hasMany(Resource, { foreignKey: "userID" });
Resource.belongsTo(User, { foreignKey: "userID" });

User.hasMany(Like, { foreignKey: "userID" });
Like.belongsTo(User, { foreignKey: "userID" });

User.hasMany(Reception, { foreignKey: "userID" });
Reception.belongsTo(User, { foreignKey: "userID" });

User.belongsTo(Region, { foreignKey: "regionID" });
Region.hasMany(User, { foreignKey: "regionID" });

Region.hasMany(educationalCenter, { foreignKey: "regionID" });
educationalCenter.belongsTo(Region, { foreignKey: "regionID" });

Region.hasMany(Branch, { foreignKey: "regionID" });
Branch.belongsTo(Region, { foreignKey: "regionID" });

educationalCenter.belongsToMany(Subject, {
  through: subjectEdu,
  foreignKey: "educationalCenterId",
  otherKey: "subjectId",
});
Subject.belongsToMany(educationalCenter, {
  through: subjectEdu,
  foreignKey: "subjectId",
  otherKey: "educationalCenterId",
});

educationalCenter.belongsToMany(Field, {
  through: fieldEdu,
  foreignKey: "educationalCenterId",
  otherKey: "fieldId",
});
Field.belongsToMany(educationalCenter, {
  through: fieldEdu,
  foreignKey: "fieldId",
  otherKey: "educationalCenterId",
});

educationalCenter.hasMany(Like, { foreignKey: "educationalCenterID" });
Like.belongsTo(educationalCenter, { foreignKey: "educationalCenterID" });

educationalCenter.hasMany(Comment, { foreignKey: "educationalCenterID" });
Comment.belongsTo(educationalCenter, { foreignKey: "educationalCenterID" });

educationalCenter.hasMany(Reception, { foreignKey: "educationalCenterID" });
Reception.belongsTo(educationalCenter, { foreignKey: "educationalCenterID" });

educationalCenter.hasMany(Branch, {
  foreignKey: "educationalCenterID",
  as: "branches",
});
Branch.belongsTo(educationalCenter, {
  foreignKey: "educationalCenterID",
  as: "EducationalCenter",
});

Branch.belongsToMany(Subject, {
  through: subjectBra,
  foreignKey: "branchId",
  otherKey: "subjectId",
});
Subject.belongsToMany(Branch, {
  through: subjectBra,
  foreignKey: "subjectId",
  otherKey: "branchId",
});

Branch.belongsToMany(Field, {
  through: fieldBra,
  foreignKey: "branchId",
  otherKey: "fieldId",
});
Field.belongsToMany(Branch, {
  through: fieldBra,
  foreignKey: "fieldId",
  otherKey: "branchId",
});

Branch.hasMany(Reception, { foreignKey: "branchID" });
Reception.belongsTo(Branch, { foreignKey: "branchID" });

Resource.belongsTo(resourceCategory, { foreignKey: "resourceCategoryID" });
resourceCategory.hasMany(Resource, { foreignKey: "resourceCategoryID" });

Resource.belongsTo(User, { foreignKey: "userID" });
User.hasMany(Resource, { foreignKey: "userID" });

Comment.belongsTo(User, { foreignKey: "userID" });
User.hasMany(Comment, { foreignKey: "userID" });

Comment.belongsTo(educationalCenter, { foreignKey: "educationalCenterID" });
educationalCenter.hasMany(Comment, { foreignKey: "educationalCenterID" });

Like.belongsTo(User, { foreignKey: "userID" });
User.hasMany(Like, { foreignKey: "userID" });

Like.belongsTo(educationalCenter, { foreignKey: "educationalCenterID" });
educationalCenter.hasMany(Like, { foreignKey: "educationalCenterID" });

Reception.belongsTo(User, { foreignKey: "userID" });
User.hasMany(Reception, { foreignKey: "userID" });

Reception.belongsTo(educationalCenter, { foreignKey: "educationalCenterID" });
educationalCenter.hasMany(Reception, { foreignKey: "educationalCenterID" });

Reception.belongsTo(Branch, { foreignKey: "branchID" });
Branch.hasMany(Reception, { foreignKey: "branchID" });

module.exports = {
  User,
  Comment,
  Resource,
  Like,
  Reception,
  Branch,
  educationalCenter,
  Region,
  Field,
  resourceCategory,
  Subject,
};
