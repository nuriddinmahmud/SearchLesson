const Like = require("../models/like.model")
const {likeValidation} = require("../validations/like.validation")



const getAll = async(req,res) =>{
    try {
        if(req.query.take && req.query.from){
            const {take, from} = req.query
            const data = await Like.findAll({limit: take, offset: from})
            res.send(data)
            return;
        }
        if(req.query.userId){
            const {userId} = req.query
            const data = await Like.findAll({where: {userId: userId}})
            if(!data){
                res.send({message: `No Likes found with userId ${req.query.userId}`})
                return;
            }
            res.send(data)
            return;
        }
        const data = await Like.findAll()
        res.send(data)
    } catch (error) {
        res.send(error.mesage)
    }
}


const liked = async(req,res) =>{
    try {
        const data = await Like.findAll({where: {userId: req.userId}})
        if(!data){
            res.send({message: "Likes not found"})
            return;
        }
        res.send(data)
    } catch (error) {
        res.send(error.mesage)
    }
}

const getOne = async(req,res) => {
    try {
        const data = await Like.findByPk(req.params.id)
        res.send(data)
    } catch (error) {
        res.send(error.mesage)
    }
}

const post = async(req,res) =>{
    try {
        const data = await Like.findOne({where: {name: req.body.name}})
        if(data){
            res.send({message: "Like "})
            return;
        }
        const {error} = likeValidation(req.body)
        if(error) {
            res.status(400).send(error.details[0].message)
            return;
        }
        const newData = await Like.create(req.body)
        res.send(newData)
    } catch (error) {
        res.send(error.mesage)
    }
}



const remove = async(req,res) =>{
    try {
        const data = await Course.findByPk(req.params.id)
        if(!data){
            res.send({message: "Course not found"})
            return;
        }
        await data.destroy()
        res.send(data)
    } catch (error) {
        res.send(error.mesage)
    }
}

module.exports = {
    getAll,
    getOne,
    post,
    remove,
    liked
}