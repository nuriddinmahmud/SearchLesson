const Like = require("../models/like.model");
const User = require("../models/user.model");
const EducationalCenter = require("../models/educationalCenter.model");
const { likeValidation } = require("../validations/like.validation");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let likeLogger = logger.child({ module: "Authorization" });

const getAll = async (req, res) => {
  try {
    let { take, from, userId, sortBy, sortOrder } = req.query;

    let whereClause = {};

    if (userId) whereClause.userId = userId;

    const limit = take ? parseInt(take) : 10;
    const offset = from ? parseInt(from) : 0;

    let order = [["id", "ASC"]];
    if (sortBy) {
      const validSortOrder = sortOrder === "desc" ? "DESC" : "ASC";
      order = [[sortBy, validSortOrder]];
    }

    const data = await Like.findAndCountAll({
      include: [User, EducationalCenter],
      where: whereClause,
      limit,
      offset,
      order,
    });

    if (!data.rows.length) {
      res.status(404).json({ message: "Like not found ❗" });
      likeLogger.log("error", "Like not found ❗");
      return;
    }

    res.status(200).json({
      total: data.count,
      pageSize: limit,
      from: offset,
      data: data.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

const getOne = async (req, res) => {
  try {
    const data = await Like.findByPk(req.params.id);
    if (!data) {
      res.send({ message: "Like not found ❗" });
      likeLogger.log("error", "Like not found ❗");
      return;
    }
    likeLogger.log("info", "Like get by id!");
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const post = async (req, res) => {
  try {
    
    const data = await Like.findOne({
      where: { userID: req.body.userID},
    });
    console.log(req.body.userId,req.body.educationCentreID);

    if (data) {
      return res.status(400).json({ message: "Like already exists ❗" });
    }

    const { error } = likeValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newData = await Like.create(req.body);
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
  getAll,
  getOne,
  post,
  remove,
  liked,
};
