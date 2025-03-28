const Joi = require("joi");

// Validation patterns
const patterns = {
  name: /^[\w\s-]+$/i, // Allows letters, numbers, spaces and hyphens
  url: /^(http|https):\/\/[^ "]+$/, // Basic URL validation
};

// Error messages
const messages = {
  name: {
    "string.base": "Category name must be a string",
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name must be at most 50 characters",
    "string.pattern.base":
      "Category name can only contain letters, numbers, spaces and hyphens",
  },
  image: {
    "string.base": "Image must be a string",
    "string.empty": "Image is required",
    "string.pattern.base":
      "Image must be a valid URL starting with http:// or https://",
  },
};

function resourceCategoryValidation(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(patterns.name)
      .required()
      .messages(messages.name),

    image: Joi.string()
      .pattern(patterns.url)
      .required()
      .messages(messages.image),
  });

  return schema.validate(data, { abortEarly: false });
}

function resourceCategoryUpdateValidation(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(patterns.name)
      .messages(messages.name),

    image: Joi.string().pattern(patterns.url).messages(messages.image),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = {
  resourceCategoryValidation,
  resourceCategoryUpdateValidation,
};
