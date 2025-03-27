const Course = require("../models/course.model");
const {
  courseValidation,
  courseUpdateValidation,
} = require("../validations/course.validation");
const { Op } = require("sequelize");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let courseLogger = logger.child({ module: "Authorization" });

const getAll = async (req, res) => {
  try {
    let { take, from, name, type, sortBy, sortOrder } = req.query;

    let whereClause = {};

    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (type) whereClause.type = type;

    const limit = take ? parseInt(take) : 10;
    const offset = from ? parseInt(from) : 0;

    let order = [["id", "ASC"]];
    if (sortBy) {
      const validSortOrder = sortOrder === "desc" ? "DESC" : "ASC";
      order = [[sortBy, validSortOrder]];
    }

    const data = await Course.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order,
    });

    if (!data.rows.length) {
      courseLogger.log("error", "Course not found!");
      return res.status(404).json({ message: "No courses found ❗" });
    }

    res.status(200).json({
      total: data.count,
      pageSize: limit,
      from: offset,
      data: data.rows,
    });
    courseLogger.log("info", "Course getall!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const data = await Course.findByPk(req.params.id);
    if (!data) {
      courseLogger.log("error", "Course not found!");
      return res.status(404).send("Cource not found ❗");
    }
    courseLogger.log("info", "Course getone!");
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const post = async (req, res) => {
  try {
    const data = await Course.findOne({ where: { name: req.body.name } });
    if (data) {
      courseLogger.log("error", "Course already exists!");
      res.send({ message: "Course already exists ❗" });
      return;
    }
    const { error } = courseValidation(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const newData = await Course.create(req.body);
    courseLogger.log("info", "Course post!");
    res.send(newData);
  } catch (error) {
    res.send(error.mesage);
  }
};

const update = async (req, res) => {
  try {
    const data = await Course.findByPk(req.params.id);
    if (!data) {
      courseLogger.log("error", "Course not found!");
      res.send({ message: "Course not found ❗" });
      return;
    }
    const { error } = courseUpdateValidation(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    await data.update(req.body);
    courseLogger.log("info", "Course update!");
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const remove = async (req, res) => {
  try {
    const data = await Course.findByPk(req.params.id);
    if (!data) {
      courseLogger.log("error", "Course not found!");
      res.send({ message: "Course not found ❗" });
      return;
    }
    await data.destroy();
    courseLogger.log("info", "Course delete!");
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
};
