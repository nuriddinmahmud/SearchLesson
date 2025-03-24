const Joi = require("joi")
async function courseValidation(data){
    const schema = Joi.object({
    name: Joi.string().min(3).required(),
    image: Joi.url().integer().min(18).max(65).required(),
    type: Joi.string().email().required()
    })
    return schema.validate(data, { abortEarly: false })
}
async function courseUpdateValidation(data){
    const schema = Joi.object({
        name: Joi.string().min(3).optional(),
        image: Joi.string().optional(),
        type: Joi.string().valid("Fan", "Soxa").optional()
    })
    return schema.validate(data, { abortEarly: false })
}




module.exports = {courseValidation, courseUpdateValidation}