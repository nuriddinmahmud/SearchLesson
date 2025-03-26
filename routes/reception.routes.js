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
 *     tags: [Receptions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fieldId, branchId, userId, educationCenterId]
 *             properties:
 *               fieldId:
 *                 type: integer
 *                 description: ID of the field
 *               branchId:
 *                 type: integer
 *                 description: ID of the branch
 *               userId:
 *                 type: integer
 *                 description: ID of the user registering for the course
 *               educationCenterId:
 *                 type: integer
 *                 description: ID of the education center
 *     responses:
 *       201:
 *         description: Successfully registered
 *       400:
 *         description: Validation error
 *       409:
 *         description: User is already registered for this course
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
