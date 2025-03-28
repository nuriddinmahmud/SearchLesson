const Joi = require("joi");
const currentYear = new Date().getFullYear();

// Validation patterns and messages
const validationRules = {
  fullName: {
    pattern: /^[a-zA-Z\s'-]+$/, // Allows letters, spaces, apostrophes and hyphens
    messages: {
      "string.base": "Full name must be a string",
      "string.empty": "Full name is required",
      "string.min": "Full name must be at least 2 characters",
      "string.max": "Full name must be at most 50 characters",
      "string.pattern.base":
        "Full name can only contain letters, spaces, apostrophes (') and hyphens (-)",
    },
  },
  email: {
    tlds: { allow: ["com", "net", "uz", "ru", "en", "org"] },
    messages: {
      "string.base": "Email must be a string",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "string.tlds":
        "Email domain must be one of .com, .net, .uz, .ru, .en, .org",
    },
  },
  phone: {
    pattern: /^\+998\d{9}$/,
    messages: {
      "string.base": "Phone must be a string",
      "string.empty": "Phone is required",
      "string.length": "Phone must be 13 characters long",
      "string.pattern.base": "Phone must be in format +998XXXXXXXXX",
    },
  },
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    messages: {
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter and one number",
    },
  },
  yearOfBirth: {
    min: 1900,
    max: currentYear - 13, // Minimum age 13 years
    messages: {
      "number.base": "Year of birth must be a number",
      "number.empty": "Year of birth is required",
      "number.min": `Year of birth must be after 1900`,
      "number.max": `User must be at least 13 years old (born before ${
        currentYear - 13
      })`,
    },
  },
  role: {
    valid: ["Admin", "User", "Ceo", "SuperAdmin"],
    messages: {
      "string.base": "Role must be a string",
      "string.empty": "Role is required",
      "any.only": "Role must be one of Admin, User, Ceo, SuperAdmin",
    },
  },
  avatar: {
    pattern: /\.(jpg|jpeg|png|gif|webp)$/i,
    messages: {
      "string.base": "Avatar must be a string",
      "string.empty": "Avatar is required",
      "string.pattern.base":
        "Avatar must be a valid image file (jpg, jpeg, png, gif, webp)",
    },
  },
  status: {
    valid: ["Active", "Inactive"],
    messages: {
      "string.base": "Status must be a string",
      "any.only": "Status must be either Active or Inactive",
    },
  },
  regionID: {
    messages: {
      "number.base": "Region ID must be a number",
      "number.empty": "Region ID is required",
      "number.positive": "Region ID must be positive",
    },
  },
};

// Common validation schema
const baseUserSchema = {
  fullName: Joi.string()
    .min(2)
    .max(50)
    .pattern(validationRules.fullName.pattern)
    .required()
    .messages(validationRules.fullName.messages),

  email: Joi.string()
    .email({ tlds: validationRules.email.tlds })
    .required()
    .messages(validationRules.email.messages),

  phone: Joi.string()
    .length(13)
    .pattern(validationRules.phone.pattern)
    .required()
    .messages(validationRules.phone.messages),

  yearOfBirth: Joi.number()
    .integer()
    .min(validationRules.yearOfBirth.min)
    .max(validationRules.yearOfBirth.max)
    .required()
    .messages(validationRules.yearOfBirth.messages),

  password: Joi.string()
    .min(8)
    .pattern(validationRules.password.pattern)
    .required()
    .messages(validationRules.password.messages),

  role: Joi.string()
    .valid(...validationRules.role.valid)
    .required()
    .messages(validationRules.role.messages),

  avatar: Joi.string()
    .pattern(validationRules.avatar.pattern)
    .required()
    .messages(validationRules.avatar.messages),

  status: Joi.string()
    .valid(...validationRules.status.valid)
    .default("Inactive")
    .messages(validationRules.status.messages),

  regionID: Joi.number()
    .positive()
    .required()
    .messages(validationRules.regionID.messages),
};

// Create validation functions
function userValidation(data) {
  const schema = Joi.object(baseUserSchema);
  return schema.validate(data, { abortEarly: false });
}

function userValidationAdmin(data) {
  const schema = Joi.object({
    ...baseUserSchema,
    regionID: Joi.number()
      .positive()
      .messages(validationRules.regionID.messages),
  });
  return schema.validate(data, { abortEarly: false });
}

function userValidationUpdate(data) {
  const updateSchema = {};
  Object.keys(baseUserSchema).forEach((key) => {
    updateSchema[key] = baseUserSchema[key].optional();
  });
  const schema = Joi.object(updateSchema);
  return schema.validate(data, { abortEarly: false });
}

module.exports = {
  userValidation,
  userValidationUpdate,
  userValidationAdmin,
};
