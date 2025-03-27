const Category = require("../models/resourceCategory.model.js");
const User = require("../models/user.model");
const Resource = require("../models/resource.model");
const { Op } = require("sequelize");
const {
  resourceValidation,
  resourceValidationUpdate,
} = require("../validations/resource.validation.js");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let resourceLogger = logger.child({ module: "Authorization" });

const getAll = async (req, res) => {
  try {
    let { search, page, limit, categoryID, sortBy, sortOrder } = req.query;
    let whereClause = {};

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }
    if (categoryID) {
      whereClause.categoryID = { [Op.eq]: categoryID };
    }

    const pageSize = limit ? parseInt(limit) : 10;
    const pageNumber = page ? parseInt(page) : 1;

    let order = [["createdAt", "DESC"]];
    if (sortBy) {
      const validSortOrder = sortOrder === "asc" ? "ASC" : "DESC";
      order = [[sortBy, validSortOrder]];
    }

    const resources = await Resource.findAndCountAll({
      where: whereClause,
      include: [{ model: Category }, { model: User }],
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      order: order,
    });

    res.status(200).json({
      total: resources.count,
      page: pageNumber,
      pageSize: pageSize,
      data: resources.rows,
    });
    resourceLogger.log("Taked all resources!");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByPk(id, {
      include: [{ model: Category }, { model: User }],
    });

    if (!resource) {
      res.status(404).json({ message: "Resource not found ❗" });
      resourceLogger.log("error", "Resource not found ❗");
      return;
    }
    res.status(200).send({ data: resource });
    resourceLogger.log("info", "Resource taked successfully ❗");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const post = async (req, res) => {
  try {
    const { error, value } = resourceValidation(req.body);
    if (error) return res.status(422).send({ error: error.details[0].message });

    const newResource = await Resource.create(value);
    resourceLogger.log("info", "Resource created successfully ❗");
    res.status(200).send({ data: newResource });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = resourceValidationUpdate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updateResource = await Resource.update(value, { where: { id } });
    if (!updateResource[0]) {
      res.status(404).send({ message: "Resource not found ❗" });
      resourceLogger.log("error", "Resource not found ❗");
      return;
    }

    const result = await Resource.findByPk(id);
    res.status(200).send({ data: result });
    resourceLogger.log("info", "Resource updated successfully ❗");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResource = await Resource.destroy({ where: { id } });

    if (!deleteResource) {
      res.status(404).send({ message: "Resource not found ❗" });
      resourceLogger.log("error", "Resource not found ❗");
    }

    res.status(200).send({ message: "Resource deleted successfully ❗" });
    resourceLogger.log("info", "Resource deleted successfully ❗");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getAll, getOne, post, update, remove };
