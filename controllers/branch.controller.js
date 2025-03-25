const Branch = require("../models/branch.model");
const Region = require("../models/region.model");
const EducationalCenter = require("../models/educationalCenter.model");
const { Op } = require("sequelize");

const {
  branchValidation,
  branchValidationUpdate,
} = require("../validations/branch.validation.js");

const getAll = async (req, res) => {
  try {
    let { search, page, limit, regionID, sortBy, sortOrder } = req.query;
    let whereClause = {};

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }
    if (regionID) {
      whereClause.regionID = { [Op.eq]: regionID };
    }

    const pageSize = limit ? parseInt(limit) : 10;
    const pageNumber = page ? parseInt(page) : 1;

    let order = [["createdAt", "DESC"]];
    if (sortBy) {
      const validSortOrder = sortOrder === "asc" ? "ASC" : "DESC";
      order = [[sortBy, validSortOrder]];
    }

    const branches = await Branch.findAndCountAll({
      where: whereClause,
      include: [
        { model: Region, attributes: ["id", "name"] },
        { model: EducationalCenter }
      ],
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      order: order,
    });

    res.status(200).json({
      total: branches.count,
      page: pageNumber,
      pageSize: pageSize,
      data: branches.rows,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByPk(id, {
      include: [
        { model: Region, attributes: ["id", "name"] },
        { model: EducationalCenter },
      ],
    });

    if (!branch) return res.status(404).json({ message: "Branch not found" });

    res.status(200).send({ data: branch });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const post = async (req, res) => {
  try {
    const { error, value } = branchValidation(req.body);
    if (error) return res.status(422).send({ error: error.details[0].message });

    const newBranch = await Branch.create(value);
    res.status(200).send({ data: newBranch });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = branchValidationUpdate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updateBranch = await Branch.update(value, { where: { id } });
    if (!updateBranch[0]) {
      return res.status(404).send({ message: "Branch not found ❗" });
    }

    const result = await Branch.findByPk(id);
    res.status(200).send({ data: result });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBranch = await Branch.destroy({ where: { id } });

    if (!deleteBranch) {
      return res.status(404).send({ message: "Branch not found ❗" });
    }

    res.status(200).send({ message: "Branch deleted successfully" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getAll, getOne, post, update, remove };
