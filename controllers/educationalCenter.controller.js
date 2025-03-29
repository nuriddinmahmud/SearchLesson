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
  educationCenterValidation,
  educationCenterValidationUpdate,
} = require("../validations/educationalCenter.validation");
const winston = require("winston");

const logger = winston.createLogger({
  level: "silly",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

const educationalCenterLogger = logger.child({ module: "EducationalCenter" });

async function getAll(req, res) {
  try {
    const {
      name,
      limit = 10,
      page = 1,
      order = "ASC",
      sortBy = "id",
      regionId,
    } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (regionId) where.regionID = regionId;

    const include = [
      {
        model: Subject,
        through: { attributes: [] },
        as: "Subjects",
        attributes: ["id", "name"],
      },
      {
        model: Field,
        through: { attributes: [] },
        as: "Fields",
        attributes: ["id", "name"],
      },
      {
        model: Region,
        as: "Region",
        attributes: ["id", "name"],
      },
      {
        model: Comment,
        as: "Comments",
        attributes: ["id", "description", "star"],
      },
      {
        model: Branch,
        as: "branches",
        attributes: ["id", "name", "phone"],
      },
    ];

    const { count, rows } = await educationalCenter.findAndCountAll({
      where,
      include,
      distinct: true,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, order]],
    });

    if (rows.length === 0) {
      return res.status(200).json({
        data: [],
        meta: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0,
        },
      });
    }

    res.status(200).json({
      data: rows,
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    educationalCenterLogger.error("error", `Get all error: ${error.message}`);
    res.status(500).json({
      message: "Failed to fetch educational centers",
      error: error.message,
    });
  }
}

async function getOne(req, res) {
  try {
    const center = await educationalCenter.findByPk(req.params.id, {
      attributes: ["id", "name", "image", "address", "phone"],
      include: [
        { model: Subject, as: "Subjects", through: { attributes: [] } },
        { model: Field, as: "Fields", through: { attributes: [] } },
        { model: Region, attributes: ["name"] },
        { model: Comment, attributes: ["description", "star"] },
        { model: Branch, attributes: ["name", "phone"] },
      ],
    });

    if (!center) {
      return res
        .status(404)
        .json({ message: "Educational Center not found ❗" });
    }

    res.status(200).json({ data: center });
  } catch (error) {
    educationalCenterLogger.log("error", "Error fetching educational center", {
      error,
    });
    res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    let { subjects = [], fields = [], regionID, ...rest } = req.body;

    if (!Array.isArray(subjects)) subjects = subjects ? [subjects] : [];
    if (!Array.isArray(fields)) fields = fields ? [fields] : [];

    const { error } = educationCenterValidation({
      ...req.body,
      subjects,
      fields,
    });

    if (error) {
      educationalCenterLogger.error(
        `Validation error: ${error.details[0].message}`
      );
      return res.status(422).json({
        success: false,
        message: error.details[0].message,
      });
    }

    if (!req.user || !["Ceo", "Admin"].includes(req.user.role)) {
      educationalCenterLogger.warn(
        `Unauthorized access attempt by user: ${req.user?.id}`
      );
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    const region = await Region.findByPk(regionID);
    if (!region) {
      educationalCenterLogger.error(`Region not found: ${regionID}`);
      return res.status(404).json({
        success: false,
        message: "Specified region does not exist",
      });
    }

    const newEducationalCenter = await educationalCenter.create({
      ...rest,
      regionID,
      createdBy: req.user.id,
    });

    if (subjects.length > 0) {
      const subject = await Subject.findAll({
        where: { id: subjects },
      });

      if (subject.length !== subjects.length) {
        const missingSubjects = subjects.filter(
          (id) => !subject.some((s) => s.id === id)
        );
        educationalCenterLogger.error(
          `Missing subjects: ${missingSubjects.join(", ")}`
        );
        return res
          .status(404)
          .json({ message: "One or more subjects not found" });
      }

      await subjectEdu.bulkCreate(
        subject.map((subject) => ({
          educationalCenterId: newEducationalCenter.id,
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
        educationalCenterLogger.error(
          `Missing fields: ${missingFields.join(", ")}`
        );
        return res.status(404).json({
          success: false,
          message: "One or more fields not found",
          missingFields,
        });
      }

      await fieldEdu.bulkCreate(
        existingFields.map((field) => ({
          educationalCenterId: newEducationalCenter.id,
          fieldId: field.id,
        }))
      );
    }

    const createdCenter = await educationalCenter.findByPk(
      newEducationalCenter.id,
      {
        include: [
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
          { model: Region, attributes: ["id", "name"] },
        ],
      }
    );

    educationalCenterLogger.info(
      `New educational center created by user ${req.user.id}: ${createdCenter.name}`
    );

    res.status(201).json({
      success: true,
      message: "Educational center created successfully",
      data: createdCenter,
    });
  } catch (error) {
    educationalCenterLogger.error(`Create error: ${error.message}`, {
      stack: error.stack,
      user: req.user?.id,
      body: req.body,
    });
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
    const { role } = req.user;
    const { error, value } = educationCenterValidationUpdate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!["Admin", "Ceo"].includes(role)) {
      return res.status(403).json({ message: "Not permitted ❗" });
    }

    const [updateCount] = await educationalCenter.update(value, {
      where: { id },
    });

    if (!updateCount) {
      return res
        .status(404)
        .json({ message: "Educational Centre not found ❗" });
    }

    const updatedCentre = await educationalCenter.findByPk(id);
    res.status(200).json({
      message: "Successfully updated ✅",
      data: updatedCentre,
    });
  } catch (error) {
    educationalCenterLogger.log("error", "Error updating Educational Centre", {
      error,
    });
    res.status(500).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    if (!["Admin", "Ceo"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not permitted ❗" });
    }

    const deleteCount = await educationalCenter.destroy({ where: { id } });
    if (!deleteCount) {
      return res
        .status(404)
        .json({ message: "Educational Centre not found ❗" });
    }

    res.status(200).json({ message: "Successfully deleted ✅" });
  } catch (error) {
    educationalCenterLogger.log("error", "Error deleting Educational Centre", {
      error,
    });
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAll, getOne, create, update, remove };
