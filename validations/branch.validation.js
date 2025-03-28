const Joi = require("joi");

function branchValidation(data) {
  const branchesSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    image: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^\+998\d{9}$/)
      .required(),
    address: Joi.string().min(5).max(100).required(),
    regionId: Joi.number().positive().required(),
    educationalCenterId: Joi.number().positive().required(),
    centerID: Joi.number().positive(), 
    fields: Joi.array().items(Joi.number().positive()),
    subjects: Joi.array().items(Joi.number().positive()),
  });

  return branchesSchema.validate(data);
}

function branchValidationUpdate(data) {
  const branchesSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    image: Joi.string(),
    phone: Joi.string().pattern(/^\+998\d{9}$/),
    address: Joi.string().min(5).max(100),
    regionId: Joi.number().positive(),
    educationalCenterId: Joi.number().positive(),
    centerID: Joi.number().positive(),
    fields: Joi.array().items(Joi.number().positive()),
    subjects: Joi.array().items(Joi.number().positive()),
  });

  return branchesSchema.validate(data);
}

module.exports = { branchValidation, branchValidationUpdate };
