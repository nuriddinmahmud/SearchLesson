const { Router } = require("express");
const ResourceRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
} = require("../controllers/resource.controller");
const verifyToken = require("../middlewares/verifyToken");
const selfPolice = require("../middlewares/selfPolice");

ResourceRouter.get("/", getAll);

ResourceRouter.get("/:id", getOne);

ResourceRouter.post("/", verifyToken, post);

ResourceRouter.patch(
  "/:id",
  verifyToken,
  selfPolice(["User", "Admin"]),
  update
);

ResourceRouter.delete(
  "/:id",
  verifyToken,
  selfPolice(["User", "Admin"]),
  remove
);

module.exports = ResourceRouter;
