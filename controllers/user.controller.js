const User = require("../models/user.model.js");
const Regions = require("../models/region.model.js");
const {
  userValidation,
  userValidationUpdate,
} = require("../validations/user.validation.js");
const nodemailer = require("nodemailer");
const { totp } = require("otplib");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const sendSms = require("../config/eskiz.js");
const Session = require("../models/session.model.js");

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

    let findUser = await User.findOne({ where: { email: body.email } });
    if (findUser) {
      return res
        .status(405)
        .send({ message: "This account already exists ❗" });
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
      html: `This is an OTP to activate your account: <h1>${otp}</h1>`,
    });

    res.status(200).send({
      message:
        "Registered successfully ✅. We sent OTP to your email for activation",
      data: registered,
    });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const findUser = await User.findOne({ where: { email } });
    if (!findUser) {
      return res.status(405).send({ message: "Email is incorrect ❗" });
    }

    let checkOtp = totp.verify({ token: otp, secret: `${TOTP_KEY}${email}` });
    if (!checkOtp) {
      return res.status(403).send({ message: "OTP is incorrect ❗" });
    }

    if (findUser.status === "Inactive") {
      await User.update({ status: "Active" }, { where: { email } });
    }

    res
      .status(200)
      .send({ message: "Your account has been activated successfully" });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function login(req, res) {
  let { password, email } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send("User not found!");
    }
    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Invalid password!");
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
      userId: user.id,
      ipAddress: req.ip,
      deviceInfo: req.headers["user-agent"],
    });

    res.send({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function accessTokenGenereate(payload) {
  try {
    let accessSecret = process.env.ACCESS_KEY || "accessKey";
    return jwt.sign(payload, accessSecret, { expiresIn: "15m" });
  } catch (error) {
    console.log(error.message);
  }
}

async function refreshTokenGenereate(payload) {
  try {
    let accessSecret = process.env.REFRESH_KEY || "refreshKey";
    return jwt.sign(payload, accessSecret, { expiresIn: "7d" });
  } catch (error) {
    console.log(error.message);
  }
}

async function promoteToAdmin(req, res) {
  try {
    const role = "Admin";
    let { id } = req.params;
    await User.update({ role }, { where: { id } });
    res.status(200).send({ message: "Updated successfully" });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function getNewAccessToken(req, res) {
  try {
    const refreshToken = req.header("Authorization")?.split(" ")[1];

    let data = await jwt.verify(
      refreshToken,
      process.env.REFRESH_KEY || "refreshKey"
    );
    const user = await User.findByPk(data.id);
    if (!user) {
      return res.status(404).send({ message: "User not found ❗" });
    }
    let accessToken = await accessTokenGenereate({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    res.status(200).send({
      message: "New access token generated successfully",
      access_token: accessToken,
    });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function sendOtpPhone(req, res) {
  try {
    const user = await User.findOne({ where: { phone: req.body.phone } });
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    const token = await sendSms(req.body.phone);
    res.status(200).send({ message: "OTP sent successfully", otp: token });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function verifyOtpPhone(req, res) {
  try {
    const user = await User.findOne({ where: { phone: req.body.phone } });
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    const match = totp.verify({
      token: req.body.otp,
      secret: req.body.phone + process.env.ESKIZ_KEY || "eskizSecret",
    });
    if (!match) {
      res.status(403).send({ message: "OTP is incorrect" });
      return;
    }
    if (user.status === "Inactive") {
      await user.update({ status: "Active" });
      res.status(200).send({ message: "Account activated successfully" });
      return;
    }
    res.status(200).send({ message: "Account activated successfully" });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function findAll(req, res) {
  try {
    if (["Admin"].includes(req.userRole)) {
      let findAllUser = await User.findAll({
        attributes: [
          "id",
          "fullName",
          "email",
          "role",
          "avatar",
          "status",
          "createdAt",
          "updatedAt",
          "phone",
          "regionID",
        ],
        include: [
          {
            model: Regions,
            as: "Region",
            attributes: ["id", "name"],
          },
        ],
      });
      return res.status(200).send({ data: findAllUser });
    }

    if (role.includes("SuperAdmin")) {
      return res
        .status(403)
        .send({ message: "SuperAdmin can only update User, not view all ❗" });
    }

    if (role.includes("User")) {
      let findUser = await User.findByPk(req.user.id, {
        attributes: [
          "id",
          "fullName",
          "yearOfBirth",
          "email",
          "role",
          "avatar",
          "status",
          "createdAt",
          "updatedAt",
          "phone",
          "regionID",
        ],
        include: [
          {
            model: Regions,
            as: "Region",
            attributes: ["id", "name"],
          },
        ],
      });
      if (!findUser) {
        return res.status(404).send({ message: "User not found ❗" });
      }
      return res.status(200).send({ data: findUser });
    }

    res.status(403).send({ message: "Unauthorized user type ❗" });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
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
        "createdAt",
        "updatedAt",
        "phone",
        "regionID",
      ],
      include: [
        {
          model: Regions,
          as: "Region",
          attributes: ["id", "name"],
        },
      ],
    });
    if (!user) return res.status(404).send({ message: "User not found ❗" });
    res.status(200).send({ data: user });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
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
      return res
        .status(403)
        .send({ message: "Only SuperAdmin can update User ❗️" });
    }
    let findUser = await User.findByPk(id);
    if (!findUser) {
      return res.status(403).send({ message: "User not found" });
    }
    await findUser.update(req.body);
    res
      .status(200)
      .send({ message: "User updated successfully", data: findUser });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    let findUser = await User.findByPk(id);
    if (!findUser)
      return res.status(404).send({ message: "User not found ❗️" });
    if (findUser.role == "Admin") {
      return res.status(403).send({ message: "Nobody can destroy admin ❗️" });
    }
    let deletedUser = await User.destroy({
      where: { id, role: { [Op.in]: ["User"] } },
    });
    await findUser.destroy();
    if (!deletedUser)
      return res.status(403).send({ message: "Only User can be deleted ❗️" });
  } catch (e) {
    res.status(400).send({ error_message: e.message });
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
};
