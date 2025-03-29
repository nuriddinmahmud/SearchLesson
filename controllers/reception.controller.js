const {
  Reception,
  educationalCenter,
  Branch,
} = require("../models/index.model");
const winston = require("winston");
require("winston-mongodb");

const { combine, timestamp, json } = winston.format;
const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

const receptionLogger = logger.child({ module: "Reception" });

const myCourses = async (req, res) => {
  try {
    const registrations = await Reception.findAll({
      where: { userID: req.user.id },
      include: [
        {
          model: educationalCenter,
          attributes: ["id", "name", "image"],
          as: "EducationalCenter",
        },
        {
          model: Branch,
          attributes: ["id", "name", "address"],
          as: "Branch",
        },
      ],
    });

    if (!registrations.length) {
      receptionLogger.error(`No courses found for user ${req.user.id}`);
      return res.status(404).json({
        success: false,
        message: "You haven't registered to any courses yet",
      });
    }

    receptionLogger.info(`Fetched courses for user ${req.user.id}`);
    res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    receptionLogger.error(`Error fetching courses: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your courses",
      error: error.message,
    });
  }
};

const registerToBranch = async (req, res) => {
  try {
    const { educationCenterID, branchID } = req.body;

    if (!educationCenterID || !branchID) {
      return res.status(400).json({
        success: false,
        message: "Both educationCenterID and branchID are required",
      });
    }

    const existingRegistration = await Reception.findOne({
      where: {
        userID: req.user.id,
        educationCenterID,
        branchID,
      },
    });

    if (existingRegistration) {
      receptionLogger.warn(
        `Duplicate registration attempt by user ${req.user.id}`
      );
      return res.status(409).json({
        success: false,
        message: "You're already registered to this branch",
      });
    }

    const branch = await Branch.findOne({
      where: {
        id: branchID,
        educationalCenterID: educationCenterID,
      },
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found in the specified educational center",
      });
    }

    const newRegistration = await Reception.create({
      userID: req.user.id,
      educationCenterID,
      branchID,
      status: "Pending",
    });

    receptionLogger.info(
      `User ${req.user.id} registered to branch ${branchID}`
    );
    res.status(201).json({
      success: true,
      message: "Successfully registered to branch",
      data: newRegistration,
    });
  } catch (error) {
    receptionLogger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to process registration",
      error: error.message,
    });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const registration = await Reception.findOne({
      where: {
        id: req.params.id,
        userID: req.user.id,
      },
    });

    if (!registration) {
      receptionLogger.warn(`Registration not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: "Registration not found or you don't have permission",
      });
    }

    await registration.destroy();
    receptionLogger.info(`Registration canceled: ${req.params.id}`);
    res.status(200).json({
      success: true,
      message: "Registration canceled successfully",
    });
  } catch (error) {
    receptionLogger.error(`Cancelation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to cancel registration",
      error: error.message,
    });
  }
};

module.exports = {
  myCourses,
  registerToBranch,
  cancelRegistration,
};
