const { Router } = require("express");
const ResourceRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
} = require("../controllers/resource.controller");
const verifyToken = require("../middlewares/verifyToken");
const selfPolice = require("../middlewares/selfPolice");

/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Resource management API
 */

/**
 * @swagger
 * /api/resources:
 *   get:
 *     summary: Get all resources
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by resource name
 *       - in: query
 *         name: categoryID
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: A list of resources
 *       400:
 *         description: Bad request
 */
ResourceRouter.get("/", getAll);

/**
 * @swagger
 * /api/resources/{id}:
 *   get:
 *     summary: Get a single resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: The resource data
 *       404:
 *         description: Resource not found
 */
ResourceRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/resources:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
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
 *               description:
 *                 type: string
 *               media:
 *                 type: string
 *               image:
 *                 type: string
 *               categoryID:
 *                 type: integer
 *               userID:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Resource created
 *       400:
 *         description: Validation error
 */
ResourceRouter.post("/", verifyToken, post);

/**
 * @swagger
 * /api/resources/{id}:
 *   patch:
 *     summary: Update a resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               media:
 *                 type: string
 *               image:
 *                 type: string
 *               categoryID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Resource updated
 *       404:
 *         description: Resource not found
 */
ResourceRouter.patch("/:id", verifyToken, selfPolice(["User", "Admin"]), update);

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     summary: Delete a resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource deleted
 *       404:
 *         description: Resource not found
 */
ResourceRouter.delete("/:id", verifyToken, selfPolice(["User", "Admin"]), remove);

module.exports = ResourceRouter;
