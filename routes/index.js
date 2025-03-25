const router = require("express").Router();

const EducationalCenterRoute = require("./educationalCemter.routes.js");
const ResourceCategoryRoute = require("./resourceCategory.routes.js");
const CommentRoute = require("./comment.routes.js");
const BranchRoute = require("./branch.routes.js");
const RegionRoute = require("./region.routes.js");
const LikesRoute = require("./like.routes.js");
const FieldRoute = require("./field.routes.js");
const UserRoute = require("./user.routes.js");
const CourseRoute = require("./course.routes.js");
const ReceptionRoute = require("./reception.routes.js");
const ResourceRoute = require("./resource.routes.js");
const CollabFieldRoute = require("./collabField.routes.js");

router.use("/educationalcentre", EducationalCenterRoute);
router.use("/resourceCategory", ResourceCategoryRoute);
router.use("/comment", CommentRoute);
router.use("/region", RegionRoute);
router.use("/branche", BranchRoute);
router.use("/field", FieldRoute);
router.use("/like", LikesRoute);
router.use("/user", UserRoute);
router.use("/course", CourseRoute);
router.use("/reception", ReceptionRoute);
router.use("/resource", ResourceRoute);
router.use("/collabField", CollabFieldRoute);

module.exports = router;
