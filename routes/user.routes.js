const express = require("express");
const {
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
  myEducationalCenters,
} = require("../controllers/user.controller.js");
const verifyToken = require("../middlewares/verifyToken.js");
const selfPolice = require("../middlewares/selfPolice.js");
const checkRole = require("../middlewares/rolePolice.js");

const UsersRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: 👥 Users
 *   description: 🌟 API for managing users
 */
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: 📝 Register a new user
 *     tags: [👥 Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: 🏷️ The full name of the user
 *               yearOfBirth:
 *                 type: integer
 *                 description: 🎂 The year of birth of the user
 *               email:
 *                 type: string
 *                 description: 📧 The email of the user
 *               password:
 *                 type: string
 *                 description: 🔑 The password of the user
 *               phone:
 *                 type: string
 *                 description: 📱 The phone number of the user
 *               role:
 *                 type: string
 *                 enum: [Admin, User, Seller, SuperAdmin]
 *                 description: 🎭 The role of the user (default is "User")
 *               avatar:
 *                 type: string
 *                 description: 🖼️ The avatar URL of the user
 *               regionID:
 *                 type: integer
 *                 description: 🌍 The ID of the region the user belongs to
 *     responses:
 *       200:
 *         description: 🎉 User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: ❌ Bad request. Validation error
 *       405:
 *         description: ⚠️ Account already exists
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.post("/register", register);

/**
 * @swagger
 * /api/user/send-otp-to-phone:
 *   post:
 *     summary: 📲 Send OTP to user's phone
 *     tags: [👥 Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: 📱 The phone number of the user
 *     responses:
 *       200:
 *         description: ✅ OTP sent successfully
 *       404:
 *         description: ❌ User not found
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.post("/send-otp-to-phone", sendOtpPhone);

/**
 * @swagger
 * /api/user/verify-otp-phone:
 *   post:
 *     summary: 🔍 Verify OTP sent to user's phone
 *     tags: [👥 Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: 📱 The phone number of the user
 *               otp:
 *                 type: string
 *                 description: 🔢 The OTP sent to the user's phone
 *     responses:
 *       200:
 *         description: 🎉 Account activated successfully
 *       403:
 *         description: ❌ OTP is incorrect
 *       404:
 *         description: ❌ User not found
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.post("/verify-otp-phone", verifyOtpPhone);

/**
 * @swagger
 * /api/user/verify-otp:
 *   post:
 *     summary: 🔍 Verify OTP for account activation
 *     tags: [👥 Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: 🎉 Account activated successfully
 *       403:
 *         description: ❌ OTP is incorrect
 *       405:
 *         description: ❌ Email is incorrect
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: 🔑 Login a user
 *     tags: [👥 Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 📧 The email of the user
 *               password:
 *                 type: string
 *                 description: 🔑 The password of the user
 *     responses:
 *       200:
 *         description: 🎉 Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       403:
 *         description: ⚠️ Account not activated
 *       422:
 *         description: ❌ Invalid email or password
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.post("/login", login);

/**
 * @swagger
 * /api/user/get-access-token:
 *   post:
 *     summary: 🔄 Get a new access token using a refresh token
 *     tags: [👥 Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: 🔄 Your refresh token
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 access_token:
 *                   type: string
 *       404:
 *         description: ❌ User not found
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.post("/get-access-token", getNewAccessToken);

/**
 * @swagger
 * /api/user/promoteToAdmin/{id}:
 *   patch:
 *     summary: ⬆️ Promote a user to admin
 *     tags: [👥 Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 🆔 The ID of the user to promote
 *     responses:
 *       200:
 *         description: 🎉 User promoted to admin successfully
 *       400:
 *         description: ❌ Bad request
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.patch("/promoteToAdmin/:id", promoteToAdmin);

/**
 * @swagger
 * /api/user/myCentres:
 *   get:
 *     summary: 🏫 Get educational centers of the logged-in user
 *     description: 📚 Returns a list of educational centers belonging to the authenticated CEO.
 *     tags:
 *      - 👥 Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ Successfully retrieved educational centers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Tech Academy"
 *                       image:
 *                         type: string
 *                         format: uri
 *                         example: "https://example.com/image.jpg"
 *                       address:
 *                         type: string
 *                         example: "123 Main St, City"
 *                       phone:
 *                         type: string
 *                         example: "+998901234567"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T12:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-10T15:30:00.000Z"
 *                       User:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           firstName:
 *                             type: string
 *                             example: "John"
 *                           lastName:
 *                             type: string
 *                             example: "Doe"
 *                           email:
 *                             type: string
 *                             format: email
 *                             example: "john@example.com"
 *                           phone:
 *                             type: string
 *                             example: "+998901234567"
 *                           role:
 *                             type: string
 *                             example: "Ceo"
 *                           status:
 *                             type: string
 *                             example: "Active"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-01T10:00:00.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-02-01T11:00:00.000Z"
 *                       Regions:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           name:
 *                             type: string
 *                             example: "Tashkent"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-12-15T09:00:00.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-05T10:30:00.000Z"
 *       403:
 *         description: ⛔ Unauthorized user type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorization User type ❗"
 *       400:
 *         description: ❌ Bad request or unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error_message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
UsersRouter.get("/myCentres", verifyToken, myEducationalCenters);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: 🔍 Get all users with filters, sorting, and pagination
 *     tags: [👥 Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 🔎 Search by full name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [Admin, User, Ceo, SuperAdmin]
 *         description: 🎭 Filter by user role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive]
 *         description: 🟢🔴 Filter by user status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 📄 Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 📊 Number of results per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [fullName, email, createdAt]
 *         description: 🔼🔽 Field to sort by (e.g., fullName, email, createdAt)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: ⬆️⬇️ Sorting order (asc or desc)
 *     responses:
 *       200:
 *         description: ✅ A list of users with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: ⛔ Unauthorized access
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.get("/", verifyToken, checkRole(["Admin"]), findAll);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: 👤 Get a user by ID
 *     tags: [👥 Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 🆔 The ID of the user
 *     responses:
 *       200:
 *         description: ✅ User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: ❌ User not found
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.get("/:id", verifyToken, checkRole(["Admin", "Ceo"]), findOne);

/**
 * @swagger
 * /api/user/myinfo:
 *   get:
 *     summary: 👤 Get my user profile
 *     description: 📋 Retrieve authenticated user's profile information
 *     tags: [👥 Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: 🔒 Unauthorized - Invalid or missing token
 *       404:
 *         description: ❌ User not found
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.get("/myinfo", verifyToken);

/**
 * @swagger
 * /api/user/{id}:
 *   patch:
 *     summary: ✏️ Update a user by ID (Admin or SuperAdmin only)
 *     tags: [👥 Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 🆔 The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: 🏷️ The updated full name of the user
 *               yearOfBirth:
 *                 type: integer
 *                 description: 🎂 The updated year of birth of the user
 *               email:
 *                 type: string
 *                 description: 📧 The updated email of the user
 *               password:
 *                 type: string
 *                 description: 🔑 The updated password of the user
 *               phone:
 *                 type: string
 *                 description: 📱 The updated phone number of the user
 *               role:
 *                 type: string
 *                 enum: [Admin, User, Seller, SuperAdmin]
 *                 description: 🎭 The updated role of the user
 *               avatar:
 *                 type: string
 *                 description: 🖼️ The updated avatar URL of the user
 *               regionID:
 *                 type: integer
 *                 description: 🌍 The updated ID of the region the user belongs to
 *     responses:
 *       200:
 *         description: ✅ User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: ⛔ Only SuperAdmin can update users
 *       404:
 *         description: ❌ User not found
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.patch(
  "/:id",
  verifyToken,
  selfPolice(["Admin", "SuperAdmin", "Ceo"]),
  update
);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: 🗑️ Delete a user by ID (Admin only)
 *     tags: [👥 Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 🆔 The ID of the user
 *     responses:
 *       200:
 *         description: ✅ User deleted successfully
 *       403:
 *         description: ⛔ Nobody can destroy admin
 *       404:
 *         description: ❌ User not found
 *       500:
 *         description: 🚨 Internal server error
 */
UsersRouter.delete("/:id", verifyToken, checkRole(["Admin", "Ceo"]), remove);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 🆔 The auto-generated ID of the user
 *         firstName:
 *           type: string
 *           description: 👨‍💼 User's first name
 *         lastName:
 *           type: string
 *           description: 👨‍💼 User's last name
 *         fullName:
 *           type: string
 *           description: 🏷️ The full name of the user
 *         yearOfBirth:
 *           type: integer
 *           description: 🎂 The year of birth of the user
 *         email:
 *           type: string
 *           description: 📧 The email of the user
 *         password:
 *           type: string
 *           description: 🔑 The password of the user
 *         phone:
 *           type: string
 *           description: 📱 The phone number of the user
 *         role:
 *           type: string
 *           enum: [Admin, User, Seller, SuperAdmin, Ceo]
 *           description: 🎭 The role of the user
 *         avatar:
 *           type: string
 *           description: 🖼️ The avatar URL of the user
 *         status:
 *           type: string
 *           enum: [Active, Inactive]
 *           description: 🟢🔴 The status of the user
 *         regionID:
 *           type: integer
 *           description: 🌍 The ID of the region the user belongs to
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: ⏰ The timestamp when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: ⏳ The timestamp when the user was last updated
 *         Region:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *       example:
 *         id: 1
 *         firstName: "John"
 *         lastName: "Doe"
 *         fullName: "John Doe"
 *         yearOfBirth: 1990
 *         email: "john.doe@example.com"
 *         phone: "+998901234567"
 *         role: "User"
 *         avatar: "http://example.com/avatar.jpg"
 *         status: "Active"
 *         regionID: 1
 *         createdAt: "2023-10-01T12:34:56Z"
 *         updatedAt: "2023-10-01T12:34:56Z"
 *         Region:
 *           id: 1
 *           name: "Tashkent"
 *
 *     MyInfoResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *           description: ✅ Request status
 *         data:
 *           $ref: '#/components/schemas/User'
 *       example:
 *         success: true
 *         data:
 *           id: 1
 *           firstName: "John"
 *           lastName: "Doe"
 *           email: "john@example.com"
 *           phone: "+998901234567"
 *           yearOfBirth: 1990
 *           avatar: "avatar.jpg"
 *           role: "User"
 *           status: "Active"
 *           createdAt: "2023-01-01T00:00:00.000Z"
 *           updatedAt: "2023-01-10T00:00:00.000Z"
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: 🔑 JWT Authorization token
 */

module.exports = UsersRouter;
