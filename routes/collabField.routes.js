const {Router}  = require("express")
const app = Router()

const { getOne, getAll, post, update, remove} = require("../controllers/collabField.controller")


app.get("/", getAll)
app.get("/:id", getOne)
app.post("/", post)
app.patch("/:id", update)
app.delete("/:id", remove)




module.exports = app

