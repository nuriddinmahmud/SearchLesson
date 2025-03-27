// const {Sequelize} = require("../config/database");

// const User = require("./user.model");
// const Region = require("./region.model");
// const Branch = require("./branch.model");
// const EducationalCentre = require("./educationalCenter.model");
// const Reception = require("./reception.model");
// const Resource = require("./resource.model");
// const Comment = require("./comment.model");
// const ResourceCategory = require("./resourceCategory.model");
// const Like = require("./like.model");
// const CollabField = require("./collabField.model");
// const Course = require("./course.model");
// const Field = require("./field.model");

// EducationalCentre.belongsTo(User, { foreignKey: "userID" });
// User.hasMany(EducationalCentre, { foreignKey: "userID" });

// EducationalCentre.belongsTo(Region, { foreignKey: "regionID" });
// Region.hasMany(EducationalCentre, { foreignKey: "regionID" });

// Region.hasMany(Branch, { foreignKey: "regionID" });
// Branch.belongsTo(Region, { foreignKey: "regionID" });

// EducationalCentre.hasMany(Branch, { foreignKey: "centreID" });
// Branch.belongsTo(EducationalCentre, { foreignKey: "centreID" });

// Reception.belongsTo(Field, { foreignKey: "fieldID" });
// Field.hasMany(Reception, { foreignKey: "fieldID" });

// User.hasMany(Reception, { foreignKey: "userID" });
// Reception.belongsTo(User, { foreignKey: "userID" });

// Branch.hasMany(Reception, { foreignKey: "branchID" });
// Reception.belongsTo(Branch, { foreignKey: "branchID" });

// EducationalCentre.hasMany(Reception, { foreignKey: "educationalCentreID" });
// Reception.belongsTo(EducationalCentre, { foreignKey: "educationalCentreID" });

// Course.hasMany(Field, { foreignKey: "courseID" });
// Field.belongsTo(Course, { foreignKey: "courseID" });

// Resource.belongsTo(User, { foreignKey: "createdBy" });
// User.hasMany(Resource, { foreignKey: "createdBy" });

// ResourceCategory.hasMany(Resource, { foreignKey: "categoryID" });
// Resource.belongsTo(ResourceCategory, { foreignKey: "categoryID" });

// EducationalCentre.hasMany(Comment, { foreignKey: "educationalCentreID" });
// Comment.belongsTo(EducationalCentre, { foreignKey: "educationalCentreID" });

// User.hasMany(Comment, { foreignKey: "userID" });
// Comment.belongsTo(User, { foreignKey: "userID" });

// CollabField.hasMany(Field, { foreignKey: "collabFieldID" });
// Field.belongsTo(CollabField, { foreignKey: "collabFieldID" });

// EducationalCentre.hasMany(CollabField, { foreignKey: "educationalCentreID" });
// CollabField.belongsTo(EducationalCentre, { foreignKey: "educationalCentreID" });

// Like.belongsTo(User, { foreignKey: "userID" });
// User.hasMany(Like, { foreignKey: "userID" });

// Like.belongsTo(Resource, { foreignKey: "resourceID" });
// Resource.hasMany(Like, { foreignKey: "resourceID" });

// module.exports = {
//   User,
//   Region,
//   Branch,
//   EducationalCentre,
//   Reception,
//   Resource,
//   Comment,
//   ResourceCategory,
//   Like,
//   CollabField,
//   Course,
//   Field,
// };
