const Subject = require("../models/subject.model");
const {
  SubjectValidation,
  SubjectUpdateValidation,
} = require("../validations/subject.validation");
const { Op } = require("sequelize");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let SubjectLogger = logger.child({ module: "Authorization" });

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

    const data = await Subject.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order,
    });

    if (!data.rows.length) {
      SubjectLogger.log("error", "Subject not found!");
      return res.status(404).json({ message: "No Subjects found ❗" });
    }

    res.status(200).json({
      total: data.count,
      pageSize: limit,
      from: offset,
      data: data.rows,
    });
    SubjectLogger.log("info", "Subject getall!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const data = await Subject.findByPk(req.params.id);
    if (!data) {
      SubjectLogger.log("error", "Subject not found!");
      return res.status(404).send("Cource not found ❗");
    }
    SubjectLogger.log("info", "Subject getone!");
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const post = async (req, res) => {
  try {
    const data = await Subject.findOne({ where: { name: req.body.name } });
    if (data) {
      SubjectLogger.log("error", "Subject already exists!");
      res.send({ message: "Subject already exists ❗" });
      return;
    }
    const { error } = SubjectValidation(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const newData = await Subject.create(req.body);
    SubjectLogger.log("info", "Subject post!");
    res.send(newData);
  } catch (error) {
    res.send(error.mesage);
  }
};

const update = async (req, res) => {
  try {
    const data = await Subject.findByPk(req.params.id);
    if (!data) {
      SubjectLogger.log("error", "Subject not found!");
      res.send({ message: "Subject not found ❗" });
      return;
    }
    const { error } = SubjectUpdateValidation(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    await data.update(req.body);
    SubjectLogger.log("info", "Subject update!");
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const remove = async (req, res) => {
  try {
    const data = await Subject.findByPk(req.params.id);
    if (!data) {
      SubjectLogger.log("error", "Subject not found!");
      res.send({ message: "Subject not found ❗" });
      return;
    }
    await data.destroy();
    SubjectLogger.log("info", "Subject delete!");
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
