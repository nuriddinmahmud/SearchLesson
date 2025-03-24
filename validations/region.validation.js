const Joi = require("joi");

async function regionValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
  });

  return schema.validate(data, { abortEarly: false });
}

async function regionUpdateValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).optional(),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { regionValidation, regionUpdateValidation };
