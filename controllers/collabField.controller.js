const CollabField = require("../models/collabField.model");
const collabFieldValidation = require("../validations/collabField.validation");

async function post(req, res) {
  try {
    let body = req.body;
    let { error, value } = collabFieldValidation(body);
    if (error) {
      return res.status(422).send({ message: error.details[0].message });
    }

    const createCollabField = await CollabField.create(value);
    res.status(200).send({
      message: "CollabField created successfully ❗",
      data: createCollabField,
    });
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

module.exports = { post };
