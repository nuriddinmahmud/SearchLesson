const { Router } = require("express");
const CommentRouter = Router();
const {
  create,
  getAll,
  getBySearch,
  getOne,
  getPaginatedComments,
  remove,
  sortByCreatedDate,
  sortByStar,
  update,
} = require("../controllers/comment.controller");
const verifyToken = require("../middlewares/verifyToken");

CommentRouter.get("/with-pagination", getPaginatedComments);

CommentRouter.get("/sortByStar", sortByStar);

CommentRouter.get("/sortByCreatedDate", sortByCreatedDate);

CommentRouter.get("/getSearch", getBySearch);

CommentRouter.get("/", getAll);

CommentRouter.get("/:id", getOne);

CommentRouter.post("/", verifyToken, create);

CommentRouter.patch("/:id", verifyToken, update);

CommentRouter.delete("/:id", verifyToken, remove);

module.exports = CommentRouter;
