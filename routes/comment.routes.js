const { Router } = require("express");
const CommentRouter = Router();
const {
  getOne,
  post,
  update,
  remove,
  myComments,
} = require("../controllers/comment.controller");
const verifyToken = require("../middlewares/verifyToken");

/**
 * @swagger
 * /api/comment/{id}:
 *   get:
 *     summary: 🔍 Get comment by ID
 *     tags: [💬 Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 🆔 Comment ID
 *     responses:
 *       200:
 *         description: ✅ Comment found
 *       404:
 *         description: ❌ Comment not found
 */
CommentRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/comment/my-comments:
 *   get:
 *     summary: 📝 Get user's personal comments
 *     security:
 *       - BearerAuth: []
 *     tags: [💬 Comments]
 *     responses:
 *       200:
 *         description: ✅ User's comments retrieved
 *       404:
 *         description: ❌ User comments not found
 *       401:
 *         description: 🔒 Unauthorized (Invalid or missing token)
 *       500:
 *         description: 🚨 Server error
 */
CommentRouter.get("/my-comments", verifyToken, myComments);

/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: ✍️ Add new comment
 *     description: "💬 Add new comment by user"
 *     security:
 *       - BearerAuth: []
 *     tags: [💬 Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: 📝 Comment text
 *                 example: "Bu joy juda zo‘r!"
 *               star:
 *                 type: integer
 *                 description: ⭐ Rating (1-5 stars)
 *                 example: 5
 *               educationalCenterID:
 *                 type: integer
 *                 description: 🏫 Education center ID
 *                 example: 2
 *     responses:
 *       201:
 *         description: ✅ Comment created successfully
 *       400:
 *         description: ❌ Invalid data
 *       401:
 *         description: 🔒 Unauthorized
 *       500:
 *         description: 🚨 Server error
 */
CommentRouter.post("/", verifyToken, post);

/**
 * @swagger
 * /api/comment/{id}:
 *   patch:
 *     summary: ✏️ Update comment
 *     security:
 *       - BearerAuth: []
 *     tags: [💬 Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 🆔 Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: 📝 Updated comment text
 *               star:
 *                 type: integer
 *                 description: ⭐ Updated rating
 *     responses:
 *       200:
 *         description: ✅ Comment updated successfully
 *       400:
 *         description: ❌ Invalid data
 *       401:
 *         description: 🔒 Unauthorized
 *       404:
 *         description: ❌ Comment not found
 *       500:
 *         description: 🚨 Server error
 */
CommentRouter.patch("/:id", verifyToken, update);

/**
 * @swagger
 * /api/comment/{id}:
 *   delete:
 *     summary: 🗑️ Delete comment
 *     security:
 *       - BearerAuth: []
 *     tags: [💬 Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 🆔 Comment ID
 *     responses:
 *       200:
 *         description: ✅ Comment deleted successfully
 *       401:
 *         description: 🔒 Unauthorized
 *       404:
 *         description: ❌ Comment not found
 *       500:
 *         description: 🚨 Server error
 */
CommentRouter.delete("/:id", verifyToken, remove);

module.exports = CommentRouter;
