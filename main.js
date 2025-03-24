const express = require('express')
const {connect} = require("./config/database")
const app = express(); app.use(express.json())
connect()

app.get("/", (req, res) => {
    res.send("Hello World")
})






app.listen(3006, ()=>console.log("started on port 3006"))




