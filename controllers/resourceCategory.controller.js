const { resourceCategory } = require("../models/index.model");
const { Op } = require("sequelize");
const {
  resourceCategoryValidation,
  resourceCategoryValidationUpdate,
} = require("../validations/resourceCategory.validation.js");
const winston = require("winston");
require("winston-mongodb");

const { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

const resourceCategoryLogger = logger.child({ module: "ResourceCategory" });

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

    const categories = await resourceCategory.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      order: order,
    });

    res.status(200).json({
      total: categories.count,
      page: pageNumber,
      pageSize: pageSize,
      data: categories.rows,
    });
    resourceCategoryLogger.log(
      "info",
      "Resource category retrieved successfully ✅"
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await resourceCategory.findByPk(id);

    if (!category) {
      resourceCategoryLogger.log("error", "Resource category not found ❗");
      return res
        .status(404)
        .json({ message: "Resource Category not found ❗" });
    }

    res.status(200).json({ data: category });
    resourceCategoryLogger.log(
      "info",
      "Resource category retrieved successfully ✅"
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const post = async (req, res) => {
  try {
    if (!resourceCategory) {
      throw new Error("ResourceCategory model not found in database instance");
    }

    const { error, value } = resourceCategoryValidation(req.body);
    if (error) {
      return res.status(422).json({
        error: error.details[0].message,
      });
    }

    const newCategory = await resourceCategory.create(value);

    resourceCategoryLogger.log(
      "info",
      "Resource category created successfully ✅"
    );
    return res.status(201).json({
      success: true,
      data: newCategory,
    });
  } catch (err) {
    resourceCategoryLogger.log("error", `Creation failed: ${err.message}`);
    return res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = resourceCategoryValidationUpdate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const [updatedRowCount] = await resourceCategory.update(value, {
      where: { id },
    });
    if (!updatedRowCount) {
      resourceCategoryLogger.log("error", "Resource category not found ❗");
      return res
        .status(404)
        .json({ message: "Resource Category not found ❗" });
    }

    const updatedCategory = await ResourceCategory.findByPk(id);
    res.status(200).json({ data: updatedCategory });
    resourceCategoryLogger.log(
      "info",
      "Resource category updated successfully ✅"
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRowCount = await resourceCategory.destroy({ where: { id } });

    if (!deletedRowCount) {
      resourceCategoryLogger.log("error", "Resource category not found ❗");
      return res
        .status(404)
        .json({ message: "Resource Category not found ❗" });
    }

    res
      .status(200)
      .json({ message: "Resource Category deleted successfully ✅" });
    resourceCategoryLogger.log(
      "info",
      "Resource category removed successfully ✅"
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, post, update, remove };
