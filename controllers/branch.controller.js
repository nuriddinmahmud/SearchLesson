const {
  educationalCenter,
  Region,
  Subject,
  Field,
  Comment,
  Branch,
} = require("../models/index.model");
const { Op } = require("sequelize");
const subjectEdu = require("../models/subjectEdu.model");
const fieldEdu = require("../models/fieldEdu.model");
const {
  educationCenterValidationUpdate,
  educationCenterValidation,
} = require("../validations/educationalCenter.validation");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/educationalCenters.log" }),
  ],
});

const educationalCenterLogger = logger.child({ module: "EducationalCenter" });

async function getAll(req, res) {
  try {
    const {
      name,
      regionId,
      limit = 10,
      page = 1,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (regionId) where.regionID = regionId;

    const { count, rows } = await educationalCenter.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, order]],
      include: [
        { model: Region, attributes: ["id", "name"] },
        {
          model: Subject,
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
        {
          model: Field,
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
        { model: Comment, attributes: ["id", "description", "star"] },
        { model: Branch, attributes: ["id", "name"] },
      ],
      distinct: true,
    });

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    educationalCenterLogger.error(`Get all error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch educational centers",
      error: error.message,
    });
  }
}

async function getOne(req, res) {
  try {
    const center = await educationalCenter.findByPk(req.params.id, {
      attributes: [
        "id",
        "name",
        "image",
        "address",
        "phone",
        "regionID",
        "createdAt",
      ],
      include: [
        { model: Region, attributes: ["id", "name"] },
        {
          model: Subject,
          through: { attributes: [] },
          attributes: ["id", "name", "image"],
        },
        {
          model: Field,
          through: { attributes: [] },
          attributes: ["id", "name", "image"],
        },
        {
          model: Comment,
          attributes: ["id", "description", "star", "createdAt"],
        },
        {
          model: Branch,
          attributes: ["id", "name", "phone", "address"],
        },
      ],
    });

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Educational center not found",
      });
    }

    res.status(200).json({
      success: true,
      data: center,
    });
  } catch (error) {
    educationalCenterLogger.error(`Get one error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch educational center",
      error: error.message,
    });
  }
}

async function create(req, res) {
  try {
    const { subjects = [], fields = [], ...rest } = req.body;

    const { error } = educationCenterValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    if (!req.user || !["Admin", "Ceo"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const regionExists = await Region.findByPk(rest.regionID);
    if (!regionExists) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    const newCenter = await educationalCenter.create({
      ...rest,
      createdBy: req.user.id,
    });

    if (subjects.length) {
      const existingSubjects = await Subject.findAll({
        where: { id: subjects },
      });

      if (existingSubjects.length !== subjects.length) {
        const missing = subjects.filter(
          (id) => !existingSubjects.some((s) => s.id === id)
        );
        return res.status(404).json({
          success: false,
          message: "Some subjects not found",
          missingSubjects: missing,
        });
      }

      await subjectEdu.bulkCreate(
        existingSubjects.map((s) => ({
          educationalCenterId: newCenter.id,
          subjectId: s.id,
        }))
      );
    }

    if (fields.length) {
      const existingFields = await Field.findAll({
        where: { id: fields },
      });

      if (existingFields.length !== fields.length) {
        const missing = fields.filter(
          (id) => !existingFields.some((f) => f.id === id)
        );
        return res.status(404).json({
          success: false,
          message: "Some fields not found",
          missingFields: missing,
        });
      }

      await fieldEdu.bulkCreate(
        existingFields.map((f) => ({
          educationalCenterId: newCenter.id,
          fieldId: f.id,
        }))
      );
    }

    const createdCenter = await educationalCenter.findByPk(newCenter.id, {
      include: [
        { model: Region },
        { model: Subject, through: { attributes: [] } },
        { model: Field, through: { attributes: [] } },
      ],
    });

    educationalCenterLogger.info(`Center created: ${createdCenter.name}`);

    res.status(201).json({
      success: true,
      message: "Educational center created successfully",
      data: createdCenter,
    });
  } catch (error) {
    educationalCenterLogger.error(`Create error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to create educational center",
      error: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { error, value } = educationCenterValidationUpdate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    if (!req.user || !["Admin", "Ceo"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const [updated] = await educationalCenter.update(value, { where: { id } });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Educational center not found",
      });
    }

    const updatedCenter = await educationalCenter.findByPk(id);

    res.status(200).json({
      success: true,
      message: "Educational center updated successfully",
      data: updatedCenter,
    });
  } catch (error) {
    educationalCenterLogger.error(`Update error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update educational center",
      error: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    if (!req.user || !["Admin", "Ceo"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const deleted = await educationalCenter.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Educational center not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Educational center deleted successfully",
    });
  } catch (error) {
    educationalCenterLogger.error(`Delete error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete educational center",
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
