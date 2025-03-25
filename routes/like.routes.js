const { Router } = require("express");
const LikesRouter = Router();
const {
  getAll,
  getOne,
  post,
  remove,
  liked
} = require("../controllers/like.controller");
const verifyToken = require("../middlewares/verifyToken");

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Like management API
 */

/**
 * @swagger
 * /api/like:
 *   get:
 *     summary: Get all likes
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of likes to return
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *         description: Number of likes to skip
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: A list of likes
 *       404:
 *         description: No likes found
 */
LikesRouter.get("/", getAll);

/**
 * @swagger
 * /api/like/liked:
 *   get:
 *     summary: Get liked items of authenticated user
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of liked items
 *       404:
 *         description: Likes not found
 */
LikesRouter.get("/liked", verifyToken, liked);

/**
 * @swagger
 * /api/like/{id}:
 *   get:
 *     summary: Get a like by ID
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The like ID
 *     responses:
 *       200:
 *         description: Like details
 *       404:
 *         description: Like not found
 */
LikesRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/like:
 *   post:
 *     summary: Create a new like
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               educationCenterId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Like created successfully
 *       400:
 *         description: Validation error
 */
LikesRouter.post("/", verifyToken, post);

/**
 * @swagger
 * /api/like/{id}:
 *   delete:
 *     summary: Delete a like by ID
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The like ID
 *     responses:
 *       200:
 *         description: Like deleted successfully
 *       404:
 *         description: Like not found
 */
LikesRouter.delete("/:id", verifyToken, remove);

module.exports = LikesRouter;