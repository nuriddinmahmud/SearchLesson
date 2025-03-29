const Joi = require("joi");

const messages = {
  educationalCenterID: {
    "number.base": "Educational Center ID must be a number",
    "number.positive": "Educational Center ID must be positive",
    "any.required": "Educational Center ID is required",
  },
};

function likeValidation(data) {
  const schema = Joi.object({
    educationalCenterID: Joi.number()
      .positive()
      .required()
      .messages(messages.educationalCenterID),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = { likeValidation };
