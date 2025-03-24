const Joi = require("joi");

async function resourceCategoryValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    image: Joi.string().uri().required(),
  });

  return schema.validate(data, { abortEarly: false });
}

async function resourceCategoryUpdateValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).optional(),
    image: Joi.string().uri().optional(),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = {
  resourceCategoryValidation,
  resourceCategoryUpdateValidation,
};
