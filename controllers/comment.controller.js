const Comment = require("../models/comment.model")
const {commentValidation, commentUpdateValidation} = require("../validations/comment.validation")



const getAll = async(req,res) =>{
    try {
        const data = await Comment.findAll()
        res.send(data)
    } catch (error) {
        res.send(error.mesage)
    }
}

const getOne = async(req,res) => {
    try {
        const data = await Comment.findByPk(req.params.id)
        res.send(data)
    } catch (error) {
        res.send(error.mesage)
    }
}

const post = async(req,res) =>{
    try {
        const data = await Comment.findOne({where: {name: req.body.name}})
        if(!data){
            res.send({message: "Comment already exists"})
            return;
        }
        const {error} = commentValidation(req.body)
        if(error) {
            res.status(400).send(error.details[0].message)
            return;
        }
        const newData = await Comment.create(req.body)
        res.send(newData)
    } catch (error) {
        res.send(error.mesage)
    }
}


const update = async(req,res) =>{
    try {
        const data = await Comment.findByPk(req.params.id)
        if(!data){
            res.send({message: "Comment not found"})
            return;
        }
        const {error} = commentUpdateValidation(req.body)
        if(error) {
            res.status(400).send(error.details[0].message)
            return;
        }
        await data.update(req.body)
        res.send(data)
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
    update,
    remove
}