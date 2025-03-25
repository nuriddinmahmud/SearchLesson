const { Router } = require("express");
const CommentRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
} = require("../controllers/comment.controller");
const verifyToken = require("../middlewares/verifyToken");

CommentRouter.get("/", getAll);

CommentRouter.get("/:id", getOne);

CommentRouter.post("/", verifyToken, post);

CommentRouter.patch("/:id", verifyToken, update);

CommentRouter.delete("/:id", verifyToken, remove);

module.exports = CommentRouter;
