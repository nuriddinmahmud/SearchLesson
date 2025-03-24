const Joi = require("joi")
async function receptionValidation(data){
    const schema = Joi.object({
    fieldId: Joi.number().min(1).required(),
    userId: Joi.number().min(1).optional(),
    branchId: Joi.number().min(1).optional(),
    educationCenterId: Joi.number().min(1).required()
    })
    return schema.validate(data, { abortEarly: false })
}
async function receptionUpdateValidation(data){
    const schema = Joi.object({
    fieldId: Joi.number().min(1).optional(),
    userId: Joi.number().min(1).optional(),
    branchId: Joi.number().min(1).optional(),
    educationCenterId: Joi.number().min(1).optional()
    })
    return schema.validate(data, { abortEarly: false })
}




module.exports = {receptionValidation, receptionUpdateValidation}