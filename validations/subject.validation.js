const Joi = require("joi");

function subjectValidation(data) {
  const subjectSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    image: Joi.string().required(),
  });
  return subjectSchema.validate(data, { abortEarly: true });
}

function subjectValidationUpdate(data) {
  const subjectSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/),
    image: Joi.string(),
  });
  return subjectSchema.validate(data, { abortEarly: true });
}

module.exports = { subjectValidation, subjectValidationUpdate };
