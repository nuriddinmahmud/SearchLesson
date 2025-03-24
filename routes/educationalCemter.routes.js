const { Router } = require("express");
const EducationalCenterRouter = Router();
const {
  create,
  getAll,
  getBySearch,
  getOne,
  getPaginatedEducationalCentres,
  remove,
  sortByAddress,
  sortByName,
  update,
} = require("../controllers/educationalCenter.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

EducationalCenterRouter.get("/getSearch", getBySearch);

EducationalCenterRouter.get("/with-pagination", getPaginatedEducationalCentres);

EducationalCenterRouter.get("/sortByName", sortByName);

EducationalCenterRouter.get("/sortByAddress", sortByAddress);

EducationalCenterRouter.get("/", getAll);

EducationalCenterRouter.get("/:id", getOne);

EducationalCenterRouter.post("/", verifyToken, checkRole(["Admin"]), create);

EducationalCenterRouter.patch(
  "/:id",
  verifyToken,
  checkRole(["Ceo", "Admin"]),
  update
);

EducationalCenterRouter.delete(
  "/:id",
  verifyToken,
  checkRole(["Ceo", "Admin"]),
  remove
);

module.exports = EducationalCenterRouter;
