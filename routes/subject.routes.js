const { Router } = require("express");
const SubjectRouter = Router();
const {
  getAll,
  getOne,
  post,
  remove,
  update,
} = require("../controllers/subject.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/rolePolice");
const selfPolice = require("../middlewares/selfPolice");
/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Subject management API
 */

/**
 * @swagger
 * /api/subject:
 *   get:
 *     summary: Get all Subjects
 *     tags: [Subjects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by Subject name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (asc or desc)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by Subject type
 *     responses:
 *       200:
 *         description: List of Subjects
 *       400:
 *         description: Bad request
 *       404:
 *         description: No Subjects found
 */
SubjectRouter.get("/", getAll);

/**
 * @swagger
 * /api/subject/{id}:
 *   get:
 *     summary: Get a Subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Subject ID
 *     responses:
 *       200:
 *         description: Subject data
 *       404:
 *         description: Subject not found
 */
SubjectRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/subject:
 *   post:
 *     summary: Create a new Subject
 *     tags: [Subjects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject created
 *       400:
 *         description: Validation error
 */
SubjectRouter.post("/", verifyToken, checkRole(["Admin"]), post);

/**
 * @swagger
 * /api/subject/{id}:
 *   patch:
 *     summary: Update a Subject
 *     tags: [Subjects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subject updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Subject not found
 */
SubjectRouter.patch("/:id", selfPolice(["Admin"]), update);

/**
 * @swagger
 * /api/subject/{id}:
 *   delete:
 *     summary: Delete a Subject
 *     tags: [Subjects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Subject ID
 *     responses:
 *       200:
 *         description: Subject deleted
 *       404:
 *         description: Subject not found
 */
SubjectRouter.delete("/:id", selfPolice(["Admin"]), remove);

module.exports = SubjectRouter;
