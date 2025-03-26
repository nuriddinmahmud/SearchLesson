const Joi = require("joi");

function userValidation(data) {
  const User = Joi.object({
    fullname: Joi.string()
      .max(25)
      .min(2)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    email: Joi.string()
      .email({ tlds: { allow: ["com", "net", "uz", "ru", "en"] } })
      .required(),
    phone: Joi.string()
      .min(13)
      .max(13)
      .pattern(/^\+998\d{9}$/)
      .required(),
    yearOfBirth: Joi.number().integer().min(1900).max(2021).required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    role: Joi.string().valid("Admin", "Ceo", "User", "SuperAdmin").required(),
    avatar: Joi.string().required(),
    status: Joi.string().valid("Active", "Inactive").optional(),
  });
  return User.validate(data, { abortEarly: true });
}

function userValidationUpdate(data) {
  const User = Joi.object({
    fullname: Joi.string()
      .min(2)
      .max(25)
      .pattern(/^[a-zA-Z]+$/)
      .optional(),
    email: Joi.string()
      .email({ tlds: { allow: ["com", "net", "uz", "ru", "en"] } })
      .optional(),
    phone: Joi.string()
      .min(13)
      .max(13)
      .pattern(/^\+998\d{9}$/)
      .optional(),
    yearOfBirth: Joi.number().integer().min(1900).max(2021).optional(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .optional(),
    role: Joi.string().valid("Admin", "Ceo", "User", "SuperAdmin").optional(),
    avatar: Joi.string().optional(),
    status: Joi.string().valid("Active", "Inactive").optional(),
  });

  return User.validate(data, { abortEarly: true });
}

module.exports = {
  userValidation,
  userValidationUpdate,
};
