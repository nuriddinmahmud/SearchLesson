import Joi from "joi";

function resourceValidation(data) {
  const resourceSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    description: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    image: Joi.string().required(),
    media: Joi.string().required(),
    createdAt: Joi.date().optional(),
    categoryID: Joi.number().positive().required(),
  });
  return resourceSchema.validate(data, { abortEarly: true });
}

function resourceValidationUpdate(data) {
  const resourceSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .optional(),
    description: Joi.string()
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .optional(),
    image: Joi.string().optional(),
    media: Joi.string().optional(),
    createdAt: Joi.date().optional(),
    categoryID: Joi.number().positive().optional(),
  });
  return resourceSchema.validate(data, { abortEarly: true });
}

export { resourceValidation, resourceValidationUpdate };
