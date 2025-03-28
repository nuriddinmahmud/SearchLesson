const { Region } = require("../models/index.model");
const { Op } = require("sequelize");
const {
  regionValidation,
  regionValidationUpdate,
} = require("../validations/region.validation.js");
const winston = require("winston");

require("winston-mongodb");

const { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

const regionLogger = logger.child({ module: "Region" });

const getAll = async (req, res) => {
  try {
    const { search, page, limit, sortBy, sortOrder } = req.query;
    let whereClause = {};

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    const pageSize = limit ? parseInt(limit) : 10;
    const pageNumber = page ? parseInt(page) : 1;

    let order = [["id", "ASC"]];
    if (sortBy) {
      order = [[sortBy, sortOrder === "asc" ? "ASC" : "DESC"]];
    }

    const regions = await Region.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      order: order,
    });

    regionLogger.log("info", "Fetched all regions.");
    return res.status(200).json({
      total: regions.count,
      page: pageNumber,
      pageSize: pageSize,
      data: regions.rows,
    });
  } catch (err) {
    regionLogger.log("error", `Error fetching regions: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.findByPk(id);

    if (!region) {
      regionLogger.log("error", `Region not found: ID ${id}`);
      return res.status(404).json({ message: "Region not found ❗" });
    }

    regionLogger.log("info", `Fetched region with ID ${id}`);
    return res.status(200).json({ data: region });
  } catch (err) {
    regionLogger.log("error", `Error fetching region: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};

const post = async (req, res) => {
  try {
    const { error, value } = regionValidation(req.body);
    if (error) {
      regionLogger.log(
        "error",
        `Validation error: ${error.details[0].message}`
      );
      return res.status(422).json({ error: error.details[0].message });
    }

    const newRegion = await Region.create(value);
    regionLogger.log("info", `Created region with ID ${newRegion.id}`);

    return res.status(201).json({ data: newRegion });
  } catch (err) {
    regionLogger.log("error", `Error creating region: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = regionValidationUpdate(req.body);

    if (error) {
      regionLogger.log(
        "error",
        `Validation error: ${error.details[0].message}`
      );
      return res.status(400).json({ error: error.details[0].message });
    }

    const updateRegion = await Region.update(value, { where: { id } });

    if (!updateRegion[0]) {
      regionLogger.log("error", `Region not found for update: ID ${id}`);
      return res.status(404).json({ message: "Region not found ❗" });
    }

    const result = await Region.findByPk(id);
    regionLogger.log("info", `Updated region with ID ${id}`);

    return res.status(200).json({ data: result });
  } catch (err) {
    regionLogger.log("error", `Error updating region: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRegion = await Region.destroy({ where: { id } });

    if (!deleteRegion) {
      regionLogger.log("error", `Region not found for deletion: ID ${id}`);
      return res.status(404).json({ message: "Region not found ❗" });
    }

    regionLogger.log("info", `Deleted region with ID ${id}`);
    return res.status(200).json({ message: "Region deleted successfully ❗" });
  } catch (err) {
    regionLogger.log("error", `Error deleting region: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, post, update, remove };
