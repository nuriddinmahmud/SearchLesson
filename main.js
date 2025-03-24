const express = require('express')
const {connect} = require("./config/database")
const app = express(); app.use(express.json())
connect()
const mainRouter = require("./routes/index")

app.use("/api", mainRouter)





app.listen(3006, ()=>console.log("started on port 3006"))




