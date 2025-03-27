const Joi = require("joi");

function receptionValidation(data) {
  const receptionSchema = Joi.object({
    fieldID: Joi.number().positive().required(),
    branchID: Joi.number().positive().required(),
    educationCenterID: Joi.number().positive().required(),
  });
  return receptionSchema.validate(data, { abortEarly: true });
}

function receptionValidationUpdate(data) {
  const receptionSchema = Joi.object({
    fieldID: Joi.number().positive(),
    branchID: Joi.number().positive(),
    educationCenterID: Joi.number().positive(),
  });
  return receptionSchema.validate(data, { abortEarly: true });
}

module.exports = { receptionValidation, receptionValidationUpdate };
