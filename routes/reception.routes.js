const { Router } = require("express");
const ReceptionRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
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
 * /api/reception:
 *   get:
 *     summary: Get all receptions
 *     tags: [Receptions]
 *     parameters:
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of records to retrieve
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *       - in: query
 *         name: fieldId
 *         schema:
 *           type: integer
 *         description: Filter by field ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: integer
 *         description: Filter by branch ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Column to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of receptions
 *       404:
 *         description: No receptions found
 */
ReceptionRouter.get("/", getAll);

/**
 * @swagger
 * /api/reception/{id}:
 *   get:
 *     summary: Get reception by ID
 *     tags: [Receptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reception data
 *       404:
 *         description: Reception not found
 */
ReceptionRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/reception/my:
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
 */
ReceptionRouter.get("/my", verifyToken, myCourses);

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
 *               userID:
 *                 type: integer
 *                 description: ID of the user registering for the course
 *                 example: 123
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
 *                     userID:
 *                       type: integer
 *                       example: 123
 *                     educationCenterID:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "fieldID is required"
 *       409:
 *         description: User is already registered for this course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You have already registered to this course ❗"
 */


ReceptionRouter.post("/", verifyToken, post);

/**
 * @swagger
 * /api/reception/{id}:
 *   patch:
 *     summary: Update reception details
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
 *         description: Reception updated
 *       404:
 *         description: Reception not found
 */
ReceptionRouter.patch("/:id", verifyToken, selfPolice(["Admin", "Ceo"]), update);

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
 */
ReceptionRouter.delete(
  "/:id",
  verifyToken,
  selfPolice(["Admin", "Ceo"]),
  remove
);

module.exports = ReceptionRouter;
