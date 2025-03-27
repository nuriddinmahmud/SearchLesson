const Joi = require("joi");

function commentValidation(data) {
  const commentSchema = Joi.object({
    description: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    star: Joi.number().positive().required(),
    createdAt: Joi.date().optional(),
    educationalCenterID: Joi.number().positive().required(),
  });
  return commentSchema.validate(data, { abortEarly: true });
}

function commentValidationUpdate(data) {
  const commentSchema = Joi.object({
    description: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/),
    star: Joi.number().positive(),
    createdAt: Joi.date(),
    educationCentreID: Joi.number().positive(),
  });
  return commentSchema.validate(data, { abortEarly: true });
}

module.exports = { commentValidation, commentValidationUpdate };
