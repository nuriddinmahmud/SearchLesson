const { Router } = require("express");
const RegionRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
} = require("../controllers/region.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

RegionRouter.get("/", getAll);

RegionRouter.get("/:id", getOne);

RegionRouter.post("/", verifyToken, checkRole(["Admin"]), post);

RegionRouter.patch("/:id", verifyToken, checkRole(["Admin"]), update);

RegionRouter.delete("/:id", verifyToken, checkRole(["Admin"]), remove);

module.exports = RegionRouter;
