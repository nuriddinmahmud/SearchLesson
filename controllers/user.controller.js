const User = require("../models/user.model");
const Session = require("../models/session.model");
const {
  userValidation,
  userValidationUpdate,
} = require("../validations/user.validation");
const nodemailer = require("nodemailer");
const { totp } = require("otplib");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

dotenv.config();

const TOTP_KEY = process.env.SECRET_KEY;
const ACCESS_KEY = process.env.ACCESS_KEY || "accessKey";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

totp.options = { step: 1800, digits: 6 };

const deleteOldImage = (imgPath) => {
  if (imgPath) {
    const fullPath = path.join("uploads", imgPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

async function register(req, res) {
  try {
    const { body } = req;

    const existingUser = await User.findOne({ where: { email: body.email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "This account already exists ❗" });
    }

    const { error, value } = userValidation(body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    value.password = await bcrypt.hash(value.password, 10);
    const newUser = await User.create(value);

    const otp = totp.generate(`${TOTP_KEY}${value.email}`);

    await transporter.sendMail({
      to: value.email,
      subject: "Account Activation OTP",
      html: `
        <h2>Activate your account</h2>
        <p>This is your one-time password:</p>
        <h1>${otp}</h1>
        <p><b>Note:</b> OTP is valid for 30 minutes.</p>
      `,
    });

    res.status(201).json({
      message: "Registered successfully ✅. OTP sent to your email.",
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        status: newUser.status,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Registration failed ❌", error: error.message });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email is incorrect ❗" });
    }

    const isOtpValid = totp.verify({
      token: otp,
      secret: `${TOTP_KEY}${email}`,
    });

    if (!isOtpValid) {
      return res.status(403).json({ message: "OTP is incorrect ❗" });
    }

    if (user.status === "Inactive") {
      await User.update({ status: "Active" }, { where: { email } });
    }

    res
      .status(200)
      .json({ message: "Your account has been activated successfully ✅" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error_message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, userName, password } = req.body;

    const user = await User.findOne({
      where: email ? { email } : { userName },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found ❗" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password ❗" });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        message: "Account not activated ❗ Please check your email for OTP.",
      });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ACCESS_KEY,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      REFRESH_KEY,
      { expiresIn: "7d" }
    );

    await Session.create({
      userId: user.id,
      ipAddress: req.ip,
      deviceInfo: req.headers["user-agent"],
    });

    res.status(200).json({
      message: "Logged in successfully ✅",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error_message: error.message });
  }
}

async function promoteToAdmin(req, res) {
  try {
    const { id } = req.params;

    const updated = await User.update({ role: "Admin" }, { where: { id } });

    if (!updated[0]) {
      return res.status(404).json({ message: "User not found ❗" });
    }

    res.status(200).json({ message: "User promoted to Admin successfully ✅" });
  } catch (error) {
    console.error("Promote error:", error);
    res.status(500).json({ error_message: error.message });
  }
}

async function findAll(req, res) {
  try {
    let { role, id } = req.user;
    role = Array.isArray(role) ? role : [role];

    const userAttributes = [
      "id",
      "fullName",
      "email",
      "role",
      "avatar",
      "status",
      "createdAt",
      "updatedAt",
      "phone",
      "location",
      "regionID",
    ];

    if (role.includes("Admin")) {
      const users = await User.findAll({ attributes: userAttributes });
      return res.status(200).json({ data: users });
    }

    if (role.includes("SuperAdmin")) {
      return res.status(403).json({
        message: "SuperAdmin can only update users, not view all ❗",
      });
    }

    if (role.includes("User")) {
      const user = await User.findByPk(id, { attributes: userAttributes });

      if (!user) {
        return res.status(404).json({ message: "User not found ❗" });
      }

      return res.status(200).json({ data: user });
    }

    res.status(403).json({ message: "Unauthorized user type ❗" });
  } catch (error) {
    console.error("findAll error:", error);
    res.status(500).json({ error_message: error.message });
  }
}

async function findOne(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
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
        "location",
        "regionID",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found ❗" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error("Find one user error:", error);
    res.status(500).json({ error_message: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;

    const { error, value } = userValidationUpdate(req.body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    if (value.password) {
      value.password = await bcrypt.hash(value.password, 10);
    }

    if (req.user.role !== "SuperAdmin") {
      return res
        .status(403)
        .json({ message: "Only SuperAdmin can update users ❗" });
    }

    const updatedUser = await User.update(value, { where: { id } });
    if (!updatedUser[0]) {
      return res.status(404).json({ message: "User not found ❗️" });
    }

    const result = await User.findByPk(id, {
      attributes: [
        "id",
        "fullName",
        "email",
        "phone",
        "role",
        "avatar",
        "status",
        "createdAt",
        "updatedAt",
        "location",
        "regionID",
      ],
    });

    res
      .status(200)
      .json({ message: "User updated successfully ✅", data: result });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error_message: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found ❗" });
    }

    const deletedUser = await User.destroy({
      where: {
        id,
        role: { [Op.in]: ["User"] },
      },
    });

    if (!deletedUser) {
      return res.status(403).json({ message: "Only users can be deleted ❗" });
    }

    res.status(200).json({ message: "User deleted successfully ✅" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error_message: error.message });
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
  deleteOldImage,
};
