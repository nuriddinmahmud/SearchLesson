const Joi = require("joi")
async function collabFieldValidation(data){
    const schema = Joi.object({
    fieldId: Joi.number().min(1).required(),
    educationCenterId: Joi.number().min(1).required()
    })
    return schema.validate(data, { abortEarly: false })
}
async function collabFieldUpdateValidation(data){
    const schema = Joi.object({
    fieldId: Joi.number().min(1).optional(),
    educationCenterId: Joi.number().min(1).optional()
    })
    return schema.validate(data, { abortEarly: false })
}




module.exports = {collabFieldValidation, collabFieldUpdateValidation}