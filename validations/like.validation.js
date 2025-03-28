const Joi = require("joi");

// Common validation messages
const messages = {
  educationalCenterID: {
    "number.base": "Educational Center ID must be a number",
    "number.positive": "Educational Center ID must be positive",
    "any.required": "Educational Center ID is required",
  },
  userID: {
    "number.base": "User ID must be a number",
    "number.positive": "User ID must be positive",
    "any.required": "User ID is required",
  },
};

function likeValidation(data) {
  const schema = Joi.object({
    educationalCenterID: Joi.number()
      .positive()
      .required()
      .messages(messages.educationalCenterID),
    userID: Joi.number().positive().required().messages(messages.userID),
  });

  return schema.validate(data, { abortEarly: false });
}

function likeUpdateValidation(data) {
  const schema = Joi.object({
    educationalCenterID: Joi.number()
      .positive()
      .messages(messages.educationalCenterID),
    userID: Joi.number().positive().messages(messages.userID),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { likeValidation, likeUpdateValidation };
