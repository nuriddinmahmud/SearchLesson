const {
  Branch,
  EducationalCenter,
  Region,
  Field,
  Subject,
} = require("../models/index");
const fieldBra = require("../models/fieldBra.js");
const subjectBra = require("../models/subjectBra.js");
const { Op } = require("sequelize");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let branchLogger = logger.child({ module: "BranchController" });

const {
  branchValidation,
  branchValidationUpdate,
} = require("../validations/branch.validation.js");

const getAll = async (req, res) => {
  try {
    let { search, page, limit, regionID, sortBy, sortOrder } = req.query;
    let whereClause = {};

    if (search) whereClause.name = { [Op.iLike]: `%${search}%` };
    if (regionID) whereClause.regionID = regionID;

    const pageSize = limit ? parseInt(limit) : 10;
    const pageNumber = page ? parseInt(page) : 1;

    let order = [["createdAt", "DESC"]];
    if (sortBy) {
      order = [[sortBy, sortOrder === "asc" ? "ASC" : "DESC"]];
    }

    const branches = await Branch.findAndCountAll({
      where: whereClause,
      include: [Region, EducationalCenter, Field, Subject],
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      order: order,
    });

    res.status(200).json({
      total: branches.count,
      page: pageNumber,
      pageSize,
      data: branches.rows,
    });
  } catch (err) {
    branchLogger.error(`Error in getAll: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByPk(id, {
      include: [Region, EducationalCenter, Field, Subject],
    });

    if (!branch) {
      branchLogger.error(`Branch with ID ${id} not found.`);
      return res.status(404).json({ message: "Branch not found ❗" });
    }

    res.status(200).json({ data: branch });
  } catch (err) {
    branchLogger.error(`Error in getOne: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

const post = async (req, res) => {
  try {
    const { regionID, centreID, fieldID, subjectID, ...rest } = req.body;
    const { error } = branchValidation(req.body);
    if (error) {
      branchLogger.error(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }

    const [center, region] = await Promise.all([
      EducationalCenter.findByPk(centreID),
      Region.findByPk(regionID),
    ]);

    if (!center) return res.status(404).json({ message: "Center not found!" });
    if (!region) return res.status(404).json({ message: "Region not found!" });

    await center.update({ branch_number: center.branch_number + 1 });

    const newBranch = await Branch.create({ ...rest, regionID, centreID });

    if (Array.isArray(subjectID) && subjectID.length > 0) {
      await subjectBra.bulkCreate(
        subjectID.map((id) => ({ BranchId: newBranch.id, subjectID: id }))
      );
    }

    if (Array.isArray(fieldID) && fieldID.length > 0) {
      await fieldBra.bulkCreate(
        fieldID.map((id) => ({ BranchId: newBranch.id, fieldID: id }))
      );
    }

    branchLogger.info(`New branch created with ID: ${newBranch.id}`);
    res.status(201).json({ data: newBranch });
  } catch (err) {
    branchLogger.error(`Error in post: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = branchValidationUpdate(req.body);
    if (error) {
      branchLogger.error(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }

    const [updated] = await Branch.update(value, { where: { id } });
    if (!updated) {
      branchLogger.error(`Branch with ID ${id} not found for update.`);
      return res.status(404).json({ message: "Branch not found ❗" });
    }

    const updatedBranch = await Branch.findByPk(id);
    branchLogger.info(`Branch updated with ID: ${id}`);
    res.status(200).json({ data: updatedBranch });
  } catch (err) {
    branchLogger.error(`Error in update: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Branch.destroy({ where: { id } });

    if (!deleted) {
      branchLogger.error(`Branch with ID ${id} not found for deletion.`);
      return res.status(404).json({ message: "Branch not found ❗" });
    }

    branchLogger.info(`Branch deleted with ID: ${id}`);
    res.status(200).json({ message: "Branch deleted successfully ❗" });
  } catch (err) {
    branchLogger.error(`Error in remove: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, post, update, remove };
