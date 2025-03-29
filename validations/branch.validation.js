const Joi = require("joi");

const branchValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    image: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^\+998\d{9}$/)
      .required(),
    address: Joi.string().min(5).max(100).required(),
    regionID: Joi.number().positive().required(),
    educationalCenterID: Joi.number().positive().required(),
    fields: Joi.array().items(Joi.number().positive()).required(),
    subjects: Joi.array().items(Joi.number().positive()).required(),
  });

  return schema.validate(data);
};

const branchValidationUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    image: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^\+998\d{9}$/)
      .required(),
    address: Joi.string().min(5).max(100).required(),
    regionID: Joi.number().positive().required(),
    educationalCenterID: Joi.number().positive().required(),
    fields: Joi.array().items(Joi.number().positive()).required(),
    subjects: Joi.array().items(Joi.number().positive()).required(),
  });

  return schema.validate(data);
};

module.exports = { branchValidation, branchValidationUpdate };
