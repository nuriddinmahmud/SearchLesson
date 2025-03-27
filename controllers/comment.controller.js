const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const EducationalCenter = require("../models/educationalCenter.model");
const {
  commentValidation,
  commentUpdateValidation,
} = require("../validations/comment.validation");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let commentLogger = logger.child({ module: "Authorization" });

const getAll = async (req, res) => {
  try {
    let { take, from, star, educationCenterId, userId, sortBy, sortOrder } =
      req.query;

    let whereClause = {};

    if (star) whereClause.star = star;
    if (educationCenterId) whereClause.educationCenterId = educationCenterId;
    if (userId) whereClause.userId = userId;

    const limit = take ? parseInt(take) : 10;
    const offset = from ? parseInt(from) : 0;

    let order = [["id", "ASC"]];
    if (sortBy) {
      const validSortOrder = sortOrder === "desc" ? "DESC" : "ASC";
      order = [[sortBy, validSortOrder]];
    }

    const data = await Comment.findAndCountAll({
      include: [User, EducationalCenter],
      where: whereClause,
      limit,
      offset,
      order,
      include: [{ model: User }, { model: EducationalCenter }],
    });

    if (!data.rows.length) {
      commentLogger.log("error", "Comments not found ❗");
      return res.status(404).json({ message: "Comments not found ❗" });
    }

    res.status(200).json({
      total: data.count,
      pageSize: limit,
      from: offset,
      data: data.rows,
    });
    commentLogger.log("info", "Comments!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const myComments = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await Comment.findAll({
      where: { userId },
      include: [EducationalCenter],
      order: [["createdAt", "DESC"]],
    });

    if (!data.length) {
      commentLogger.log("error", "Comments not found ❗");
      return res.status(404).json({ message: "Comment not found ❗" });
    }

    commentLogger.log("info", "Comments!");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const data = await Comment.findByPk(req.params.id);
    if (!data) {
      commentLogger.log("error", "Comments not found ❗");
      return res.status(404).json({ message: "Comment not found ❗" });
    }
    commentLogger.log("info", "Comments!");
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const post = async (req, res) => {
  try {
    const data = await Comment.findOne({ where: { name: req.body.name } });
    if (!data) {
      commentLogger.log("error", "Comments already exists ❗");

      res.send({ message: "Comment already exists ❗" });
      return;
    }
    const { error } = commentValidation(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const newData = await Comment.create(req.body);
    commentLogger.log("info", "Comments!");
    res.send(newData);
  } catch (error) {
    res.send(error.message);
  }
};

const update = async (req, res) => {
  try {
    const data = await Comment.findByPk(req.params.id);
    if (!data) {
      commentLogger.log("error", "Comments not found ❗");
      res.send({ message: "Comment not found ❗" });
      return;
    }
    const { error } = commentUpdateValidation(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    await data.update(req.body);
    commentLogger.log("info", "Comments!");
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const remove = async (req, res) => {
  try {
    const data = await Comment.findByPk(req.params.id);
    if (!data) {
      commentLogger.log("error", "Comments not found ❗");
      res.send({ message: "Comment not found ❗" });
      return;
    }
    await data.destroy();
    commentLogger.log("info", "Comments!");
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

module.exports = {
  getAll,
  getOne,
  post,
  update,
  remove,
  myComments,
};
