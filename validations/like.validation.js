const Joi = require("joi");

function likeValidation(data) {
  const likesSchema = Joi.object({
    educationalCenterID: Joi.number().positive().required(),
  });
  return likesSchema.validate(data, { abortEarly: true });
}

function likeUpdateValidation(data) {
  const likesSchema = Joi.object({
    educationalCenterID: Joi.number().positive(),
  });
  return likesSchema.validate(data, { abortEarly: true });
}

module.exports = { likeUpdateValidation, likeValidation };
