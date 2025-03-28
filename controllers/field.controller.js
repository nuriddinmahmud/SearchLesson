const { Field } = require("../models/index");
const { Op } = require("sequelize");
const {
  fieldValidation,
  fieldValidationUpdate,
} = require("../validations/field.validation.js");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let fieldLogger = logger.child({ module: "Field" });

const getAll = async (req, res) => {
  try {
    let { search, page, limit, sortBy, sortOrder } = req.query;
    let whereClause = {};

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    const pageSize = limit ? parseInt(limit) : 10;
    const pageNumber = page ? parseInt(page) : 1;

    let order = [["id", "ASC"]];
    if (sortBy) {
      const validSortOrder = sortOrder === "asc" ? "ASC" : "DESC";
      order = [[sortBy, validSortOrder]];
    }

    const fields = await Field.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      order: order,
    });

    res.status(200).json({
      total: fields.count,
      page: pageNumber,
      pageSize: pageSize,
      data: fields.rows,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const field = await Field.findByPk(id);

    if (!field) {
      fieldLogger.log("error", "Field not found ❗");
      return res.status(404).json({ message: "Field not found ❗" });
    }

    fieldLogger.log("info", "Field retrieved successfully ✅");
    res.status(200).send({ data: field });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const post = async (req, res) => {
  try {
    const { error, value } = fieldValidation(req.body);
    if (error) {
      fieldLogger.log("error", "Validation error ❗");
      return res.status(422).send({ error: error.details[0].message });
    }

    const newField = await Field.create(value);
    fieldLogger.log("info", "Field created successfully ✅");
    res.status(200).send({ data: newField });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = fieldValidationUpdate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updateField = await Field.update(value, { where: { id } });
    if (!updateField[0]) {
      fieldLogger.log("error", "Field not found ❗");
      return res.status(404).send({ message: "Field not found ❗" });
    }

    const result = await Field.findByPk(id);
    fieldLogger.log("info", "Field updated successfully ✅");
    res.status(200).send({ data: result });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteField = await Field.destroy({ where: { id } });

    if (!deleteField) {
      fieldLogger.log("error", "Field not found ❗");
      return res.status(404).send({ message: "Field not found ❗" });
    }

    fieldLogger.log("info", "Field deleted successfully ✅");
    res.status(200).send({ message: "Field deleted successfully ✅" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getAll, getOne, post, update, remove };
