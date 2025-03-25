const Course = require("../models/course.model")
const {courseValidation, courseUpdateValidation} = require("../validations/course.validation")



const getAll = async(req,res) =>{
    try {
        const data = await Course.findAll()
        res.send(data)
    } catch (error) {
        res.send(error.mesage)
    }
}

const getOne = async(req,res) => {
    try {
        const data = await Course.findByPk(req.params.id)
        res.send(data)
    } catch (error) {
        res.send(error.mesage)
    }
}

const post = async(req,res) =>{
    try {
        const data = await Course.findOne({where: {name: req.body.name}})
        if(!data){
            res.send({message: "Course already exists"})
            return;
        }
        const {error} = courseValidation(req.body)
        if(error) {
            res.status(400).send(error.details[0].message)
            return;
        }
        const newData = await Course.create(req.body)
        res.send(newData)
    } catch (error) {
        res.send(error.mesage)
    }
}


const update = async(req,res) =>{
    try {
        const data = await Course.findByPk(req.params.id)
        if(!data){
            res.send({message: "Course not found"})
            return;
        }
        const {error} = courseUpdateValidation(req.body)
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