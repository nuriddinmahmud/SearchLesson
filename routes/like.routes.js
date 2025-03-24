const { Router } = require("express");
const LikesRouter = Router();
const {
  create,
  getAll,
  getBySearch,
  getOne,
  getPaginatedLikes,
  remove,
  sortLikesCount,
} = require("../controllers/like.controller");
const verifyToken = require("../middlewares/verifyToken");

LikesRouter.get("/sortLikesCount", sortLikesCount);

LikesRouter.get("/getSearch", getBySearch);

LikesRouter.get("/with-pagination", getPaginatedLikes);

LikesRouter.get("/", getAll);

LikesRouter.get("/:id", getOne);

LikesRouter.post("/", verifyToken, create);

LikesRouter.delete("/:id", verifyToken, remove);

module.exports = LikesRouter;
