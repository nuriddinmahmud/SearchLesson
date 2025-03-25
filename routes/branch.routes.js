const { Router } = require("express");
const BranchRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
} = require("../controllers/branch.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const selfPolice = require("../middlewares/selfPolice");

BranchRouter.get("/", getAll);

BranchRouter.get("/:id", getOne);

BranchRouter.post("/", verifyToken, selfPolice(["Admin", "Ceo"]), post);

BranchRouter.patch("/:id", verifyToken, checkRole(["Admin"]), update);

BranchRouter.delete("/:id", verifyToken, checkRole(["Admin"]), remove);

module.exports = BranchRouter;
