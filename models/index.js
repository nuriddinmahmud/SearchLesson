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
const fieldBra = require("./fieldBra");
const subjectBra = require("./subjectBra");
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

Region.hasMany(educationalCenter, { foreignKey: "regionID" });
educationalCenter.belongsTo(Region, { foreignKey: "regionID" });

Region.hasMany(User, { foreignKey: "regionID" });
User.belongsTo(Region, { foreignKey: "regionID" });

educationalCenter.belongsToMany(Subject, { through: subjectEdu });
Subject.belongsToMany(educationalCenter, { through: subjectEdu });

educationalCenter.belongsToMany(Field, { through: fieldEdu });
Field.belongsToMany(educationalCenter, { through: fieldEdu });

educationalCenter.hasMany(Like, { foreignKey: "educationalCenterID" });
Like.belongsTo(educationalCenter, { foreignKey: "educationalCenterID" });

educationalCenter.hasMany(Comment, {
  foreignKey: "educationalCenterID",
});
Comment.belongsTo(educationalCenter, {
  foreignKey: "educationalCenterID",
});

educationalCenter.hasMany(Reception, {
  foreignKey: "educationalCenterID",
});
Reception.belongsTo(educationalCenter, {
  foreignKey: "educationalCenterID",
});

Region.hasMany(Branch, { foreignKey: "regionID" });
Branch.belongsTo(Region, { foreignKey: "regionID" });

Branch.hasMany(Reception, { foreignKey: "branchID" });
Reception.belongsTo(Branch, { foreignKey: "branchID" });

Branch.belongsTo(educationalCenter, {
  foreignKey: "educationalCenterID",
});
educationalCenter.hasMany(Branch, {
  foreignKey: "educationalCenterID",
});

Branch.belongsToMany(Subject, { through: subjectBra });
Branch.belongsToMany(Field, { through: fieldBra });

Subject.belongsToMany(Branch, { through: subjectBra });
Field.belongsToMany(Branch, { through: fieldBra });

Resource.belongsTo(resourceCategory, { foreignKey: "resourceCategoryID" });
resourceCategory.hasMany(Resource, { foreignKey: "resourceCategoryID" });

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
