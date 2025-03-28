const { Like } = require("../models/index.model");
const { likeValidation } = require("../validations/like.validation");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let likeLogger = logger.child({ module: "Like" });

const liked = async (req, res) => {
  try {
    const data = await Like.findAll({ where: { userId: req.userId } });
    if (!data) {
      res.send({ message: "Like not found ❗" });
      likeLogger.log("error", "Like not found ❗");
      return;
    }
    likeLogger.log("info", "Likes!");
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const post = async (req, res) => {
  try {
    const data = await Like.findOne({
      where: { userID: req.user.id },
    });
    console.log(req.body.userId, req.body.educationalCenterID);

    if (data) {
      return res.status(400).json({ message: "Like already exists ❗" });
    }

    const { error } = likeValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newData = await Like.create({ ...req.body, userID: req.user.id });
    likeLogger.log("info", "Like created succesfully✅");
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const data = await Like.findByPk(req.params.id);
    if (!data) {
      res.send({ message: "Like not found ❗" });
      likeLogger.log("error", "Like not found ❗");
      return;
    }
    await data.destroy();
    likeLogger.log("info", "Like removed succesfully✅");
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

module.exports = {
  post,
  remove,
  liked,
};
