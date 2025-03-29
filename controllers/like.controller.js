const { Like, educationalCenter } = require("../models/index.model");
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
    const data = await Like.findAll({
      where: { userID: req.user.id },
      include: [
        {
          model: educationalCenter,
          as: "EducationalCenter", 
          attributes: ["id", "name", "address"], 
        },
      ],
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No likes found ❗" });
    }

    likeLogger.log("info", "Likes retrieved successfully");
    res.json(data);
  } catch (error) {
    likeLogger.log("error", error.message);
    res.status(500).json({ error: error.message });
  }
};

const post = async (req, res) => {
  try {
    const existingLike = await Like.findOne({
      where: {
        userID: req.user.id,
        educationalCenterID: req.body.educationalCenterID,
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ message: "You already liked this center ❗" });
    }

    const { error } = likeValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newLike = await Like.create({
      educationalCenterID: req.body.educationalCenterID,
      userID: req.user.id,
    });

    likeLogger.log("info", "Like created successfully ✅");
    res.status(201).json(newLike);
  } catch (error) {
    likeLogger.log("error", error.message);
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const like = await Like.findOne({
      where: {
        id: req.params.id,
        userID: req.user.id,
      },
    });

    if (!like) {
      return res.status(404).json({ message: "Like not found ❗" });
    }

    await like.destroy();
    likeLogger.log("info", "Like removed successfully ✅");
    res.json({ message: "Like removed successfully" });
  } catch (error) {
    likeLogger.log("error", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  post,
  remove,
  liked,
};
