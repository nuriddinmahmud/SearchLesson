// const { Router } = require("express");
// const UserRouter = Router();
// const {
//   register,
//   verifyOtp,
//   sendOtpPhone,
//   verifyOtpPhone,
//   login,
//   getAll,
//   getOne,
//   update,
//   remove,
//   myInfo,
//   myEducationalCentres,
//   getNewAccessToken,
//   promoteToAdmin,
// } = require("../controllers/user.controller");
// const verifyToken = require("../middlewares/verifyToken");
// const checkRole = require("../middlewares/rolePolice");
// const selfPolice = require("../middlewares/selfPolice");

// UserRouter.post("/register", register);

// UserRouter.post("/verify-otp", verifyOtp);

// UserRouter.post("/send-otp-to-phone", sendOtpPhone);

// UserRouter.post("/verify-otp-phone", verifyOtpPhone);

// UserRouter.post("/login", login);

// UserRouter.patch(
//   "/promoteToAdmin/:id",
//   verifyToken,
//   selfPolice(["Admin"]),
//   promoteToAdmin
// );

// UserRouter.post("/get-access-token", getNewAccessToken);

// UserRouter.get("/myCentres", verifyToken, myEducationalCentres);

// UserRouter.get("/myInfo", verifyToken, myInfo);

// UserRouter.get("/", verifyToken, checkRole(["Admin", "Ceo", "User"]), getAll);

// UserRouter.get(
//   "/:id",
//   verifyToken,
//   checkRole(["Admin", "User", "Ceo"]),
//   getOne
// );

// UserRouter.patch("/:id", verifyToken, selfPolice(["Admin"]), update);

// UserRouter.delete("/:id", verifyToken, selfPolice(["Admin"]), remove);

// module.exports = UserRouter;
