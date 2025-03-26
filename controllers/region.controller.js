const Region = require("../models/region.model.js");
const { Op } = require("sequelize");

const {
  regionValidation,
  regionValidationUpdate,
} = require("../validations/region.validation.js");

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
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.findByPk(id);

    if (!region)
      return res.status(404).json({ message: "Region not found ❗" });

    res.status(200).send({ data: region });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const post = async (req, res) => {
  try {
    const { error, value } = regionValidation(req.body);
    if (error) return res.status(422).send({ error: error.details[0].message });

    const newRegion = await Region.create(value);
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
      return res.status(404).send({ message: "Region not found ❗" });
    }

    const result = await Region.findByPk(id);
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
      return res.status(404).send({ message: "Region not found ❗" });
    }

    res.status(200).send({ message: "Region deleted successfully ❗" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getAll, getOne, post, update, remove };
