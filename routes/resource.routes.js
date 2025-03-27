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
 * /api/resource:
 *   get:
 *     summary: Get all resources with filters, sorting, and pagination
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
 *       - in: query
 *         name: userID
 *         schema:
 *           type: integer
 *         description: Filter by user ID
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
 *         description: Field to sort by (e.g., name, createdAt)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sorting order (asc or desc)
 *     responses:
 *       200:
 *         description: A list of resources with pagination
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
ResourceRouter.get("/", getAll);

/**
 * @swagger
 * /api/resource/{id}:
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
 * /api/resource:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, media, image, categoryID, userID]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               media:
 *                 type: string
 *                 format: binary
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
 * /api/resource/{id}:
 *   patch:
 *     summary: Update a resource
 *     tags: [Resources]
 *     security:
 *       - BearerAuth: []
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
 *                 format: binary
 *               image:
 *                 type: string
 *               categoryID:
 *                 type: integer
 *               userID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Resource updated
 *       404:
 *         description: Resource not found
 */
ResourceRouter.patch(
  "/:id",
  verifyToken,
  selfPolice(["SuperAdmin", "Admin", "User"]),
  update
);

/**
 * @swagger
 * /api/resource/{id}:
 *   delete:
 *     summary: Delete a resource
 *     tags: [Resources]
 *     security:
 *       - BearerAuth: []
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
ResourceRouter.delete(
  "/:id",
  verifyToken,
  selfPolice(["User", "Admin"]),
  remove
);

module.exports = ResourceRouter;
