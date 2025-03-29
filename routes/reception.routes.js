const { Router } = require("express");
const ReceptionRouter = Router();
const {
  myCourses,
  registerToBranch,
  cancelRegistration,
} = require("../controllers/reception.controller");
const verifyToken = require("../middlewares/verifyToken");
const selfPolice = require("../middlewares/selfPolice");

/**
 * @swagger
 * tags:
 *   name: 🎓 Reception
 *   description: 📝 Course registration management system
 */
/**
 * @swagger
 * /api/reception/my-courses:
 *   get:
 *     summary: 📚 Get my registered courses
 *     tags: [🎓 Reception]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ Successfully retrieved user's courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reception'
 *       404:
 *         description: ❌ No courses found for this user
 *       401:
 *         description: 🔒 Unauthorized access
 *       500:
 *         description: 🚨 Internal server error
 */
/**
 * @swagger
 * /api/reception:
 *   post:
 *     summary: ✏️ Register for a course
 *     tags: [🎓 Reception]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReceptionInput'
 *     responses:
 *       201:
 *         description: 🎉 Successfully registered to branch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully registered to branch"
 *                 data:
 *                   $ref: '#/components/schemas/Reception'
 *       400:
 *         description: ❌ Bad request (missing or invalid parameters)
 *       404:
 *         description: 🔍 Branch not found in specified educational center
 *       409:
 *         description: ⚠️ Already registered to this branch
 *       500:
 *         description: 🚨 Internal server error
 */
/**
 * @swagger
 * /api/reception/{id}:
 *   delete:
 *     summary: 🗑️ Cancel a registration
 *     tags: [🎓 Reception]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 🆔 Reception record ID
 *     responses:
 *       200:
 *         description: ✅ Successfully canceled registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Registration canceled successfully"
 *       401:
 *         description: 🔒 Unauthorized access
 *       404:
 *         description: 🔍 Registration not found or no permission
 *       500:
 *         description: 🚨 Internal server error
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Reception:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *           description: 🆔 Unique identifier
 *         userID:
 *           type: integer
 *           example: 5
 *           description: 👤 User ID
 *         EducationCenterID:
 *           type: integer
 *           example: 10
 *           description: 🏫 Educational Center ID
 *         branchID:
 *           type: integer
 *           example: 2
 *           description: 🏢 Branch ID
 *         status:
 *           type: string
 *           example: "Pending"
 *           description: 📊 Registration status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 📅 Creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 🔄 Last update date
 *         EducationalCenter:
 *           $ref: '#/components/schemas/EducationalCenter'
 *         Branch:
 *           $ref: '#/components/schemas/Branch'
 *
 *     ReceptionInput:
 *       type: object
 *       required:
 *         - EducationCenterID
 *         - branchID
 *       properties:
 *         EducationCenterID:
 *           type: integer
 *           description: 🏫 ID of the educational center
 *           example: 10
 *         branchID:
 *           type: integer
 *           description: 🏢 ID of the branch
 *           example: 2
 *
 *     EducationalCenter:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 🆔 Unique ID
 *         name:
 *           type: string
 *           description: 🏛️ Center name
 *
 *     Branch:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 🆔 Unique ID
 *         name:
 *           type: string
 *           description: 🏢 Branch name
 */

ReceptionRouter.get("/my-courses", verifyToken, myCourses);
ReceptionRouter.post("/", verifyToken, registerToBranch);
ReceptionRouter.delete(
  "/:id",
  verifyToken,
  selfPolice(["Admin", "Ceo"]),
  cancelRegistration
);

module.exports = ReceptionRouter;
