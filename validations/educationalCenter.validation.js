const Joi = require("joi");

function educationCenterValidation(data) {
  const educationCenterSchema = Joi.object({
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
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.min": "Name must be at least 3 characters long ❗",
        "string.max": "Name must be at most 50 characters long ❗",
        "string.empty": "Name is required ❗",
        "string.invalidFormat":
          "Invalid a name format, Only letters, spaces, and ['.-] are allowed.",
      }),
    image: Joi.string().required(),
    address: Joi.string()
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
      .required()
      .messages({
        "string.invalidFormat":
          "Invalid a address format, Only letters, spaces, and ['.-] are allowed.",
      }),
    regionID: Joi.number().positive().required(),
    phone: Joi.string()
      .min(13)
      .max(13)
      .pattern(/^\+998\d{9}$/)
      .required(),
    fields: Joi.array().required(),
    subjects: Joi.array().required(),
  });
  return educationCenterSchema.validate(data, { abortEarly: true });
}

function educationCenterValidationUpdate(data) {
  const educationCenterSchema = Joi.object({
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
      .min(3)
      .max(50)
      .optional()
      .messages({
        "string.min": "Name must be at least 3 characters long ❗",
        "string.max": "Name must be at most 50 characters long ❗",
        "string.empty": "Name is required ❗",
        "string.invalidFormat":
          "Invalid a name format, Only letters, spaces, and ['.-] are allowed.",
      }),
    image: Joi.string().optional(),
    address: Joi.string()
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
      .optional()
      .messages({
        "string.invalidFormat":
          "Invalid a address format, Only letters, spaces, and ['.-] are allowed.",
      }),
    regionID: Joi.number().positive().optional(),
    phone: Joi.string()
      .min(13)
      .max(13)
      .pattern(/^\+998\d{9}$/)
      .optional(),
    fields: Joi.array().required(),
    subjects: Joi.array().required(),
  });

  return educationCenterSchema.validate(data, { abortEarly: true });
}

module.exports = {
  educationCenterValidation,
  educationCenterValidationUpdate,
};
