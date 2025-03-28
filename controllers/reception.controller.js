const { Reception } = require("../models/index");
const winston = require("winston");
require("winston-mongodb");

const { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

const receptionLogger = logger.child({ module: "Reception" });

const { receptionValidation } = require("../validations/reception.validation");

const myCourses = async (req, res) => {
  try {
    const data = await Reception.findAll({ where: { userID: req.userID } });

    if (!data.length) {
      receptionLogger.log("error", "No courses found ❗");
      return res.status(404).json({ message: "No courses found ❗" });
    }

    receptionLogger.log("info", "Fetched my courses successfully ✅");
    res.status(200).json(data);
  } catch (error) {
    receptionLogger.log("error", error.message);
    res.status(400).json({ error: error.message });
  }
};

const post = async (req, res) => {
  try {
    const { userID, educationCenterID, fieldID, branchID } = req.body;

    const existing = await Reception.findOne({
      where: { userID, educationCenterID, fieldID, branchID },
    });

    if (existing) {
      receptionLogger.log(
        "error",
        "You have already registered to this course ❗"
      );
      return res
        .status(400)
        .json({ message: "You have already registered to this course ❗" });
    }

    const { error } = receptionValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newData = await Reception.create({ ...req.body, userID: req.userID });

    receptionLogger.log("info", "Successfully registered ✅");
    res
      .status(201)
      .json({ message: "You registered successfully ✅", data: newData });
  } catch (error) {
    receptionLogger.log("error", error.message);
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const data = await Reception.findByPk(req.params.id);

    if (!data) {
      receptionLogger.log("error", "Reception not found ❗");
      return res.status(404).json({ message: "Reception not found ❗" });
    }

    await data.destroy();
    receptionLogger.log("info", "Reception deleted successfully ✅");
    res
      .status(200)
      .json({ message: "Reception deleted successfully ✅", data });
  } catch (error) {
    receptionLogger.log("error", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { myCourses, post, remove };
