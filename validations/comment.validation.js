const Joi = require("joi");

async function commentValidation(data) {
  const schema = Joi.object({
    description: Joi.string().min(3).max(1000).required(),
    star: Joi.number().integer().min(1).max(5).optional(),
    userId: Joi.number().min(1).required(),
    educationCenterId: Joi.number().min(1).required(),
  });

  return schema.validate(data, { abortEarly: false });
}

async function commentUpdateValidation(data) {
  const schema = Joi.object({
    description: Joi.string().min(3).max(1000).optional(),
    star: Joi.number().integer().min(1).max(5).optional(),
    userId: Joi.number().min(1).optional(),
    educationCenterId: Joi.number().min(1).optional(),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { commentValidation, commentUpdateValidation };
