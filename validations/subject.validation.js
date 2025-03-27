const Joi = require("joi");

function SubjectValidation(data) {
  const coursesSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    image: Joi.string().required(),
  });
  return coursesSchema.validate(data, { abortEarly: true });
}

function SubjectValidationUpdate(data) {
  const coursesSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/),
    image: Joi.string(),
  });
  return coursesSchema.validate(data, { abortEarly: true });
}

module.exports = { SubjectValidation, SubjectValidationUpdate };
