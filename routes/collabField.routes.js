// const { Router } = require("express");
// const collabFieldRouter = Router();
// const { post } = require("../controllers/collabField.controller");

// /**
//  * @swagger
//  * tags:
//  *   name: CollabField
//  *   description: API for managing collab fields
//  */
// /**
//  * @swagger
//  * /api/collabField:
//  *   post:
//  *     summary: Create a new CollabField
//  *     description: This endpoint creates a new CollabField entry.
//  *     tags:
//  *       - CollabField
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               fieldId:
//  *                 type: integer
//  *                 example: 1
//  *               educationCenterId:
//  *                 type: integer
//  *                 example: 2
//  *     responses:
//  *       "200":
//  *         description: CollabField created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "CollabField created successfully!"
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: integer
//  *                       example: 10
//  *                     fieldId:
//  *                       type: integer
//  *                       example: 1
//  *                     educationCenterId:
//  *                       type: integer
//  *                       example: 2
//  *       "422":
//  *         description: Validation error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Validation error message"
//  *       "500":
//  *         description: Internal server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error_message:
//  *                   type: string
//  *                   example: "Internal server error"
//  */
// collabFieldRouter.post("/", post);

// module.exports = collabFieldRouter;
