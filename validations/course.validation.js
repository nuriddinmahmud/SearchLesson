import Joi from "joi";

function coursesValidation(data) {
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

function coursesValidationUpdate(data) {
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

export { coursesValidation, coursesValidationUpdate };
