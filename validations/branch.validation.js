const Joi = require("joi");

async function branchValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    phone: Joi.string()
      .pattern(/^\+?\d{7,15}$/)
      .required(),
    address: Joi.string().min(5).max(500).required(),
    image: Joi.string().uri().required(),
    regionID: Joi.number().min(1).required(),
    centreID: Joi.number().min(1).required(),
  });

  return schema.validate(data, { abortEarly: false });
}

async function branchUpdateValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).optional(),
    phone: Joi.string()
      .pattern(/^\+?\d{7,15}$/)
      .optional(),
    address: Joi.string().min(5).max(500).optional(),
    image: Joi.string().uri().optional(),
    regionID: Joi.number().min(1).optional(),
    centreID: Joi.number().min(1).optional(),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { branchValidation, branchUpdateValidation };
