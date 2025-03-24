const { Router } = require("express");
const CourseRouter = Router();
const {
  create,
  findAll,
  findOne,
  remove,
  update,
} = require("../controllers/course.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const selfPolice = require("../middlewares/selfPolice");

CourseRouter.get("/", findAll);

CourseRouter.post("/", verifyToken, selfPolice(["Admin"]), create);

CourseRouter.get("/:id", findOne);

CourseRouter.patch("/:id", checkRole(["Admin"]), update);

CourseRouter.delete("/:id", checkRole(["Admin"]), remove);

module.exports = CourseRouter;
