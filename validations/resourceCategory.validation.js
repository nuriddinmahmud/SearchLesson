const Joi = require("joi");

function resourceCategoryValidation(data) {
  const resourceSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    image: Joi.string().required(),
  });
  return resourceSchema.validate(data, { abortEarly: true });
}

function resourceCategoryValidationUpdate(data) {
  const resourceSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/),
    image: Joi.string(),
  });
  return resourceSchema.validate(data, { abortEarly: true });
}

module.exports = {
  resourceCategoryValidation,
  resourceCategoryValidationUpdate,
};
