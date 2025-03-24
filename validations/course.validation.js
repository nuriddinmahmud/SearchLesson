const Joi = require("joi");

async function courseValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    image: Joi.string().uri().optional(),
    type: Joi.string().min(2).max(100).required(),
  });

  return schema.validate(data, { abortEarly: false });
}

async function courseUpdateValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    image: Joi.string().uri().optional(),
    type: Joi.string().min(2).max(100).optional(),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { courseValidation, courseUpdateValidation };
