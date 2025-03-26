const { Router } = require("express");
const UserRouter = Router();

const {
  register,
  verifyOtp,
  login,
  findAll,
  findOne,
  update,
  remove,
  promoteToAdmin,
} = require("../controllers/user.controller");

const verifyToken = require("../middlewares/verifyToken");
const selfPolice = require("../middlewares/selfPolice");
const checkRole = require("../middlewares/rolePolice");

// Auth
UserRouter.post("/register", register);
UserRouter.post("/verify-otp", verifyOtp);
UserRouter.post("/login", login);

UserRouter.get("/", verifyToken, checkRole(["Admin", "Ceo", "User"]), findAll);
UserRouter.get("/:id", verifyToken, checkRole(["Admin", "Ceo", "User"]), findOne);
UserRouter.patch("/:id", verifyToken, selfPolice(["SuperAdmin"]), update);
UserRouter.delete("/:id", verifyToken, selfPolice(["SuperAdmin"]), remove);

// Promote to Admin
UserRouter.patch(
  "/promote/:id",
  verifyToken,
  checkRole(["SuperAdmin"]),
  promoteToAdmin
);

module.exports = UserRouter;
