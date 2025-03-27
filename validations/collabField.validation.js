const Joi = require("joi");

function collabFieldValidation(data) {
  const collabFieldSchema = Joi.object({
    fieldID: Joi.number().positive().required(),
    educationalCenterID: Joi.number().positive().required(),
  });
  return collabFieldSchema.validate(data, { abortEarly: true });
}

module.exports = collabFieldValidation;
