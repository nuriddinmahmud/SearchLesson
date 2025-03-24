const { Router } = require("express");
const FieldRouter = Router();
const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/field.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

FieldRouter.get("/", getAll);

FieldRouter.get("/:id", getOne);

FieldRouter.post("/", verifyToken, checkRole(["Admin", "Ceo"]), create);

FieldRouter.patch("/:id", checkRole(["Admin", "Ceo"]), update);

FieldRouter.delete("/:id", checkRole(["Admin", "Ceo"]), remove);

module.exports = FieldRouter;
