const Joi = require("joi");

async function resourceValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10).max(2000).required(),
    media: Joi.string().uri().required(),
    image: Joi.string().uri().required(),
    categoryID: Joi.number().integer().min(1).required(),
    userID: Joi.number().integer().min(1).required(),
  });

  return schema.validate(data, { abortEarly: false });
}

async function resourceUpdateValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    media: Joi.string().uri().optional(),
    image: Joi.string().uri().optional(),
    categoryID: Joi.number().integer().min(1).optional(),
    userID: Joi.number().integer().min(1).optional(),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { resourceValidation, resourceUpdateValidation };
