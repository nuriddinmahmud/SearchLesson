const { Router } = require("express");
const ReceptionRouter = Router();
const {
  post,
  remove,
  myCourses,
} = require("../controllers/reception.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/rolePolice");
const selfPolice = require("../middlewares/selfPolice");

/**
 * @swagger
 * tags:
 *   name: Receptions
 *   description: Reception management
 */
/**
 * @swagger
 * /api/reception/my-courses:
 *   get:
 *     summary: Get my courses
 *     tags: [Receptions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user courses
 *       404:
 *         description: No courses found
 *       401:
 *         description: Unauthorized
 */
ReceptionRouter.get("/my-courses", verifyToken, myCourses);

/**
 * @swagger
 * /api/reception:
 *   post:
 *     summary: Register for a course
 *     tags:
 *       - Receptions
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fieldID:
 *                 type: integer
 *                 description: ID of the field
 *                 example: 1
 *               branchID:
 *                 type: integer
 *                 description: ID of the branch
 *                 example: 2
 *               educationCenterID:
 *                 type: integer
 *                 description: ID of the education center
 *                 example: 10
 *     responses:
 *       201:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You registered successfully ✅"
 *                 newData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     fieldID:
 *                       type: integer
 *                       example: 1
 *                     branchID:
 *                       type: integer
 *                       example: 2
 *                     educationCenterID:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Validation error
 *       409:
 *         description: User is already registered for this course
 *       401:
 *         description: Unauthorized
 */
ReceptionRouter.post("/", verifyToken, post);

/**
 * @swagger
 * /api/reception/{id}:
 *   delete:
 *     summary: Delete a reception
 *     tags: [Receptions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reception deleted
 *       404:
 *         description: Reception not found
 *       401:
 *         description: Unauthorized
 */
ReceptionRouter.delete(
  "/:id",
  verifyToken,
  checkRole(["Admin", "Ceo"]),
  remove
);

module.exports = ReceptionRouter;
