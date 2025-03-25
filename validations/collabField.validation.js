import Joi from "joi";

function collabFieldValidation(data) {
  const collabFieldSchema = Joi.object({
    fieldID: Joi.number().positive().required(),
    educationalCentreID: Joi.number().positive().required(),
  });
  return collabFieldSchema.validate(data, {abortEarly: true});
}

export default collabFieldValidation;
