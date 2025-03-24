const { Router } = require("express");
const ReceptionRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
} = require("../controllers/reception.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

ReceptionRouter.get("/", getAll);

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
