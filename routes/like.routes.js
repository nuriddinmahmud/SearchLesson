const { Router } = require("express");
const LikesRouter = Router();
const {
  getAll,
  getOne,
  post,
  remove,
  liked
} = require("../controllers/like.controller");
const verifyToken = require("../middlewares/verifyToken");

LikesRouter.get("/", getAll);

LikesRouter.get("/",verifyToken ,liked);

LikesRouter.get("/:id", getOne);

LikesRouter.post("/", verifyToken, post);

LikesRouter.delete("/:id", verifyToken, remove);

module.exports = LikesRouter;
