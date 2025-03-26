const { Router } = require("express");
const CenterRouter = Router();
const {
  getAll,
  getPaginatedEducationalCentres,
  getOne,
  getBySearch,
  sortByName,
  sortByAddress,
  create,
  update,
  remove,
} = require("../controllers/educationCenter.controller");

const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

CenterRouter.get("/", getAll);
CenterRouter.get("/paginated", getPaginatedEducationalCentres);
CenterRouter.get("/search/query", getBySearch);
CenterRouter.get("/sort/name", sortByName);
CenterRouter.get("/sort/address", sortByAddress);
CenterRouter.get("/:id", getOne);

CenterRouter.post("/", verifyToken, checkRole(["Admin", "Ceo"]), create);
CenterRouter.patch("/:id", verifyToken, checkRole(["Admin", "Ceo"]), update);
CenterRouter.delete("/:id", verifyToken, checkRole(["Admin", "Ceo"]), remove);

module.exports = CenterRouter;
