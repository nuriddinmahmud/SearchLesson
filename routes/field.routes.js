const { Router } = require("express");
const FieldRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
} = require("../controllers/field.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/rolePolice");

FieldRouter.get("/", getAll);

FieldRouter.get("/:id", getOne);

FieldRouter.post("/", verifyToken, checkRole(["Admin", "Ceo"]), post);

FieldRouter.patch("/:id", checkRole(["Admin", "Ceo"]), update);

FieldRouter.delete("/:id", checkRole(["Admin", "Ceo"]), remove);

module.exports = FieldRouter;
