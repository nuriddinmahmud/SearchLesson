const { Router } = require("express");
const ResourceCategoryRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
} = require("../controllers/resourceCategory.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/rolePolice");
const selfPolice = require("../middlewares/selfPolice");

/**
 * @swagger
 * tags:
 *   name: 📁 Resource Categories
 *   description: 🗂️ Resource category management API
 */
/**
 * @swagger
 * /api/resourceCategory:
 *   get:
 *     summary: 📋 Get all resource categories
 *     tags: [📁 Resource Categories]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 🔍 Search query for categories
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 📄 Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 📊 Number of items per page
 *     responses:
 *       200:
 *         description: ✅ List of resource categories
 *       400:
 *         description: ❌ Bad request
 */
ResourceCategoryRouter.get("/", getAll);

/**
 * @swagger
 * /api/resourceCategory/{id}:
 *   get:
 *     summary: 🔍 Get a single resource category by ID
 *     tags: [📁 Resource Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 🆔 Resource category ID
 *     responses:
 *       200:
 *         description: ✅ Resource category data
 *       404:
 *         description: ❌ Resource category not found
 *       400:
 *         description: ❌ Invalid ID
 */
ResourceCategoryRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/resourceCategory:
 *   post:
 *     summary: ✨ Create a new resource category
 *     tags: [📁 Resource Categories]
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
 *                 example: "Education"
 *                 description: 🏷️ Category name
 *               image:
 *                 type: string
 *                 example: "image_url"
 *                 description: 🖼️ Category image URL
 *     responses:
 *       201:
 *         description: ✅ Resource category created successfully
 *       400:
 *         description: ❌ Invalid input
 *       401:
 *         description: 🔒 Unauthorized
 */
ResourceCategoryRouter.post("/", verifyToken, checkRole(["Admin"]), post);

/**
 * @swagger
 * /api/resourceCategory/{id}:
 *   patch:
 *     summary: ✏️ Update a resource category
 *     tags: [📁 Resource Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 🆔 Resource category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Category Name"
 *                 description: 🏷️ New category name
 *               image:
 *                 type: string
 *                 example: "updated_image_url"
 *                 description: 🖼️ New category image URL
 *     responses:
 *       200:
 *         description: ✅ Resource category updated successfully
 *       400:
 *         description: ❌ Invalid input
 *       404:
 *         description: ❌ Resource category not found
 *       401:
 *         description: 🔒 Unauthorized
 */
ResourceCategoryRouter.patch(
  "/:id",
  verifyToken,
  selfPolice(["Admin", "SuperAdmin"]),
  update
);

/**
 * @swagger
 * /api/resourceCategory/{id}:
 *   delete:
 *     summary: 🗑️ Delete a resource category
 *     tags: [📁 Resource Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 🆔 Resource category ID
 *     responses:
 *       200:
 *         description: ✅ Resource category deleted successfully
 *       404:
 *         description: ❌ Resource category not found
 *       401:
 *         description: 🔒 Unauthorized
 */
ResourceCategoryRouter.delete(
  "/:id",
  verifyToken,
  selfPolice(["Admin"]),
  remove
);

module.exports = ResourceCategoryRouter;
