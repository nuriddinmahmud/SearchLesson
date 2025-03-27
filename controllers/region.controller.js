const Region = require("../models/region.model.js");
const { Op } = require("sequelize");
const {
  regionValidation,
  regionValidationUpdate,
} = require("../validations/region.validation.js");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let regionLogger = logger.child({ module: "Authorization" });

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

    const regions = await Region.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      order: order,
    });

    res.status(200).json({
      total: regions.count,
      page: pageNumber,
      pageSize: pageSize,
      data: regions.rows,
    });
    regionLogger.log("info", "Get all regions!");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.findByPk(id);

    if (!region) {
      res.status(404).json({ message: "Region not found ❗" });
      regionLogger.log("error", "Region not found ❗");
      return;
    }

    res.status(200).send({ data: region });
    regionLogger.log("info", "Get one regions!");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const post = async (req, res) => {
  try {
    const { error, value } = regionValidation(req.body);
    if (error) {
      res.status(422).send({ error: error.details[0].message });
      regionLogger.log("error", "Error in creating regions ❗");
    }
    const newRegion = await Region.create(value);
    regionLogger.log("info", "Post regions!");
    res.status(200).send({ data: newRegion });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = regionValidationUpdate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updateRegion = await Region.update(value, { where: { id } });
    if (!updateRegion[0]) {
      res.status(404).send({ message: "Region not found ❗" });
      regionLogger.log("error", "Region not found ❗");
      return;
    }

    const result = await Region.findByPk(id);
    regionLogger.log("info", "Updated regions!");
    res.status(200).send({ data: result });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRegion = await Region.destroy({ where: { id } });

    if (!deleteRegion) {
      res.status(404).send({ message: "Region not found ❗" });
      regionLogger.log("error", "Region not found ❗");
      return;
    }

    regionLogger.log("info", "Region deleted successfully ❗");
    res.status(200).send({ message: "Region deleted successfully ❗" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getAll, getOne, post, update, remove };
