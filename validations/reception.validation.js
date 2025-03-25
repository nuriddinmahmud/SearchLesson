import Joi from "joi";

function receptionValidation(data) {
  const receptionSchema = Joi.object({
    fieldID: Joi.number().positive().required(),
    branchID: Joi.number().positive().required(),
    educationalCentreID: Joi.number().positive().required(),
  });
  return receptionSchema.validate(data, { abortEarly: true });
}

function receptionValidationUpdate(data) {
  const receptionSchema = Joi.object({
    fieldID: Joi.number().positive(),
    branchID: Joi.number().positive(),
    educationalCentreID: Joi.number().positive(),
  });
  return receptionSchema.validate(data, { abortEarly: true });
}

export { receptionValidation, receptionValidationUpdate };
