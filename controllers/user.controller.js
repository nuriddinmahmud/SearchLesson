const User = require("../models/user.model.js");
const Regions = require("../models/region.model.js");
const EducationalCenter = require("../models/educationalCenter.model.js");
const {
  userValidation,
  userValidationUpdate,
  userValidationAdmin,
} = require("../validations/user.validation.js");
const nodemailer = require("nodemailer");
const { totp } = require("otplib");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const sendSms = require("../config/eskiz.js");
const Session = require("../models/session.model.js");
let winston = require("winston");
require("winston-mongodb");

let { json, combine, timestamp } = winston.format;
const logger = winston.createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "loggers.log" })],
});

let authLogger = logger.child({ module: "Authorization" });

dotenv.config();
const TOTP_KEY = process.env.SECRET_KEY;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

totp.options = { step: 1800, digits: 6 };

async function register(req, res) {
  try {
    const body = req.body;
    if (2025 - body.yearOfBirth < 18) {
      return res
        .status(406)
        .send({ message: "You should be older than or equal 18  to register" });
    }
    let findUser = await User.findOne({ where: { email: body.email } });
    if (findUser) {
      res.status(405).send({ message: "This account already exists ❗" });
      authLogger.log("error", "This account already exists ❗");
    }

    if (req.body.role == "Admin") {
      const { error, value } = userValidationAdmin(body);
    }
    const { error, value } = userValidation(body);
    if (error) {
      return res.status(422).send({ message: error.details[0].message });
    }

    value.password = await bcrypt.hash(body.password, 10);
    const registered = await User.create(value);

    let otp = totp.generate(`${TOTP_KEY}${body.email}`);
    await transporter.sendMail({
      to: body.email,
      subject: "One-time password",
      html: `This is an OTP to activate your account: <h1>${otp}</h1> ❗`,
    });

    res.status(200).send({
      message:
        "Registered successfully ✅. We sent OTP to your email for activation ❗",
      data: registered,
    });
  } catch (error) {
    return res.status(400).send({ error_message: error.message });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const findUser = await User.findOne({ where: { email } });
    if (!findUser) {
      res.status(405).send({ message: "Email is incorrect ❗" });
      authLogger.log("error", "Email is incorrect ❗");
      return;
    }

    let checkOtp = totp.verify({ token: otp, secret: `${TOTP_KEY}${email}` });
    if (!checkOtp) {
      res.status(403).send({ message: "OTP is incorrect ❗" });
      authLogger.log("error", "OTP is incorrect ❗");
      return;
    }

    if (findUser.status === "Inactive") {
      await User.update({ status: "Active" }, { where: { email } });
    }

    res
      .status(200)
      .send({ message: "Your account has been activated successfully ✅" });
    authLogger.log("info", "Your account has been activated successfully ✅");
  } catch (error) {
    return res.status(400).send({ error_message: error.message });
  }
}

async function login(req, res) {
  let { password, email } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).send("User not found❗");
      authLogger.log("error", "User not found❗");
      return;
    }
    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).send("Invalid password ❗");
      authLogger.log("error", "Invalid password ❗");
      return;
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      "access_secret",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      "refresh_secret",
      { expiresIn: "7d" }
    );

    await Session.create({
      userID: user.id,
      ipAddress: req.ip,
      deviceInfo: req.headers["user-agent"],
    });

    res.send({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).send("Internal Server Error ❗");
  }
}

async function myEducationalCenters(req, res) {
  try {
    let { role, id } = req.user;
    if (!role.includes(["Ceo"])) {
      res.status(403).send({ message: "Unauthorization User type ❗" });
      authLogger.log("error", "Unauthorization User type ❗");
      return;
    }

    const allCentres = await EducationalCenter.findAll({
      where: { userID: id },
      attributes: [
        "id",
        "name",
        "image",
        "address",
        "phone",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: User,
          attribute: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "role",
            "status",
            "createdAt",
            "updatedAt",
          ],
        },
        {
          model: { Regions },
          attributes: ["id", "name", "createdAt", "updatedAt"],
        },
      ],
    });
    if (!allCentres.length) {
      res.status(200).send({
        message:
          "You have not created any Educational Centers yet 🫱🏿‍🫲🏻(my nig*a)",
      });
      authLogger.log(
        "error",
        "You have not created any Educational Centers yet 🫱🏿‍🫲🏻(my nig*a)"
      );
    }
    res.status(200).send({ data: allCentres });
  } catch (error) {
    return res.status(400).send({ error_message: error.message });
  }
}

async function accessTokenGenereate(payload) {
  try {
    let accessSecret = process.env.ACCESS_KEY || "accessKey";
    return jwt.sign(payload, accessSecret, { expiresIn: "15m" });
  } catch (error) {
    return console.log(error.message);
  }
}

async function refreshTokenGenereate(payload) {
  try {
    let accessSecret = process.env.REFRESH_KEY || "refreshKey";
    return jwt.sign(payload, accessSecret, { expiresIn: "7d" });
  } catch (error) {
    return console.log(error.message);
  }
}

async function promoteToAdmin(req, res) {
  try {
    const role = "Admin";
    let { id } = req.params;
    await User.update({ role }, { where: { id } });
    res.status(200).send({ message: "Updated successfully ✅" });
    authLogger.log("info", "Updated successfully ✅");
  } catch (error) {
    return res.status(400).send({ error_message: error.message });
  }
}

