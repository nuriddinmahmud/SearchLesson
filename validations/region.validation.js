const Joi = require("joi");

function regionValidation(data) {
  const regionSchema = Joi.object({
    name: Joi.string()
      .custom((value, helpers) => {
        if (/\s|['.-]/.test(value)) {
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
      .min(2)
      .max(20)
      .required()
      .messages({
        "string.invalidFormat":
          "Invalid name format, Only letters, spaces, and ['.-] are allowed.",
      }),
  });
  return regionSchema.validate(data, { abortEarly: true });
}

function regionUpdateValidation(data) {
  const regionSchema = Joi.object({
    name: Joi.string()
      .custom((value, helpers) => {
        if (/\s|['.-]/.test(value)) {
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
      .min(2)
      .max(20)
      .optional()
      .messages({
        "string.invalidFormat":
          "Invalid name format, Only letters, spaces, and ['.-] are allowed.",
      }),
  });
  return regionSchema.validate(data, { abortEarly: true });
}

module.exports = { regionUpdateValidation, regionValidation };
