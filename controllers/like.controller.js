const Like = require("../models/like.model");
const { likeValidation } = require("../validations/like.validation");

const { Op } = require("sequelize");

const getAll = async (req, res) => {
  try {
    let { take, from, userId, sortBy, sortOrder } = req.query;

    let whereClause = {};

    if (userId) whereClause.userId = userId;

    const limit = take ? parseInt(take) : 10;
    const offset = from ? parseInt(from) : 0;

    let order = [["id", "ASC"]];
    if (sortBy) {
      const validSortOrder = sortOrder === "desc" ? "DESC" : "ASC";
      order = [[sortBy, validSortOrder]];
    }

    const data = await Like.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order,
    });

    if (!data.rows.length) {
      return res.status(404).json({ message: "No Likes found" });
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

const liked = async (req, res) => {
  try {
    const data = await Like.findAll({ where: { userId: req.userId } });
    if (!data) {
      res.send({ message: "Likes not found" });
      return;
    }
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const getOne = async (req, res) => {
  try {
    const data = await Like.findByPk(req.params.id);
    res.send(data);
  } catch (error) {
    res.send(error.mesage);
  }
};

const post = async (req, res) => {
  try {
    const data = await Like.findOne({ where: { name: req.body.name } });
    if (data) {
      res.send({ message: "Like " });
      return;
    }
    const { error } = likeValidation(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const newData = await Like.create(req.body);
    res.send(newData);
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
  remove,
  liked,
};
