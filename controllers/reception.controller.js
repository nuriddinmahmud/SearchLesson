const Reception = require("../models/reception.model")
const {receptionValidation, receptionUpdateValidation} = require("../validations/reception.validation")



const getAll = async(req,res) =>{
    try {
        if(req.query.take && req.query.from){
            const {take, from} = req.query
            const data = await Reception.findAll({limit: take, offset: from})
            res.send(data)
            return;
        }
        if(req.query.fieldId){
            const data = await Reception.findAll({where: {fieldId: req.query.fieldId}})
            if(!data){
                res.status(404).send({message: `Courses not found with fieldId ${req.query.fieldId}`})
                return;
            }
            res.send(data)
            return;
        }
        if(req.query.userId){
            const data = await Reception.findAll({where: {userId: req.query.userId}})
            if(!data){
                res.status(404).send({message: `Courses not found with userId ${req.query.userId}`})
                return;
            }
            res.send(data)
            return;
        }
        if(req.query.branchId){
            const data = await Reception.findAll({where: {branchId: req.query.branchId}})
            if(!data){
                res.status(404).send({message: `Courses not found with branchId ${req.query.branchId}`})
                return;
            }
            res.send(data)
            return;
        }
        const data = await Reception.findAll()
        res.send(data)
    } catch (error) {
        res.status(400).send(error.mesage)
    }
}

const myCourses = async(req,res) =>{
    try {
        const data = await Reception.findAll({where: {userId: req.userID}})
        if(!data){
            res.status(404).send({message: "Courses not found"})
            return;
        }
        res.send(data)
    } catch (error) {
        res.status(400).send(error.mesage)
    }
}

const getOne = async(req,res) => {
    try {
        const data = await Reception.findByPk(req.params.id)
        if(!data){
            res.status(404).send({message: "Course not found"})
            return;
        }
        res.send(data)
    } catch (error) {
        res.send(error.mesage)
    }
}

const post = async(req,res) =>{
    try {
        const data = await Reception.findOne({where: {userId: req.userID, educationCenterId: req.body.educationCenterId}})
        if(data){
            res.send({message: "You have already registered to this course"})
            return;
        }
        const {error} = receptionValidation(req.body)
        if(error) {
            res.status(400).send(error.details[0].message)
            return;
        }
        const newData = await Reception.create(req.body)
        res.send({message: "You have registered to course succesfully", newData})
    } catch (error) {
        res.status(400).send(error.mesage)
    }
}


const update = async(req,res) =>{
    try {
        const data = await Reception.findByPk(req.params.id)
        if(!data){
            res.status(404).send({message: "Course not found"})
            return;
        }
        const {error} = receptionUpdateValidation(req.body)
        if(error) {
            res.status(400).send(error.details[0].message)
            return;
        }
        await data.update(req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send(error.mesage)
    }   
}


const remove = async(req,res) =>{
    try {
        const data = await Reception.findByPk(req.params.id)
        if(!data){
            res.status(404).send({message: "Course not found"})
            return;
        }
        await data.destroy()
        res.send(data)
    } catch (error) {
        res.status(400).send(error.mesage)
    }
}

module.exports = {
    getAll,
    getOne,
    post,
    update,
    remove,
    myCourses
}