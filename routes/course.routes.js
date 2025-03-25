const {Router}  = require("express")
const app = Router()

const { getOne, getAll, post, update, remove} = require("../controllers/course.controller")
const { func } = require("joi")

function skipMiddlewareFunction(req,res,next) {
    console.log("skipMiddlewareFunction")
    next()
}

app.get("/",skipMiddlewareFunction, getAll)
app.get("/:id",skipMiddlewareFunction, getOne)
app.post("/",skipMiddlewareFunction, post)
app.patch("/:id",skipMiddlewareFunction, update)
app.delete("/:id",skipMiddlewareFunction, remove)




module.exports = app

