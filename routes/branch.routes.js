const { Router } = require("express");
const BranchRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
} = require("../controllers/branch.controller");
const verifyToken = require("../middlewares/verifyToken");
const rolePolice = require("../middlewares/rolePolice");
const selfPolice = require("../middlewares/selfPolice");

/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: Branch management
 */

/**
 * @swagger
 * /api/branch:
 *   get:
 *     summary: Get all branches
 *     tags: [Branches]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by branch name
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
 *         name: regionID
 *         schema:
 *           type: integer
 *         description: Filter by region ID
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
 *         description: List of branches
 *       400:
 *         description: Bad request
 */
BranchRouter.get("/", getAll);

/**
 * @swagger
 * /api/branch/{id}:
 *   get:
 *     summary: Get a single branch by ID
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch data
 *       404:
 *         description: Branch not found
 */
BranchRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/branch:
 *   post:
 *     summary: Create a new branch
 *     tags: [Branches]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, address, image, regionID, centreID]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Branch name
 *               phone:
 *                 type: string
 *                 description: Contact phone number
 *               address:
 *                 type: string
 *                 description: Branch address
 *               image:
 *                 type: string
 *                 description: Image URL of the branch
 *               regionID:
 *                 type: integer
 *                 description: Region ID
 *               centreID:
 *                 type: integer
 *                 description: Education center ID
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Validation error
 */
BranchRouter.post("/", verifyToken, selfPolice(["Admin", "Ceo"]), post);

/**
 * @swagger
 * /api/branch/{id}:
 *   patch:
 *     summary: Update branch details
 *     tags: [Branches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Branch name
 *               phone:
 *                 type: string
 *                 description: Contact phone number
 *               address:
 *                 type: string
 *                 description: Branch address
 *               image:
 *                 type: string
 *                 description: Image URL of the branch
 *               regionID:
 *                 type: integer
 *                 description: Region ID
 *               centreID:
 *                 type: integer
 *                 description: Education center ID
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Branch not found
 */
BranchRouter.patch("/:id", verifyToken, rolePolice(["Admin"]), update);

/**
 * @swagger
 * /api/branch/{id}:
 *   delete:
 *     summary: Delete a branch
 *     tags: [Branches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Branch not found
 */
BranchRouter.delete("/:id", verifyToken, rolePolice(["Admin"]), remove);

module.exports = BranchRouter;
