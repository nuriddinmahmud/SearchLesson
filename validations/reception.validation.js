const Joi = require("joi");

// Common validation messages
const messages = {
  branchID: {
    "number.base": "Branch ID must be a number",
    "number.positive": "Branch ID must be positive",
    "any.required": "Branch ID is required",
  },
  educationCenterID: {
    "number.base": "Education Center ID must be a number",
    "number.positive": "Education Center ID must be positive",
    "any.required": "Education Center ID is required",
  },
};

function receptionValidation(data) {
  const schema = Joi.object({
    branchID: Joi.number().positive().required().messages(messages.branchID),
    educationCenterID: Joi.number()
      .positive()
      .required()
      .messages(messages.educationCenterID),
  });

  return schema.validate(data, { abortEarly: false });
}

function receptionValidationUpdate(data) {
  const schema = Joi.object({
    branchID: Joi.number().positive().messages(messages.branchID),
    educationCenterID: Joi.number()
      .positive()
      .messages(messages.educationCenterID),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { receptionValidation, receptionValidationUpdate };
