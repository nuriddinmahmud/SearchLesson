const { Router } = require("express");
const mainRouter = Router();


const EducationCenterRouter = require("./educationalCenter.routes.js");
const UserRouter = require("./user.routes.js");
const ResourceCategoryRouter = require("./resourceCategory.routes.js");
const CommentRouter = require("./comment.routes.js");
const BranchRouter = require("./branch.routes.js");
const RegionRouter = require("./region.routes.js");
const LikesRouter = require("./like.routes.js");
const FieldRouter = require("./field.routes.js");
const CourseRoute = require("./course.routes.js");
const ReceptionRoute = require("./reception.routes.js");
const ResourceRoute = require("./resource.routes.js");
const CollabFieldRoute = require("./collabField.routes.js");
const SessionRoute = require("./session.routes.js");

mainRouter.use("educationalCenter", EducationCenterRouter);
mainRouter.use("/user", UserRouter);
mainRouter.use("/resourceCategory", ResourceCategoryRouter);
mainRouter.use("/comment", CommentRouter);
mainRouter.use("/region", RegionRouter);
mainRouter.use("/session", SessionRoute);
mainRouter.use("/branche", BranchRouter);
mainRouter.use("/field", FieldRouter);
mainRouter.use("/like", LikesRouter);
mainRouter.use("/course", CourseRoute);
mainRouter.use("/reception", ReceptionRoute);
mainRouter.use("/resources", ResourceRoute);
mainRouter.use("/collabField", CollabFieldRoute);
// mainRouter.use("/upload-image", UploadImageRoute);

module.exports = mainRouter;
