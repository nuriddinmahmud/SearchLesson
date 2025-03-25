import Joi from "joi";

function fieldValidation(data) {
  const fieldSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    image: Joi.string().required(),
    courseID: Joi.number().positive(),
  });
  return fieldSchema.validate(data, { abortEarly: true });
}

function fieldValidationUpdate(data) {
  const fieldSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/),
    image: Joi.string(),
    courseID: Joi.number().positive(),
  });
  return fieldSchema.validate(data, { abortEarly: true });
}

export { fieldValidation, fieldValidationUpdate };
