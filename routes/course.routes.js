const { Router } = require("express");
const CourseRouter = Router();
const {
    getAll,
    getOne,
    post,
    remove,
    update,
} = require("../controllers/course.controller");
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
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of courses to return
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *         description: Number of courses to skip
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by course name
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by course type
 *     responses:
 *       200:
 *         description: A list of courses
 *       404:
 *         description: No courses found
 */
CourseRouter.get("/", verifyToken, getAll);


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
 *       - bearerAuth: []
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
 *       201:
 *         description: Course created
 *       400:
 *         description: Validation error
 */

CourseRouter.post("/", verifyToken, selfPolice(["Admin"]), post);


/**
 * @swagger
 * /api/course/{id}:
 *   patch:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
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

CourseRouter.patch("/:id", checkRole(["Admin"]), update);
/**
 * @swagger
 * /api/course/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
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

CourseRouter.delete("/:id", checkRole(["Admin"]), remove);

module.exports = CourseRouter;







