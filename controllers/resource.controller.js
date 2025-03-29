const { Resource, resourceCategory } = require("../models/index.model.js");
const { Op } = require("sequelize");
const {
  resourceValidation,
  resourceValidationUpdate,
} = require("../validations/resource.validation.js");
const winston = require("winston");

const { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

const resourceLogger = logger.child({ module: "Resource" });

const getAll = async (req, res) => {
  try {
    let { search, page, limit, resourceCategoryID, sortBy, sortOrder } =
      req.query;
    let whereClause = {};

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }
    if (resourceCategoryID) {
      whereClause.resourceCategoryID = resourceCategoryID;
    }

    const pageSize = limit ? parseInt(limit) : 10;
    const pageNumber = page ? parseInt(page) : 1;

    let order = [["id", "DESC"]];
    if (sortBy) {
      const validSortOrder = sortOrder === "asc" ? "ASC" : "DESC";
      order = [[sortBy, validSortOrder]];
    }

    const resources = await Resource.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: resourceCategory
        },
      ],
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

    resourceLogger.info("Fetched all resources successfully!");
  } catch (err) {
    resourceLogger.error(`Error fetching resources: ${err.message}`);
    res.status(400).json({
      error: "Failed to fetch resources",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByPk(id, {
      include: [
        {
          model: resourceCategory
        },
      ],
    });

    if (!resource) {
      resourceLogger.error(`Resource with ID ${id} not found`);
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json({ data: resource });
    resourceLogger.info(`Resource with ID ${id} retrieved successfully.`);
  } catch (err) {
    resourceLogger.error(`Error retrieving resource: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

const post = async (req, res) => {
  try {
    const { error, value } = resourceValidation(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }

    const newResource = await Resource.create({
      ...value,
      userID: req.user.id,
    });

    resourceLogger.info(
      `Resource created successfully with ID ${newResource.id}`
    );
    res.status(201).json({ data: newResource });
  } catch (err) {
    resourceLogger.error(`Error creating resource: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = resourceValidationUpdate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const [affectedRows] = await Resource.update(value, { where: { id } });
    if (!affectedRows) {
      resourceLogger.error(`Resource with ID ${id} not found ❗`);
      return res.status(404).json({ message: "Resource not found ❗" });
    }

    const updatedResource = await Resource.findByPk(id);
    res.status(200).json({ data: updatedResource });
    resourceLogger.info(`Resource with ID ${id} updated successfully.`);
  } catch (err) {
    resourceLogger.error(`Error updating resource: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Resource.destroy({ where: { id } });

    if (!deleted) {
      resourceLogger.error(`Resource with ID ${id} not found ❗`);
      return res.status(404).json({ message: "Resource not found ❗" });
    }

    res.status(200).json({ message: "Resource deleted successfully ❗" });
    resourceLogger.info(`Resource with ID ${id} deleted successfully.`);
  } catch (err) {
    resourceLogger.error(`Error deleting resource: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, post, update, remove };
