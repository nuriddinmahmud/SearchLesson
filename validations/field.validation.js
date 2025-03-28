const Joi = require("joi");

const messages = {
  name: {
    "string.base": "Field name must be a string",
    "string.empty": "Field name is required",
    "string.min": "Field name must be at least 2 characters",
    "string.pattern.base": "Field name can only contain letters",
  },
  image: {
    "string.base": "Image must be a string",
    "string.empty": "Image is required",
  },
};

function fieldValidation(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .required()
      .messages(messages.name),

    image: Joi.string().required().messages(messages.image),
  });

  return schema.validate(data, { abortEarly: false });
}

function fieldValidationUpdate(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .messages(messages.name),

    image: Joi.string().messages(messages.image),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { fieldValidation, fieldValidationUpdate };
