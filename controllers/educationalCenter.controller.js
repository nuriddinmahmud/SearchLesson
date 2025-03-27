const Branch = require("../models/branch.model");
const EducationalCenter = require("../models/educationalCenter.model");
const Region = require("../models/region.model");
const User = require("../models/user.model");
const SubjectEdu = require("../models/subjectEdu.model");
const FieldEdu = require("../models/fieldEdu.model");
const Subject = require("../models/subject.model");
const Field = require("../models/field.model");
const {
  educationCenterValidationUpdate,
  educationCenterValidation,
} = require("../validations/educationalCenter.validation");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let educationalCenterLogger = logger.child({ module: "Authorization" });

async function getAll(req, res) {
  try {
    const { search, sortBy, order, page, limit } = req.query;

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNumber - 1) * pageSize;

    const whereCondition = {};
    if (search) {
      whereCondition.name = { [Op.like]: `%${search}%` };
    }

    const orderCondition = [[sortBy || "createdAt", order || "DESC"]];

    const educationCenters = await EducationalCenter.findAndCountAll({
      where: whereCondition,
      attributes: [
        "id",
        "name",
        "image",
        "address",
        "phone",
        "star",
        "createdAt",
        "updatedAt",
      ],
      include: [
        { model: Field, as: "Fields", attributes: ["id", "name"] },
        { model: Subject, as: "Subjects", attributes: ["id", "name"] },
        {
          model: User,
          as: "Students",
          attributes: ["id", "fullName", "phone", "email"],
        },
        { model: Region, as: "Regions", attributes: ["id", "region"] },
      ],
      order: orderCondition,
      limit: pageSize,
      offset: offset,
    });

    if (!educationCenters.rows.length) {
      educationalCenterLogger.log("error", "Empty!");
      return res.status(200).json({ msg: "Empty ❗" });
    }

    res.status(200).json({
      total: educationCenters.count,
      page: pageNumber,
      limit: pageSize,
      data: educationCenters.rows,
    });
    educationalCenterLogger.log("info", "Educational Center get all!");
  } catch (error) {
    console.error("Error fetching education centers:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getOne(req, res) {
  try {
    const { id } = req.params;

    const educationalCenter = await EducationalCenter.findByPk(id, {
      attributes: [
        "id",
        "name",
        "image",
        "address",
        "phone",
        "star",
        "createdAt",
        "updatedAt",
      ],
      include: [
        { model: Field, as: "Fields", attributes: ["id", "name"] },
        { model: Subject, as: "Subjects", attributes: ["id", "name"] },
        {
          model: User,
          as: "Students",
          attributes: ["id", "fullName", "phone", "email"],
        },
        { model: Region, as: "Regions", attributes: ["id", "region"] },
        {
          model: Branch,
          as: "Branches",
          attributes: ["id", "name", "phone", "address"],
        },
      ],
    });

    if (!educationalCenter) {
      educationalCenterLogger.log("error", "Educational Center not found !");
      return res.status(404).json({ msg: "EducationCenter not found ❗" });
    }

    res.status(200).json({ data: educationalCenter });
    educationalCenterLogger.log("info", "Educational Center get one!");
  } catch (error) {
    console.error("Error fetching education center by ID:", error);
    res.status(500).json({ error: error.message });
  }
}

async function create(req, res) {
  try {
    const { role } = req.user;
    const { fields, subjects, ...body } = req.body;

    console.log(body);

    const { error, value } = educationCenterValidation(body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    if (role !== "Ceo" && role !== "Admin") {
      res.status(403).json({
        message:
          "Not permitted. Only Ceo and Admin can create an Educational Center ❗",
      });
      educationalCenterLogger.log(
        "error",
        "Not permitted. Only Ceo and Admin can create an Educational Center ❗"
      );
      return;
    }

    if (!value.regionID) {
      educationalCenterLogger.log("error", "regionID is required ❗");
      return res.status(400).json({ message: "regionID is required ❗" });
    }

    const regionExists = await Region.findOne({
      where: { id: value.regionID },
    });
    if (!regionExists) {
      educationalCenterLogger.log("error", "Region not found❗");
      return res.status(404).json({ message: "Region not found ❗" });
    }

    const newEducationalCenter = await EducationalCenter.create({
      ...value,
      userID: req.user.id,
    });

    if (fields && Array.isArray(fields) && fields.length > 0) {
      const fieldData = await Promise.all(
        fields.map(async (item) => {
          const field = await FieldEdu.findByPk(item);
          if (field) {
            return {
              name: field.name,
              educationCenterID: newEducationalCenter.id,
            };
          }
        })
      );

      await FieldEdu.bulkCreate(fieldData.filter(Boolean));
    }

    if (subjects && Array.isArray(subjects) && subjects.length > 0) {
      const subjectData = subjects.map((item) => ({
        name: item.name,
        educationCenterID: newEducationalCenter.id,
      }));
      await SubjectEdu.bulkCreate(subjectData);
    }

    educationalCenterLogger.log(
      "info",
      "Educational Center created successfully!"
    );
    res.status(201).json({ data: newEducationalCenter });
  } catch (error) {
    console.error("Error creating educational center:", error);
    res.status(500).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.user;
    const body = req.body;

    const { error, value } = educationCenterValidationUpdate(body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (role !== "Admin" && role !== "Ceo") {
      res.status(403).json({
        message:
          "Not permitted. Only Ceo and Admin can update Educational Centre ❗",
      });
      educationalCenterLogger.log(
        "error",
        "Not permitted. Only Ceo and Admin can update Educational Centre ❗"
      );
      return;
    }

    const [updateCount] = await EducationalCenter.update(value, {
      where: { id },
    });

    if (!updateCount) {
      res.status(404).json({ message: "Educational Centre not found ❗" });
      educationalCenterLogger.log("error", "Educational Centre not found ❗");
      return;
    }

    const updatedCentre = await EducationalCenter.findByPk(id, {
      attributes: [
        "id",
        "name",
        "image",
        "address",
        "phone",
        "star",
        "createdAt",
        "updatedAt",
      ],
    });

    res.status(200).json({
      message: "Successfully updated ✅",
      data: updatedCentre,
    });
    educationalCenterLogger.log("info", "Educational Center update!");
  } catch (error) {
    console.error("Error updating Educational Centre:", error);
    res.status(500).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== "Admin" && role !== "Ceo") {
      res.status(403).json({
        message:
          "Not permitted. Only Ceo and Admin can delete Educational Centre ❗",
      });
      educationalCenterLogger.log(
        "error",
        "Not permitted. Only Ceo and Admin can delete Educational Centre ❗"
      );
      return;
    }

    const deleteCount = await EducationalCenter.destroy({ where: { id } });

    if (!deleteCount) {
      res.status(404).json({ message: "Educational Centre not found ❗" });
      educationalCenterLogger.log("error", "Educational Centre not found ❗");
      return;
    }

    educationalCenterLogger.log("info", "Educational Center deleted!");
    res.status(200).json({ message: "Successfully deleted ✅" });
  } catch (error) {
    console.error("Error deleting Educational Centre:", error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
