const { Router } = require("express");
const ReceptionRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
  myCourses
} = require("../controllers/reception.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/rolePolice");

ReceptionRouter.get("/", getAll);

ReceptionRouter.get("/", verifyToken, myCourses);

ReceptionRouter.get("/:id", getOne);

ReceptionRouter.post("/", verifyToken, post);

ReceptionRouter.patch("/:id", verifyToken, checkRole(["Admin", "Ceo"]), update);

ReceptionRouter.delete(
  "/:id",
  verifyToken,
  checkRole(["Admin", "Ceo"]),
  remove
);

module.exports = ReceptionRouter;
