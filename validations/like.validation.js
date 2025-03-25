import Joi from "joi";

function likesValidation(data) {
  const likesSchema = Joi.object({
    educationalCentreID: Joi.number().positive().required(),
  });
  return likesSchema.validate(data, { abortEarly: true });
}

function likesUpdateValidation(data) {
  const likesSchema = Joi.object({
    educationalCentreID: Joi.number().positive(),
  });
  return likesSchema.validate(data, { abortEarly: true });
}

export { likesUpdateValidation, likesValidation };
