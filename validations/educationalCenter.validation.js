const Joi = require("joi");

const nameAddressPattern = /^[a-zA-Z' .-]+$/;
const phonePattern = /^\+998\d{9}$/;

const messages = {
  name: {
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be at most 50 characters",
    "string.pattern.base": "Name can only contain letters, spaces, and ['.-]",
  },
  address: {
    "string.base": "Address must be a string",
    "string.empty": "Address is required",
    "string.pattern.base":
      "Address can only contain letters, spaces, and ['.-]",
  },
  phone: {
    "string.base": "Phone must be a string",
    "string.empty": "Phone is required",
    "string.pattern.base": "Phone must be in format +998XXXXXXXXX",
  },
};

function educationCenterValidation(data) {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(nameAddressPattern)
      .min(3)
      .max(50)
      .required()
      .messages(messages.name),

    image: Joi.string().required(),

    address: Joi.string()
      .pattern(nameAddressPattern)
      .required()
      .messages(messages.address),

    regionID: Joi.number().positive().required(),

    phone: Joi.string()
      .length(13)
      .pattern(phonePattern)
      .required()
      .messages(messages.phone),

    fields: Joi.array().items(Joi.number().positive()).required(),
    subjects: Joi.array().items(Joi.number().positive()).required(),
  });

  return schema.validate(data, { abortEarly: false });
}

function educationCenterValidationUpdate(data) {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(nameAddressPattern)
      .min(3)
      .max(50)
      .messages(messages.name),

    image: Joi.string(),

    address: Joi.string()
      .pattern(nameAddressPattern)
      .messages(messages.address),

    regionID: Joi.number().positive(),

    phone: Joi.string()
      .length(13)
      .pattern(phonePattern)
      .messages(messages.phone),

    fields: Joi.array().items(Joi.number().positive()),
    subjects: Joi.array().items(Joi.number().positive()),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = {
  educationCenterValidation,
  educationCenterValidationUpdate,
};
