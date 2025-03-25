const Joi = require("joi");

function branchesValidation(data) {
  const branchesSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(15)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    image: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^\+998\d{9}$/)
      .required(),
    address: Joi.string()
      .custom((value, helpers) => {
        if (/\s|['.-]+$/.test(value)) {
          if (!/^[a-zA-Z' .-]+$/.test(value)) {
            return helpers.error("string.invalidFormat");
          }
        } else {
          if (!/^[a-zA-Z]+$/.test(value)) {
            return helpers.error("string.invalidFormat");
          }
        }
        return value;
      })
      .required()
      .messages({
        "string.invalidFormat":
          "Invalid address format, Only letters, spaces, and ['.-] are allowd.",
      }),
    regionID: Joi.number().positive().required(),
    centreID: Joi.number().positive().required(),
  });

  return branchesSchema.validate(data, { abortEarly: true });
}

function branchesValidationUpdate(data) {
  const branchesSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(15)
      .pattern(/^[a-zA-Z]+$/),
    image: Joi.string(),
    phone: Joi.string().pattern(/^\+998\d{9}$/),
    address: Joi.string().pattern(/^[a-zA-Z]+$/),
    regionID: Joi.number().positive(),
    centreID: Joi.number().positive(),
  });

  return branchesSchema.validate(data, { abortEarly: true });
}

export { branchesValidation, branchesValidationUpdate };
