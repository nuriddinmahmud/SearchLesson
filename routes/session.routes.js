const express = require("express");
const {
  getUserSession,
  deleteUserSession,
} = require("../controllers/sessions.controller");
const verifyToken = require("../middleware/verifyToken");
const SessionRouter = express.Router();

SessionRouter.get("/me", verifyToken, getUserSession);

SessionRouter.delete("/delete", verifyToken, deleteUserSession);

module.exports = SessionRouter;