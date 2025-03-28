const {
  educationalCenter,
  Region,
  User,
  Branch,
  Comment,
  Subject,
  Field,
} = require("../models/index");
const SubjectEdu = require("../models/subjectEdu.model");
const FieldEdu = require("../models/fieldEdu.model");
const {
  educationCenterValidationUpdate,
  educationCenterValidation,
} = require("../validations/educationalCenter.validation");
const winston = require("winston");
const { Op } = require("sequelize");

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
    console.log("Request Body:", req.body); 

    let { error } = educationCenterValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const ceo_id = req.user?.id;
    if (!ceo_id) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    let { name, subject_id, field_id, region_id, ...rest } = req.body;

    if (!name) {
      return res.status(400).send({ message: '"name" is required' });
    }

    let existingCenter = await Center.findOne({ where: { name } });
    if (existingCenter) {
      return res.status(400).send({
        message: "The learning center with such a name already exists!",
      });
    }

    const region = await Region.findByPk(region_id);
    if (!region) {
      return res.status(404).send({ message: "Region not found!" });
    }

    const fields = await Field.findAll({ where: { id: field_id } });
    if (fields.length !== field_id.length) {
      return res.status(404).send({ message: "Some fields_id not found!" });
    }

    const subjects = await Subject.findAll({ where: { id: subject_id } });
    if (subjects.length !== subject_id.length) {
      return res.status(404).send({ message: "Some subjects_id not found!" });
    }

    const newCenter = await Center.create({
      name,
      ...rest,
      region_id,
      ceo_id,
    });

    await newCenter.addSubjects(subjects);
    await newCenter.addFields(fields);

    const createdCenter = await Center.findByPk(newCenter.id, {
      attributes: ["id", "name", "image", "address", "phone"],
      include: [Subject, Field, Region],
    });

    res.status(201).json({
      message: "Educational Center created successfully",
      data: createdCenter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
}

async function getOne(req, res) {
  try {
    const educationalCenter = await Center.findByPk(req.params.id, {
      attributes: ["id", "name", "image", "address", "phone"],
      include: [
        Subject,
        Field,
        Region,
        { model: User, attributes: ["name", "email", "phone"] },
        { model: Branch, attributes: ["name", "location"] },
        { model: Comment, attributes: ["star", "description"] },
      ],
    });

    if (!educationalCenter) {
      return res
        .status(404)
        .json({ message: "Educational Center not found ❗" });
    }

    res.status(200).json({ data: educationalCenter });
  } catch (error) {
    console.error("Error fetching educational center", { error });
    res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const { role, id: userID } = req.user;
    const { fields, subjects, regionID, ...rest } = req.body;

    const { error } = educationCenterValidation(req.body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    if (role !== "Ceo" && role !== "Admin") {
      return res.status(403).json({
        message:
          "Not permitted. Only Ceo and Admin can create an Educational Center",
      });
    }

    if (!regionID && role !== "Admin") {
      return res.status(400).json({ message: "regionID is required" });
    }

    const regionExists = await Region.findByPk(regionID);
    if (!regionExists) {
      return res.status(404).json({ message: "Region not found" });
    }

    const existingCenter = await educationalCenter.findOne({
      where: { name: rest.name },
    });
    if (existingCenter) {
      return res.status(400).json({
        message: "The learning center with such a name already exists",
      });
    }

    const newEducationalCenter = await educationalCenter.create({
      ...rest,
      regionID,
      userID,
    });

    if (fields?.length) {
      const validFieldData = (
        await Promise.all(
          fields.map(async (fieldID) => {
            const field = await Field.findByPk(fieldID);
            return field
              ? { fieldID, educationalCenterID: newEducationalCenter.id }
              : null;
          })
        )
      ).filter(Boolean);

      if (validFieldData.length) {
        await FieldEdu.bulkCreate(validFieldData);
      }
    }

    if (subjects?.length) {
      const validSubjectData = (
        await Promise.all(
          subjects.map(async (subjectID) => {
            const subject = await Subject.findByPk(subjectID);
            return subject
              ? { subjectID, educationalCenterID: newEducationalCenter.id }
              : null;
          })
        )
      ).filter(Boolean);

      if (validSubjectData.length) {
        await SubjectEdu.bulkCreate(validSubjectData);
      }
    }

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

    const [updateCount] = await educationalCenter.update(value, {
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
    educationalCenterLogger.error("Error deleting Educational Centre", {
      error,
    });
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
