const { Router } = require("express");
const LikesRouter = Router();
const { post, remove, liked } = require("../controllers/like.controller");
const verifyToken = require("../middlewares/verifyToken");

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Like management API
 */
/**
 * @swagger
 * /api/like/my-likes:
 *   get:
 *     summary: Get liked items of authenticated user
 *     tags: [Likes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of liked items
 *       404:
 *         description: Likes not found
 */
LikesRouter.get("/my-likes", verifyToken, liked);

/**
 * @swagger
 * /api/like:
 *   post:
 *     summary: Create a new like
 *     tags: [Likes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               educationalCenterID:
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
 *       - BearerAuth: []
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
