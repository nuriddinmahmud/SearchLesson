const CollabField = require("../models/collabField.model");
const collabFieldValidation = require("../validations/collabField.validation");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let collabFieldLogger = logger.child({ module: "Authorization" });

async function post(req, res) {
  try {
    let body = req.body;
    let { error, value } = collabFieldValidation(body);
    if (error) {
      res.status(422).send({ message: error.details[0].message });
      collabFieldLogger.log("error", "Error in post collabFields");
      return;
    }

    const createCollabField = await CollabField.create(value);
    res.status(200).send({
      message: "CollabField created successfully ✅",
      data: createCollabField,
    });
    collabFieldLogger.log("info", "CollabField created!");
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

module.exports = { post };
