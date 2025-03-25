// const { Router } = require("express");
// const EducationalCenterRouter = Router();
// const {
//   getAll,
//   getOne,
//   post,
//   update,
//   remove,
// } = require("../controllers/educationalCenter.controller");
// const verifyToken = require("../middlewares/verifyToken");
// const checkRole = require("../middlewares/rolePolice");

// EducationalCenterRouter.get("/", getAll);

// EducationalCenterRouter.get("/:id", getOne);

// EducationalCenterRouter.post("/", verifyToken, checkRole(["Admin"]), post);

// EducationalCenterRouter.patch(
//   "/:id",
//   verifyToken,
//   checkRole(["Ceo", "Admin"]),
//   update
// );

// EducationalCenterRouter.delete(
//   "/:id",
//   verifyToken,
//   checkRole(["Ceo", "Admin"]),
//   remove
// );

// module.exports = EducationalCenterRouter;
