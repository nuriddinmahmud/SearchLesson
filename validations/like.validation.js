const Joi = require("joi")
async function likeValidation(data){
    const schema = Joi.object({
    userId: Joi.number().min(1).required(),
    educationCenterId: Joi.number().min(1).required()
    })
    return schema.validate(data, { abortEarly: false })
}
async function likeUpdateValidation(data){
    const schema = Joi.object({
    userId: Joi.number().min(1).optional(),
    educationCenterId: Joi.number().min(1).optional()
    })
    return schema.validate(data, { abortEarly: false })
}




module.exports = {likeValidation, likeUpdateValidation}