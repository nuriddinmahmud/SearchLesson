const { Router } = require("express");
const collabFieldRouter = Router();
const { post } = require("../controllers/collabField.controller");

collabFieldRouter.post("/", post);

module.exports = collabFieldRouter;
