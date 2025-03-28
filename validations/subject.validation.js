const Joi = require("joi");

// Define validation patterns and messages
const validationRules = {
  name: {
    pattern: /^[a-zA-Z\s-]+$/, // Allows letters, spaces, and hyphens
    messages: {
      "string.base": "Subject name must be a string",
      "string.empty": "Subject name is required",
      "string.min": "Subject name must be at least 2 characters",
      "string.max": "Subject name must be at most 50 characters",
      "string.pattern.base":
        "Subject name can only contain letters, spaces, and hyphens",
    },
  },
  image: {
    pattern: /\.(jpg|jpeg|png|gif|webp)$/i, // Basic image extension check
    messages: {
      "string.base": "Image must be a string",
      "string.empty": "Image is required",
      "string.pattern.base":
        "Image must be a valid file path (jpg, jpeg, png, gif, webp)",
    },
  },
};

function subjectValidation(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(validationRules.name.pattern)
      .required()
      .messages(validationRules.name.messages),

    image: Joi.string()
      .pattern(validationRules.image.pattern)
      .required()
      .messages(validationRules.image.messages),
  });

  return schema.validate(data, { abortEarly: false });
}

function subjectValidationUpdate(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(validationRules.name.pattern)
      .messages(validationRules.name.messages),

    image: Joi.string()
      .pattern(validationRules.image.pattern)
      .messages(validationRules.image.messages),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { subjectValidation, subjectValidationUpdate };
