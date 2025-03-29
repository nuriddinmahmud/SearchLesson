const {
  Branch,
  Region,
  Subject,
  Field,
  educationalCenter,
} = require("../models/index.model");
const { Op } = require("sequelize");
const subjectBra = require("../models/subjectBra.model");
const fieldBra = require("../models/fieldBra.model");
const {
  branchValidation,
  branchValidationUpdate,
} = require("../validations/branch.validation");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

const BranchLogger = logger.child({ module: "Branch" });

async function getAll(req, res) {
  try {
    const {
      name,
      limit = 10,
      page = 1,
      sortBy = "createdAt",
      order = "DESC",
      regionId,
      educationalCenterId,
    } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (regionId) where.regionID = regionId;
    if (educationalCenterId) where.educationalCenterID = educationalCenterId;

    const { count, rows } = await Branch.findAndCountAll({
      where,
      include: [
        {
          model: educationalCenter,
          as: "EducationalCenter",
          attributes: ["id", "name", "phone"],
        },
        {
          model: Region,
          as: "Region",
          attributes: ["id", "name"],
        },
        {
          model: Subject,
          through: { attributes: [] },
          as: "Subjects",
          attributes: ["id", "name", "image"],
        },
        {
          model: Field,
          through: { attributes: [] },
          as: "Fields",
          attributes: ["id", "name", "image"],
        },
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, order]],
      distinct: true,
    });

    res.status(200).json({
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
      data: rows,
    });
  } catch (error) {
    BranchLogger.error(`Get all error: ${error.message}`, { error });
    res.status(500).json({
      message: "Failed to fetch branches",
      error: error.message,
    });
  }
}

async function getOne(req, res) {
  try {
    const branch = await Branch.findByPk(req.params.id, {
      include: [
        {
          model: educationalCenter,
          as: "EducationalCenter",
          attributes: ["id", "name", "phone"],
        },
        {
          model: Region,
          as: "Region",
          attributes: ["id", "name"],
        },
        {
          model: Subject,
          through: { attributes: [] },
          as: "Subjects",
          attributes: ["id", "name", "image"],
        },
        {
          model: Field,
          through: { attributes: [] },
          as: "Fields",
          attributes: ["id", "name", "image"],
        },
      ],
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    BranchLogger.error(`Get one error: ${error.message}`, { error });
    res.status(500).json({
      success: false,
      message: "Failed to fetch branch",
      error: error.message,
    });
  }
}

async function create(req, res) {
  try {
    let { subjects = [], fields = [], ...rest } = req.body;

    const regionID = req.body.regionID;
    const educationalCenterID = req.body.educationalCenterID;

    if (!Array.isArray(subjects)) subjects = subjects ? [subjects] : [];
    if (!Array.isArray(fields)) fields = fields ? [fields] : [];

    const { error } = branchValidation({
      ...req.body,
      subjects,
      fields,
    });

    if (error) {
      BranchLogger.error(`Validation error: ${error.details[0].message}`);
      return res.status(422).json({
        success: false,
        message: error.details[0].message,
      });
    }

    if (!req.user || !["Admin", "Ceo"].includes(req.user.role)) {
      BranchLogger.warn(`Unauthorized access attempt by user: ${req.user?.id}`);
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    const region = await Region.findByPk(regionID);
    if (!region) {
      BranchLogger.error(`Region not found: ${regionID}`);
      return res.status(404).json({
        success: false,
        message: "Specified region does not exist",
      });
    }

    const center = await educationalCenter.findByPk(educationalCenterID);
    if (!center) {
      BranchLogger.error(
        `Educational center not found: ${educationalCenterID}`
      );
      return res.status(404).json({
        success: false,
        message: "Educational center not found",
      });
    }

    const newBranch = await Branch.create({
      ...rest,
      regionID: regionID,
      educationalCenterID: educationalCenterID,
      createdBy: req.user.id,
    });

    if (subjects.length > 0) {
      const existingSubjects = await Subject.findAll({
        where: { id: subjects },
      });

      if (existingSubjects.length !== subjects.length) {
        const missingSubjects = subjects.filter(
          (id) => !existingSubjects.some((s) => s.id === id)
        );
        BranchLogger.error(`Missing subjects: ${missingSubjects.join(", ")}`);
        return res.status(404).json({
          success: false,
          message: "One or more subjects not found",
          missingSubjects,
        });
      }

      await subjectBra.bulkCreate(
        existingSubjects.map((subject) => ({
          branchId: newBranch.id,
          subjectId: subject.id,
        }))
      );
    }

    if (fields.length > 0) {
      const existingFields = await Field.findAll({
        where: { id: fields },
      });

      if (existingFields.length !== fields.length) {
        const missingFields = fields.filter(
          (id) => !existingFields.some((f) => f.id === id)
        );
        BranchLogger.error(`Missing fields: ${missingFields.join(", ")}`);
        return res.status(404).json({
          success: false,
          message: "One or more fields not found",
          missingFields,
        });
      }

      await fieldBra.bulkCreate(
        existingFields.map((field) => ({
          branchId: newBranch.id,
          fieldId: field.id,
        }))
      );
    }

    const createdBranch = await Branch.findByPk(newBranch.id, {
      include: [
        {
          model: Subject,
          through: { attributes: [] },
          as: "Subjects",
          attributes: ["id", "name", "image"],
        },
        {
          model: Field,
          through: { attributes: [] },
          as: "Fields",
          attributes: ["id", "name", "image"],
        },
        {
          model: Region,
          as: "Region",
          attributes: ["id", "name"],
        },
        {
          model: educationalCenter,
          as: "EducationalCenter",
          attributes: ["id", "name", "phone"],
        },
      ],
    });

    BranchLogger.info(
      `New branch created by user ${req.user.id}: ${createdBranch.name}`
    );

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: createdBranch,
    });
  } catch (error) {
    BranchLogger.error(`Create error: ${error.message}`, {
      stack: error.stack,
      user: req.user?.id,
      body: req.body,
    });
    res.status(500).json({
      success: false,
      message: "Failed to create branch",
      error: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const { error, value } = branchValidationUpdate(req.body, true);

    if (error) {
      BranchLogger.error("Validation error", { error });
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    const [updated] = await Branch.update(value, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({
        message: "Branch not found",
      });
    }

    const updatedBranch = await Branch.findByPk(req.params.id, {
      include: [
        {
          model: educationalCenter,
          as: "EducationalCenter",
          attributes: ["id", "name", "phone"],
        },
        {
          model: Region,
          as: "Region",
          attributes: ["id", "name"],
        },
      ],
    });

    BranchLogger.info(`Branch updated: ${req.params.id}`);
    res.status(200).json({
      message: "Branch updated successfully",
      data: updatedBranch,
    });
  } catch (error) {
    BranchLogger.error(`Update error: ${error.message}`, { error });
    res.status(500).json({
      message: "Failed to update branch",
      error: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    const deleted = await Branch.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Branch not found",
      });
    }

    BranchLogger.info(`Branch deleted: ${req.params.id}`);
    res.status(200).json({
      message: "Branch deleted successfully",
    });
  } catch (error) {
    BranchLogger.error(`Delete error: ${error.message}`, { error });
    res.status(500).json({
      message: "Failed to delete branch",
      error: error.message,
    });
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
