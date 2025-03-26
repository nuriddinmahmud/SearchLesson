const { Router } = require("express");
const FieldRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
} = require("../controllers/field.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/rolePolice");

/**
 * @swagger
 * tags:
 *   name: Fields
 *   description: Field management
 */

/**
 * @swagger
 * /api/field:
 *   get:
 *     summary: Get all fields
 *     tags: [Fields]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by field name
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
 *         name: courseID
 *         schema:
 *           type: integer
 *         description: Filter by course ID
 *     responses:
 *       200:
 *         description: List of fields
 *       400:
 *         description: Bad request
 */
FieldRouter.get("/", getAll);

/**
 * @swagger
 * /api/field/{id}:
 *   get:
 *     summary: Get a single field by ID
 *     tags: [Fields]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID
 *     responses:
 *       200:
 *         description: Field data
 *       404:
 *         description: Field not found
 */
FieldRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/field:
 *   post:
 *     summary: Create a new field
 *     tags: [Fields]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, image, courseID]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Field name
 *               image:
 *                 type: string
 *                 description: Image URL of the field
 *               courseID:
 *                 type: integer
 *                 description: Associated course ID
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Validation error
 */
FieldRouter.post("/", verifyToken, checkRole(["Admin", "Ceo"]), post);

/**
 * @swagger
 * /api/field/{id}:
 *   patch:
 *     summary: Update field details
 *     tags: [Fields]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Field name
 *               image:
 *                 type: string
 *                 description: Image URL of the field
 *               courseID:
 *                 type: integer
 *                 description: Associated course ID
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Field not found
 */
FieldRouter.patch("/:id", verifyToken, checkRole(["Admin", "Ceo"]), update);

/**
 * @swagger
 * /api/field/{id}:
 *   delete:
 *     summary: Delete a field
 *     tags: [Fields]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Field not found
 */
FieldRouter.delete("/:id", verifyToken, checkRole(["Admin", "Ceo"]), remove);

module.exports = FieldRouter;
