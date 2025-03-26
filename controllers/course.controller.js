const Course = require("../models/course.model");
const {
  courseValidation,
  courseUpdateValidation,
} = require("../validations/course.validation");
const { Op } = require("sequelize");

const getAll = async (req, res) => {
  try {
    let { take, from, name, type, sortBy, sortOrder } = req.query;

    let whereClause = {};

    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (type) whereClause.type = type;

    const limit = take ? parseInt(take) : 10;
    const offset = from ? parseInt(from) : 0;

    let order = [["id", "ASC"]];
    if (sortBy) {
      const validSortOrder = sortOrder === "desc" ? "DESC" : "ASC";
      order = [[sortBy, validSortOrder]];
    }

    const data = await Course.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order,
    });

    if (!data.rows.length) {
      return res.status(404).json({ message: "No courses found" });
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

const getOne = async (req, res) => {
  try {
    const data = await Course.findByPk(req.params.id);
    if (!data) {
      return res.status(404).send("Cource not found!");
    }
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const post = async (req, res) => {
  try {
    const data = await Course.findOne({ where: { name: req.body.name } });
    if (!data) {
      res.send({ message: "Course already exists" });
      return;
    }
    const { error } = courseValidation(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const newData = await Course.create(req.body);
    res.send(newData);
  } catch (error) {
    res.send(error.mesage);
  }
};

const update = async (req, res) => {
  try {
    const data = await Course.findByPk(req.params.id);
    if (!data) {
      res.send({ message: "Course not found!" });
      return;
    }
    const { error } = courseUpdateValidation(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    await data.update(req.body);
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const remove = async (req, res) => {
  try {
    const data = await Course.findByPk(req.params.id);
    if (!data) {
      res.send({ message: "Course not found" });
      return;
    }
    await data.destroy();
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

module.exports = {
  getAll,
  getOne,
  post,
  update,
  remove,
};
