// const { Router } = require("express");
// const ResourceCategoryRouter = Router();
// const {
//   getAll,
//   getOne,
//   post,
//   update,
//   remove,
// } = require("../controllers/resourceCategory.controller");
// const verifyToken = require("../middlewares/verifyToken");
// const selfPolice = require("../middlewares/selfPolice");

// ResourceCategoryRouter.get("/", getAll);

// ResourceCategoryRouter.get("/:id", getOne);

// ResourceCategoryRouter.post("/", verifyToken, selfPolice(["Admin"]), post);

// ResourceCategoryRouter.patch(
//   "/:id",
//   verifyToken,
//   selfPolice(["Admin"]),
//   update
// );

// ResourceCategoryRouter.delete(
//   "/:id",
//   verifyToken,
//   selfPolice(["Admin"]),
//   remove
// );

// module.exports = ResourceCategoryRouter;
