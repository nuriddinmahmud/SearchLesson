const express = require("express");
const { getAll, remove } = require("../controllers/session.controller");
const verifyToken = require("../middlewares/verifyToken");

const SessionRouter = express.Router();

/**
 * @swagger
 * /api/session/me:
 *   get:
 *     summary: 🔍 Get current session information
 *     description: 📊 Retrieves the latest session information for the authenticated user, including user ID, IP address, device info, and creation time.
 *     tags: [🔐 Sessions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ Session information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                   description: 🆔 The session ID.
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                   description: 👤 The ID of the user associated with the session.
 *                 ipAddress:
 *                   type: string
 *                   example: "192.168.1.1"
 *                   description: 🌐 The IP address from which the session was created.
 *                 deviceInfo:
 *                   type: string
 *                   example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
 *                   description: 💻 Information about the device used to create the session.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T12:34:56Z"
 *                   description: ⏰ The timestamp when the session was created.
 *       401:
 *         description: 🔒 Unauthorized (invalid or missing token).
 *       404:
 *         description: ❌ Session not found for the user.
 *       500:
 *         description: 🚨 Internal server error.
 */
SessionRouter.get("/me", verifyToken, getAll);

/**
 * @swagger
 * /api/session/delete:
 *   delete:
 *     summary: 🗑️ Delete current session
 *     description: ⚠️ Deletes the latest session for the authenticated user.
 *     tags: [🔐 Sessions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session deleted successfully"
 *       401:
 *         description: 🔒 Unauthorized (invalid or missing token).
 *       404:
 *         description: ❌ Session not found for the user.
 *       500:
 *         description: 🚨 Internal server error.
 */
SessionRouter.delete("/delete", verifyToken, remove);

module.exports = SessionRouter;
