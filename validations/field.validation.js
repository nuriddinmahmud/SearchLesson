const Joi = require("joi");

async function fieldValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    image: Joi.string().uri().required(),
    courseID: Joi.number().min(1).required(),
  });

  return schema.validate(data, { abortEarly: false });
}

async function fieldUpdateValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    image: Joi.string().uri().optional(),
    courseID: Joi.number().min(1).optional(),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { fieldValidation, fieldUpdateValidation };
