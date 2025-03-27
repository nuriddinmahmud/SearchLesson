const { Router } = require("express");
const CourseRouter = Router();
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
 *   name: Courses
 *   description: Course management API
 */

/**
 * @swagger
 * /api/course:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by course name
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
 *         description: Filter by course type
 *     responses:
 *       200:
 *         description: List of courses
 *       400:
 *         description: Bad request
 *       404:
 *         description: No courses found
 */
CourseRouter.get("/", getAll);

/**
 * @swagger
 * /api/course/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course data
 *       404:
 *         description: Course not found
 */
CourseRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/course:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
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
 *         description: Course created
 *       400:
 *         description: Validation error
 */
CourseRouter.post("/", verifyToken, checkRole(["Admin"]), post);

/**
 * @swagger
 * /api/course/{id}:
 *   patch:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID
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
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Course not found
 */
CourseRouter.patch("/:id", selfPolice(["Admin"]), update);

/**
 * @swagger
 * /api/course/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course deleted
 *       404:
 *         description: Course not found
 */
CourseRouter.delete("/:id", selfPolice(["Admin"]), remove);

module.exports = CourseRouter;
