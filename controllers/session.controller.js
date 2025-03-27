const Session = require("../models/session.model");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let sessionLogger = logger.child({ module: "Authorization" });

const getAll = async (req, res) => {
  try {
    console.log("User data:", req.user);

    if (!req.user || !req.user.id) {
      res
        .status(401)
        .json({ message: "Unauthorized! User not found in token!" });
      sessionLogger.log("error", "Unauthorized! User not found in token!");
    }

    const session = await Session.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    if (!session) {
      res.status(404).json({ message: "Session not found!" });
      sessionLogger.log("error", "Session not found!");
      return;
    }

    res.status(200).json(session);
    sessionLogger.log("info", "Session created successfully!");
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const remove = async (req, res) => {
  try {
    const session = await Session.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    if (!session) {
      res.status(404).json({ message: "Session not found!" });
      sessionLogger.log("error", "Session not found!");
      return;
    }

    await session.destroy();
    res.status(200).json({ message: "Session deleted successfully!" });
    sessionLogger.log("info", "Session deleted successfully!");
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAll, remove };
