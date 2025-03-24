const {Router} = require("express")
const mainRouter = Router()

const commentRoute = require("./comment.routes")
const likeRoute = require("./like.routes")
const courseRoute = require("./course.routes")
const receptionRoute = require("./reception.routes")
const collabFieldRoute = require("./collabField.routes")



app.use("/comment", commentRoute)
app.use("/like", likeRoute)
app.use("/course", courseRoute)
app.use("/reception", receptionRoute)
app.use("/collabField", collabFieldRoute)


module.exports = mainRouter;