async function getNewAccessToken(req, res) {
  try {
    const refreshToken = req.body.refresh_token;
    let data = jwt.verify(
      refreshToken,
      process.env.REFRESH_KEY || "refreshKey"
    );
    const user = await User.findByPk(data.id);
    if (!user) {
      res.status(404).send({ message: "User not found ❗" });
      authLogger.log("error", "User not found ❗");
      return;
    }
    let accessToken = await accessTokenGenereate({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    res.status(200).send({
      message: "New access token generated successfully ✅",
      access_token: accessToken,
    });
    authLogger.log("info", "New access token generated successfully ✅");
  } catch (error) {
    return res.status(400).send({ error_message: error.message });
  }
}

async function sendOtpPhone(req, res) {
  try {
    const user = await User.findOne({ where: { phone: req.body.phone } });
    if (!user) {
      res.status(404).send({ message: "User not found ❗" });
      authLogger.log("error", "User not found ❗");
      return;
    }
    const token = await sendSms(req.body.phone);
    res.status(200).send({ message: "OTP sent successfully ✅", otp: token });
    authLogger.log("info", "OTP sent successfully ✅");
  } catch (error) {
    return res.status(400).send({ error_message: error.message });
  }
}

async function verifyOtpPhone(req, res) {
  try {
    const user = await User.findOne({ where: { phone: req.body.phone } });
    if (!user) {
      res.status(404).send({ message: "User not found❗" });
      authLogger.log("error", "User not found ❗");
      return;
    }
    const match = totp.verify({
      token: req.body.otp,
      secret: req.body.phone + process.env.ESKIZ_KEY || "eskizSecret",
    });
    if (!match) {
      res.status(403).send({ message: "OTP is incorrect ❗" });
      authLogger.log("error", "OTP is incorrect ❗");
      return;
    }
    if (user.status === "Inactive") {
      await user.update({ status: "Active" });
      res.status(200).send({ message: "Account activated successfully ✅" });
      authLogger.log("info", "Account activated successfully ✅");
      return;
    }
    res.status(200).send({ message: "Account activated successfully ✅" });
    authLogger.log("info", "Account activated successfully ✅");
  } catch (error) {
    return res.status(400).send({ error_message: error.message });
  }
}

async function findAll(req, res) {
  try {
    console.log();
    
    if (req.user.role !== "Admin") {
      res.status(403).send({ message: "You are not allowed ❗" });
      authLogger.log("error", "You are not allowed ❗");
      return;
    }

    let {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "DESC",
      status,
      role,
      search,
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    let offset = (page - 1) * limit;

    let where = {};

    if (status) where.status = status;
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    let users = await User.findAndCountAll({
      where,
      attributes: [
        "id",
        "fullName",
        "email",
        "role",
        "avatar",
        "status",
        "phone",
      ],
      order: [[sort, order.toUpperCase()]],
      limit,
      offset,
    });

    return res.status(200).send({
      total: users.count,
      page,
      totalPages: Math.ceil(users.count / limit),
      data: users.rows,
    });
  } catch (error) {
    return res.status(500).send({ error_message: error.message });
  }
}

async function findOne(req, res) {
  try {
    const { id } = req.params;
    let user = await User.findByPk(id, {
      attributes: [
        "id",
        "fullName",
        "yearOfBirth",
        "email",
        "role",
        "avatar",
        "status",
        "phone",
      ],
    });
    console.log("User:", user);
    if (!user) {
      res.status(404).send({ message: "User not found ❗" });
      authLogger.log("error", "User not found ❗");
      return;
    }
    res.status(200).send({ data: user });
  } catch (error) {
    return res.status(400).send({ error_message: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { error, value } = userValidationUpdate(req.body);
    if (error)
      return res.status(422).send({ message: error.details[0].message });
    if (value.password) value.password = await bcrypt.hash(value.password, 10);

    if (!["SuperAdmin", "Admin"].includes(req.user.role)) {
      res.status(403).send({ message: "Only SuperAdmin can update User ❗️" });
      authLogger.log("error", "User not found ❗");
      return;
    }
    let findUser = await User.findByPk(id);
    if (!findUser) {
      res.status(403).send({ message: "User not found ❗" });
      authLogger.log("error", "User not found ❗");
      return;
    }
    await findUser.update(req.body);
    res
      .status(200)
      .send({ message: "User updated successfully ✅", data: findUser });
    authLogger.log("info", "User updated successfully ✅");
  } catch (error) {
    return res.status(400).send({ error_message: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    let findUser = await User.findByPk(id);
    if (!findUser) {
      res.status(404).send({ message: "User not found ❗️" });
      authLogger.log("error", "User not found ❗");
      return;
    }

    if (findUser.role == "Admin") {
      res.status(403).send({ message: "Nobody can destroy admin ❗️" });
      authLogger.log("error", "User not found ❗");
      return;
    }
    let deletedUser = await User.destroy({
      where: { id, role: { [Op.in]: ["User"] } },
    });
    await findUser.destroy();
    if (!deletedUser) {
      res.status(403).send({ message: "Only User can be deleted ❗️" });
      authLogger.log("error", "User not found ❗");
      return;
    }
  } catch (e) {
    return res.status(400).send({ error_message: e.message });
  }
}

module.exports = {
  register,
  verifyOtp,
  login,
  findOne,
  findAll,
  update,
  remove,
  promoteToAdmin,
  getNewAccessToken,
  sendOtpPhone,
  verifyOtpPhone,
  refreshTokenGenereate,
  myEducationalCenters,
};
