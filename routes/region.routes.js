const { Router } = require("express");
const RegionRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
} = require("../controllers/region.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/rolePolice");

/**
 * @swagger
 * tags:
 *   name: Region
 *   description: Region management
 */

/**
 * @swagger
 * /api/region:
 *   get:
 *     summary: Get all regions
 *     tags: [Region]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by region name
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
 *     responses:
 *       200:
 *         description: List of regions
 *       400:
 *         description: Bad request
 */
RegionRouter.get("/", getAll);

/**
 * @swagger
 * /api/region/{id}:
 *   get:
 *     summary: Get a single region by ID
 *     tags: [Region]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Region data
 *       404:
 *         description: Region not found
 */
RegionRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/region:
 *   post:
 *     summary: Create a new region
 *     tags: [Region]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Region name
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Validation error
 */
RegionRouter.post("/", verifyToken, checkRole(["Admin"]), post);

/**
 * @swagger
 * /api/region/{id}:
 *   patch:
 *     summary: Update region details
 *     tags: [Region]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Region ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Region name
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Region not found
 */
RegionRouter.patch("/:id", verifyToken, checkRole(["Admin"]), update);

/**
 * @swagger
 * /api/region/{id}:
 *   delete:
 *     summary: Delete a region
 *     tags: [Region]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Region not found
 */
RegionRouter.delete("/:id", verifyToken, checkRole(["Admin"]), remove);

module.exports = RegionRouter;
