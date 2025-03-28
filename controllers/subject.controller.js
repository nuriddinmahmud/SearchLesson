const { Subject } = require("../models/index");
const {
  subjectValidation,
  subjectValidationUpdate,
} = require("../validations/subject.validation");
const { Op } = require("sequelize");
const winston = require("winston");
require("winston-mongodb");

const { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

const SubjectLogger = logger.child({ module: "Subject" });

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
    
    res.status(200).json({
      total: data.count,
      pageSize: limit,
      from: offset,
      data: data.rows,
    });

    SubjectLogger.info("Subjects retrieved successfully!");
  } catch (error) {
    SubjectLogger.error(`Error retrieving subjects: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const data = await Subject.findByPk(req.params.id);
    if (!data) {
      SubjectLogger.error("Subject not found!");
      return res.status(404).json({ message: "Subject not found ❗" });
    }

    SubjectLogger.info("Subject retrieved successfully!");
    res.json(data);
  } catch (error) {
    SubjectLogger.error(`Error retrieving subject: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const post = async (req, res) => {
  try {
    const existingSubject = await Subject.findOne({
      where: { name: req.body.name },
    });
    if (existingSubject) {
      SubjectLogger.error("Subject already exists!");
      return res.status(400).json({ message: "Subject already exists ❗" });
    }

    const { error } = subjectValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newSubject = await Subject.create(req.body);
    SubjectLogger.info("Subject created successfully!");
    res.status(201).json(newSubject);
  } catch (error) {
    SubjectLogger.error(`Error creating subject: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) {
      SubjectLogger.error("Subject not found!");
      return res.status(404).json({ message: "Subject not found ❗" });
    }

    const { error } = subjectValidationUpdate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    await subject.update(req.body);
    SubjectLogger.info("Subject updated successfully!");
    res.json({ message: "Subject updated successfully" });
  } catch (error) {
    SubjectLogger.error(`Error updating subject: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) {
      SubjectLogger.error("Subject not found!");
      return res.status(404).json({ message: "Subject not found ❗" });
    }

    await subject.destroy();
    SubjectLogger.info("Subject deleted successfully!");
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    SubjectLogger.error(`Error deleting subject: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getOne,
  post,
  update,
  remove,
};
