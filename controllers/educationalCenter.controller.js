const Branch = require("../models/branch.model");
const EducationalCenter = require("../models/educationalCenter.model");
const Region = require("../models/region.model");
const User = require("../models/user.model");
const {
  educationCenterValidationUpdate,
  educationCenterValidation,
} = require("../validations/educationalCenter.validation");

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
        {
          model: User,
        },
        {
          model: Region,
        },
        {
          model: Branch,
        },
      ],
      order: orderCondition,
      limit: pageSize,
      offset: offset,
    });

    if (!educationCenters.rows.length) {
      return res.status(200).json({ msg: "Empty ❗" });
    }

    res.status(200).json({
      total: educationCenters.count,
      page: pageNumber,
      limit: pageSize,
      data: educationCenters.rows,
    });
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
        {
          model: User,
        },
        {
          model: Region,
        },
        {
          model: Branch,
        },
      ],
    });

    if (!educationalCenter) {
      return res.status(404).json({ msg: "EducationCenter not found ❗" });
    }

    res.status(200).json({ data: educationalCenter });
  } catch (error) {
    console.error("Error fetching education center by ID:", error);
    res.status(500).json({ error: error.message });
  }
}

async function create(req, res) {
  try {
    const body = req.body;
    const { role, id: userID } = req.user;

    const { error, value } = educationCenterValidation(body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    if (role !== "Ceo" && role !== "Admin") {
      return res.status(403).json({
        message:
          "Not permitted. Only Ceo and Admin can create an Educational Center ❗",
      });
    }

    if (!value.regionID) {
      return res.status(400).json({ message: "regionID is required ❗" });
    }

    const regionExists = await Region.findOne({
      where: { id: value.regionID },
    });
    if (!regionExists) {
      return res.status(404).json({ message: "Region not found ❗" });
    }

    const newEducationalCenter = await EducationalCenter.create({
      ...value,
      userID,
    });

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
      return res.status(403).json({
        message:
          "Not permitted. Only Ceo and Admin can update Educational Centre ❗",
      });
    }

    const [updateCount] = await EducationalCenter.update(value, {
      where: { id },
    });

    if (!updateCount) {
      return res
        .status(404)
        .json({ message: "Educational Centre not found ❗" });
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
      return res.status(403).json({
        message:
          "Not permitted. Only Ceo and Admin can delete Educational Centre ❗",
      });
    }

    const deleteCount = await EducationalCenter.destroy({ where: { id } });

    if (!deleteCount) {
      return res
        .status(404)
        .json({ message: "Educational Centre not found ❗" });
    }

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
