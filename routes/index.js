const {Router} = require("express")
const mainRouter = Router()

const commentRoute = require("./comment.routes")
const likeRoute = require("./like.routes")
const courseRoute = require("./course.routes")
const receptionRoute = require("./reception.routes")
const collabFieldRoute = require("./collabField.routes")



mainRouter.use("/comment", commentRoute)
mainRouter.use("/like", likeRoute)
mainRouter.use("/course", courseRoute)
mainRouter.use("/reception", receptionRoute)
mainRouter.use("/collabField", collabFieldRoute)


module.exports = mainRouter;