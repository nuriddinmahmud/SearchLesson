const Joi = require("joi");

const namePattern = /^[a-zA-Z' .-]+$/;

const messages = {
  name: {
    "string.base": "Region name must be a string",
    "string.empty": "Region name is required",
    "string.min": "Region name must be at least 2 characters",
    "string.max": "Region name must be at most 20 characters",
    "string.pattern.base": "Only letters, spaces, and ['.-] are allowed",
  },
};

function regionValidation(data) {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(namePattern)
      .min(2)
      .max(20)
      .required()
      .messages(messages.name),
  });

  return schema.validate(data, { abortEarly: false });
}

function regionUpdateValidation(data) {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(namePattern)
      .min(2)
      .max(20)
      .messages(messages.name),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { regionValidation, regionUpdateValidation };
