const { Router } = require("express");
const CenterRouter = Router();
const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/educationalCenter.controller");

const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/rolePolice");

/**
 * @swagger
 * tags:
 *   - name: EducationalCenter
 *     description: Education Center management
 */
/**
 * @swagger
 * /api/educationalCenter:
 *   get:
 *     summary: Get all educational centers
 *     tags: [EducationalCenter]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by educational center name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sorting order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: List of educational centers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EducationalCenter'
 *       500:
 *         description: Internal server error
 */
CenterRouter.get("/", getAll);

/**
 * @swagger
 * /api/educationalCenter/{id}:
 *   get:
 *     summary: Get an education center by ID
 *     tags: [EducationalCenter]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Education center ID
 *     responses:
 *       200:
 *         description: Education center details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EducationalCenter'
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
CenterRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/educationalCenter:
 *   post:
 *     summary: Create a new education center
 *     tags: [EducationalCenter]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image
 *               - address
 *               - phone
 *               - regionID
 *               - star
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               regionID:
 *                 type: integer
 *               star:
 *                 type: number
 *     responses:
 *       201:
 *         description: Education center created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EducationalCenter'
 *       403:
 *         description: Not permitted
 *       500:
 *         description: Internal server error
 */
CenterRouter.post("/", verifyToken, checkRole(["Admin", "Ceo"]), create);

/**
 * @swagger
 * /api/educationalCenter/{id}:
 *   patch:
 *     summary: Update an education center
 *     tags: [EducationalCenter]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Education center ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               star:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EducationalCenter'
 *       403:
 *         description: Not permitted
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
CenterRouter.patch("/:id", verifyToken, checkRole(["Admin", "Ceo"]), update);

/**
 * @swagger
 * /api/educationalCenter/{id}:
 *   delete:
 *     summary: Delete an education center
 *     tags: [EducationalCenter]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Education center ID
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       403:
 *         description: Not permitted
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
CenterRouter.delete("/:id", verifyToken, checkRole(["Admin", "Ceo"]), remove);

/**
 * @swagger
 * components:
 *   schemas:
 *    EducationalCenter:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         image:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         star:
 *           type: number
 */
module.exports = CenterRouter;
