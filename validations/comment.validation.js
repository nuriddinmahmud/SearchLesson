const Joi = require("joi");

function commentValidation(data) {
  const commentSchema = Joi.object({
    description: Joi.string().min(2).max(500).required(),
    star: Joi.number().min(1).max(5).required(),
    educationalCenterID: Joi.number().positive().required(),
  });
  return commentSchema.validate(data, { abortEarly: true });
}

function commentValidationUpdate(data) {
  const commentSchema = Joi.object({
    description: Joi.string().min(2).max(500),
    star: Joi.number().min(1).max(5),
    educationalCenterID: Joi.number().positive(),
  });
  return commentSchema.validate(data, { abortEarly: true });
}

module.exports = { commentValidation, commentValidationUpdate };
