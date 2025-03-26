const Branch = require("../models/branch.model");
const EducationCenter = require("../models/educationalCenter.model");
const Region = require("../models/region.model");
const User = require("../models/user.model");
const {
  educationCenterValidationUpdate,
  educationCenterValidation,
} = require("../validations/educationalCenter.validation");

async function getPaginatedEducationalCentres(req, res) {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const educationCenter = await EducationCenter.findAll({
      offset,
      limit,
      attributes: [
        "id", "name", "image", "address", "phone", "star",
        "createdAt", "updatedAt",
      ],
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "email", "phone", "role", "avatar", "status"],
        },
        {
          model: Region,
          attributes: ["id", "name", "createdAt", "updatedAt"],
        },
        {
          model: Branch,
          attributes: ["id", "name", "image", "regionID", "centreID", "phone", "address"],
        },
      ],
    });

    res.status(200).json({ data: educationCenter });
  } catch (error) {
    console.error("Error fetching paginated education centers:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getAll(req, res) {
  try {
    const educationCenter = await EducationCenter.findAll({
      attributes: [
        "id", "name", "image", "address", "phone", "star",
        "createdAt", "updatedAt",
      ],
      include: [
        {
          model: User,
          attributes: [
            "id", "fullName", "email", "phone", "role", "avatar", "status",
            "createdAt", "updatedAt"
          ],
        },
        {
          model: Region,
          attributes: ["id", "name", "createdAt", "updatedAt"],
        },
        {
          model: Branch,
          attributes: [
            "id", "name", "image", "regionID", "centreID",
            "phone", "address", "createdAt", "updatedAt"
          ],
        },
      ],
    });

    if (!educationCenter.length) {
      return res.status(200).json({ msg: "Empty" });
    }

    res.status(200).json({ data: educationCenter });
  } catch (error) {
    console.error("Error fetching all education centers:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getOne(req, res) {
  try {
    const { id } = req.params;

    const educationalCenter = await EducationCenter.findByPk(id, {
      attributes: [
        "id", "name", "image", "address", "phone", "star",
        "createdAt", "updatedAt"
      ],
      include: [
        {
          model: User,
          attributes: [
            "id", "fullName", "email", "phone", "role", "avatar",
            "status", "createdAt", "updatedAt"
          ],
        },
        {
          model: Region,
          attributes: ["id", "name", "createdAt", "updatedAt"],
        },
        {
          model: Branch,
          attributes: [
            "id", "name", "image", "regionID", "centreID",
            "phone", "address", "createdAt", "updatedAt"
          ],
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
        message: "Not permitted. Only Ceo and Admin can create an Educational Center ❗",
      });
    }

    if (!value.regionID) {
      return res.status(400).json({ message: "regionID is required ❗" });
    }

    const regionExists = await Region.findOne({ where: { id: value.regionID } });
    if (!regionExists) {
      return res.status(404).json({ message: "Region not found ❗" });
    }

    const newEducationalCenter = await EducationCenter.create({
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
        message: "Not permitted. Only Ceo and Admin can update Educational Centre ❗",
      });
    }

    const [updateCount] = await EducationCenter.update(value, { where: { id } });

    if (!updateCount) {
      return res.status(404).json({ message: "Educational Centre not found ❗" });
    }

    const updatedCentre = await EducationCenter.findByPk(id, {
      attributes: [
        "id", "name", "image", "address", "phone", "star",
        "createdAt", "updatedAt"
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
        message: "Not permitted. Only Ceo and Admin can delete Educational Centre ❗",
      });
    }

    const deleteCount = await EducationCenter.destroy({ where: { id } });

    if (!deleteCount) {
      return res.status(404).json({ message: "Educational Centre not found ❗" });
    }

    res.status(200).json({ message: "Successfully deleted ✅" });
  } catch (error) {
    console.error("Error deleting Educational Centre:", error);
    res.status(500).json({ message: error.message });
  }
}

async function getBySearch(req, res) {
  try {
    const query = req.query;
    const newQuery = {};

    Object.entries(query).forEach(([key, val]) => {
      if (val) newQuery[key] = val;
    });

    const educationCenter = await EducationCenter.findAll({
      where: newQuery,
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "email", "phone", "role", "avatar", "status"],
        },
        {
          model: Region,
          attributes: ["id", "name", "createdAt", "updatedAt"],
        },
      ],
    });

    if (!educationCenter.length) {
      return res.status(404).json({ message: "No matching educational centers found ❗" });
    }

    res.status(200).json({ data: educationCenter });
  } catch (error) {
    console.error("Error in getBySearch:", error);
    res.status(500).json({ message: error.message });
  }
}

async function sortByName(req, res) {
  try {
    let { name = "asc" } = req.query;
    const sortOrder = ["asc", "desc"].includes(name.toLowerCase()) ? name.toLowerCase() : "asc";

    const educationCenter = await EducationCenter.findAll({
      order: [["name", sortOrder]],
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "email", "phone", "role", "avatar", "status"],
        },
        {
          model: Region,
          attributes: ["id", "name", "createdAt", "updatedAt"],
        },
      ],
    });

    res.status(200).json({ data: educationCenter });
  } catch (error) {
    console.error("Error in sortByName:", error);
    res.status(500).json({ message: error.message });
  }
}

async function sortByAddress(req, res) {
  try {
    let { address = "asc" } = req.query;
    const sortOrder = ["asc", "desc"].includes(address.toLowerCase()) ? address.toLowerCase() : "asc";

    const educationCenter = await EducationCenter.findAll({
      order: [["address", sortOrder]],
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "email", "phone", "role", "avatar", "status"],
        },
        {
          model: Region,
          attributes: ["id", "name", "createdAt", "updatedAt"],
        },
      ],
    });

    res.status(200).json({ data: educationCenter });
  } catch (error) {
    console.error("Error in sortByAddress:", error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAll,
  getBySearch,
  getOne,
  getPaginatedEducationalCentres,
  sortByAddress,
  sortByName,
  create,
  update,
  remove,
};
