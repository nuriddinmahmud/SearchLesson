const { Router } = require("express");
const CourseRouter = Router();
const {
  getAll,
  getOne,
  post,
  remove,
  update,
} = require("../controllers/course.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/rolePolice");
const selfPolice = require("../middlewares/selfPolice");

CourseRouter.get("/", verifyToken, getAll);

CourseRouter.get("/:id", getOne);

CourseRouter.post("/", verifyToken, selfPolice(["Admin"]), post);

CourseRouter.patch("/:id", checkRole(["Admin"]), update);

CourseRouter.delete("/:id", checkRole(["Admin"]), remove);

module.exports = CourseRouter;
