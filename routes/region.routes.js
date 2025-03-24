const { Router } = require("express");
const RegionRouter = Router();
const {
  create,
  getAll,
  getBySearch,
  getOne,
  getPaginatedRegions,
  remove,
  sortByName,
  update,
} = require("../controllers/region.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

RegionRouter.get("/with-pagination", getPaginatedRegions);

RegionRouter.get("/sortByName", sortByName);

RegionRouter.get("/getSearch", getBySearch);

RegionRouter.get("/", getAll);

RegionRouter.get("/:id", getOne);

RegionRouter.post("/", verifyToken, checkRole(['Admin']), create);

RegionRouter.patch("/:id", verifyToken, checkRole(['Admin']), update);

RegionRouter.delete("/:id", verifyToken, checkRole(['Admin']), remove);

module.exports = RegionRouter;