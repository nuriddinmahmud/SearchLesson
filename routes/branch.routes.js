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
const rolePolice = require("../middlewares/rolePolice");
const selfPolice = require("../middlewares/selfPolice");

BranchRouter.get("/", getAll);

BranchRouter.get("/:id", getOne);

BranchRouter.post("/", verifyToken, selfPolice(["Admin", "Ceo"]), post);

BranchRouter.patch("/:id", verifyToken, rolePolice(["Admin"]), update);

BranchRouter.delete("/:id", verifyToken, rolePolice(["Admin"]), remove);

module.exports = BranchRouter;
