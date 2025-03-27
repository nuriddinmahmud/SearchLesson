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
const selfPolice = require("../middlewares/selfPolice");

/**
 * @swagger
 * tags:
 *   - name: Educational Centers
 *     description: Management of educational centers
 */

/**
 * @swagger
 * /api/educationalCenter:
 *   get:
 *     summary: Get all educational centers
 *     tags: [Educational Centers]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name
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
 *         description: Results per page
 *     responses:
 *       200:
 *         description: List of educational centers
 *       500:
 *         description: Internal server error
 */
CenterRouter.get("/", getAll);

/**
 * @swagger
 * /api/educationalCenter/{id}:
 *   get:
 *     summary: Get an educational center by ID
 *     tags: [Educational Centers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Educational center ID
 *     responses:
 *       200:
 *         description: Center details
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
CenterRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/educationalCenter:
 *   post:
 *     summary: Create a new educational center
 *     tags: [Educational Centers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, image, address, phone, regionID, star]
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
<<<<<<< HEAD
 *               userID:
 *                 type: integer
 *               fields:
=======
 *               fields: 
>>>>>>> 519c9fec0640cf3815049629b36c6738d8fcd915
 *                 type: array
 *                 example: [1,2,3]
 *               subjects:
 *                 type: array
 *                 example: [1,2,3]
 *     responses:
 *       201:
 *         description: Created successfully
 *       403:
 *         description: Not permitted
 *       500:
 *         description: Internal server error
 */
CenterRouter.post("/", verifyToken, create);

/**
 * @swagger
 * /api/educationalCenter/{id}:
 *   patch:
 *     summary: Update an educational center
 *     tags: [Educational Centers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Educational center ID
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
 *     responses:
 *       200:
 *         description: Successfully updated
 *       403:
 *         description: Not permitted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
CenterRouter.patch("/:id", verifyToken, selfPolice(["Ceo"]), update);

/**
 * @swagger
 * /api/educationalCenter/{id}:
 *   delete:
 *     summary: Delete an educational center
 *     tags: [Educational Centers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Educational center ID
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       403:
 *         description: Not permitted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
CenterRouter.delete("/:id", verifyToken, selfPolice(["Ceo"]), remove);

/**
 * @swagger
 * components:
 *   schemas:
 *     EducationalCenter:
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
 */
module.exports = CenterRouter;
