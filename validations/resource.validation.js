const Joi = require("joi");

const patterns = {
  name: /^[\w\s.,!?()-]+$/i,
  description: /^[\w\s.,!?()-]+$/i,
  url: /^(http|https):\/\/[^ "]+$/,
};

const messages = {
  name: {
    "string.base": "Resource name must be a string",
    "string.empty": "Resource name is required",
    "string.min": "Resource name must be at least 2 characters",
    "string.pattern.base": "Resource name contains invalid characters",
  },
  description: {
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.min": "Description must be at least 2 characters",
    "string.pattern.base": "Description contains invalid characters",
  },
  media: {
    "string.base": "Media must be a string",
    "string.empty": "Media is required",
    "string.pattern.base": "Media must be a valid URL",
  },
  image: {
    "string.base": "Image must be a string",
    "string.empty": "Image is required",
    "string.pattern.base": "Image must be a valid URL",
  },
  categoryID: {
    "number.base": "Category ID must be a number",
    "number.positive": "Category ID must be positive",
    "any.required": "Category ID is required",
  },
};

function resourceValidation(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .pattern(patterns.name)
      .required()
      .messages(messages.name),

    description: Joi.string()
      .min(2)
      .max(500)
      .pattern(patterns.description)
      .required()
      .messages(messages.description),

    image: Joi.string()
      .pattern(patterns.url)
      .required()
      .messages(messages.image),

    media: Joi.string()
      .pattern(patterns.url)
      .required()
      .messages(messages.media),

    categoryID: Joi.number()
      .positive()
      .required()
      .messages(messages.categoryID),
  });

  return schema.validate(data, { abortEarly: false });
}

function resourceValidationUpdate(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .pattern(patterns.name)
      .messages(messages.name),

    description: Joi.string()
      .min(2)
      .max(500)
      .pattern(patterns.description)
      .messages(messages.description),

    image: Joi.string().pattern(patterns.url).messages(messages.image),

    media: Joi.string().pattern(patterns.url).messages(messages.media),

    categoryID: Joi.number().positive().messages(messages.categoryID),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { resourceValidation, resourceValidationUpdate };
