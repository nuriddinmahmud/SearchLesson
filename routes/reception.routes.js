const {Router}  = require("express")
const app = Router()

const { getOne, getAll, post, update, remove} = require("../controllers/reception.controller")


app.get("/", getAll(req,res))
app.get("/:id", getOne(req,res))
app.post("/", post(req,res))
app.patch("/:id", update(req,res))
app.delete("/:id", remove(req,res))




module.exports = app

