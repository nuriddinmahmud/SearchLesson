const Joi = require("joi");

function courseValidation(data) {
  const coursesSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    image: Joi.string().required(),
    type: Joi.string()
      .pattern(/^[a-zA-Z]+$/)
      .valid("Jobs", "Subjects")
      .required(),
  });
  return coursesSchema.validate(data, { abortEarly: true });
}

function courseValidationUpdate(data) {
  const coursesSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/),
    image: Joi.string(),
    type: Joi.string()
      .pattern(/^[a-zA-Z]+$/)
      .valid("Jobs", "Subjects"),
  });
  return coursesSchema.validate(data, { abortEarly: true });
}

module.exports = { courseValidation, courseValidationUpdate };
