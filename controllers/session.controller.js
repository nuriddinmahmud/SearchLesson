const { Session } = require("../models/index.model");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;

const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let sessionLogger = logger.child({ module: "Session" });

const getAll = async (req, res) => {
  try {
    const session = await Session.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    if (!session) {
      return res.status(404).send("Session not found!");
    }
    res.send(session);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const remove = async (req, res) => {
  try {
    const session = await Session.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    if (!session) {
      return res.status(404).send("Session not found!");
    }
    await session.destroy();
    res.send("Session deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getAll, remove };
