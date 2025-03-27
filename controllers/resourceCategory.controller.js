const ResourceCategory = require("../models/resourceCategory.model.js");
const { Op } = require("sequelize");
const {
  resourceCategoryValidation,
  resourceCategoryValidationUpdate,
} = require("../validations/resourceCategory.validation.js");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let resourceCategoryLogger = logger.child({ module: "Authorization" });

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

    const categories = await ResourceCategory.findAndCountAll({
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
      "Resource categpry taked all succesfully✅"
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ResourceCategory.findByPk(id);

    if (!category) {
      res.status(404).json({ message: "Resource Category not found ❗" });
      resourceCategoryLogger.log("error", "Resource Category not found ❗");
      return;
    }
    res.status(200).send({ data: category });
    resourceCategoryLogger.log(
      "info",
      "Resource category taked one succesfully✅"
    );
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const post = async (req, res) => {
  try {
    const { error, value } = resourceCategoryValidation(req.body);
    if (error) return res.status(422).send({ error: error.details[0].message });

    const newCategory = await ResourceCategory.create(value);
    res.status(200).send({ data: newCategory });
    resourceCategoryLogger.log(
      "info",
      "Resource category created succesfully✅"
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = resourceCategoryValidationUpdate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updateCategory = await ResourceCategory.update(value, {
      where: { id },
    });
    if (!updateCategory[0]) {
      res.status(404).send({ message: "Resource Category not found ❗" });
      resourceCategoryLogger.log("error", "Resource Category not found ❗");
      return;
    }

    const result = await ResourceCategory.findByPk(id);
    res.status(200).send({ data: result });
    resourceCategoryLogger.log(
      "info",
      "Resource cateopry updated succesfully✅"
    );
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCategory = await ResourceCategory.destroy({ where: { id } });

    if (!deleteCategory) {
      res.status(404).send({ message: "Resource Category not found ❗" });
      resourceCategoryLogger.log("error", "Resource Category not found ❗");
      return;
    }

    res
      .status(200)
      .send({ message: "Resource Category deleted successfully ❗" });
    resourceCategoryLogger.log(
      "info",
      "Resource cateopry removed succesfully✅"
    );
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getAll, getOne, post, update, remove };
