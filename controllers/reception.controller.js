const Reception = require("../models/reception.model");
const {
  receptionValidation,
  receptionUpdateValidation,
} = require("../validations/reception.validation");

const { Op } = require("sequelize");

const getAll = async (req, res) => {
  try {
    let { take, from, fieldId, userId, branchId, sortBy, sortOrder } =
      req.query;

    let whereClause = {};

    if (fieldId) whereClause.fieldId = fieldId;
    if (userId) whereClause.userId = userId;
    if (branchId) whereClause.branchId = branchId;

    const limit = take ? parseInt(take) : 10;
    const offset = from ? parseInt(from) : 0;

    let order = [["id", "ASC"]];
    if (sortBy) {
      const validSortOrder = sortOrder === "desc" ? "DESC" : "ASC";
      order = [[sortBy, validSortOrder]];
    }

    const data = await Reception.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order,
    });

    if (!data.rows.length) {
      return res.status(404).json({ message: "Receptions not found" });
    }

    res.status(200).json({
      total: data.count,
      pageSize: limit,
      from: offset,
      data: data.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const myCourses = async (req, res) => {
  try {
    const data = await Reception.findAll({ where: { userId: req.userID } });
    if (!data) {
      res.status(404).send({ message: "Courses not found" });
      return;
    }
    res.send(data);
  } catch (error) {
    res.status(400).send(error.mesage);
  }
};

const getOne = async (req, res) => {
  try {
    const data = await Reception.findByPk(req.params.id);
    if (!data) {
      res.status(404).send({ message: "Course not found" });
      return;
    }
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const post = async (req, res) => {
  try {
    const data = await Reception.findOne({
      where: {
        userId: req.userID,
        educationCenterId: req.body.educationCenterId,
      },
    });
    if (data) {
      res.send({ message: "You have already registered to this course" });
      return;
    }
    const { error } = receptionValidation(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const newData = await Reception.create(req.body);
    res.send({ message: "You have registered to course succesfully", newData });
  } catch (error) {
    res.status(400).send(error.mesage);
  }
};

const update = async (req, res) => {
  try {
    const data = await Reception.findByPk(req.params.id);
    if (!data) {
      res.status(404).send({ message: "Course not found" });
      return;
    }
    const { error } = receptionUpdateValidation(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    await data.update(req.body);
    res.send(data);
  } catch (error) {
    res.status(400).send(error.mesage);
  }
};

const remove = async (req, res) => {
  try {
    const data = await Reception.findByPk(req.params.id);
    if (!data) {
      res.status(404).send({ message: "Course not found" });
      return;
    }
    await data.destroy();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.mesage);
  }
};

module.exports = {
  getAll,
  getOne,
  post,
  update,
  remove,
  myCourses,
};
