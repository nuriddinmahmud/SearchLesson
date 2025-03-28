const { Router } = require("express");
const router = Router();
const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/branch.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/rolePolice");
const selfPolice = require("../middlewares/selfPolice");

/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: Branch management
 */

/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: Get all branches
 *     tags: [Branches]
 *     parameters:
 *       - in: query
 *         name: educationalCenterId
 *         schema:
 *           type: integer
 *         description: Filter by educational center ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of branches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Branch'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
router.get("/", getAll);

/**
 * @swagger
 * /api/branch/{id}:
 *   get:
 *     summary: Get a branch by ID
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
 *         description: Branch details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/BranchWithDetails'
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getOne);

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
 *             $ref: '#/components/schemas/CreateBranchInput'
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Branch'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Educational center not found
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, checkRole(["Admin", "Ceo"]), create);

/**
 * @swagger
 * /api/branch/{id}:
 *   patch:
 *     summary: Update a branch
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
 *             $ref: '#/components/schemas/UpdateBranchInput'
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Branch'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", verifyToken, selfPolice(["Admin", "Ceo"]), update);

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
 *         description: Branch deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", verifyToken, selfPolice(["Admin", "Ceo"]), remove);

/**
 * @swagger
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         image:
 *           type: string
 *         educationalCenterId:
 *           type: integer
 *         centerID:
 *           type: integer
 *           description: Alias for educationalCenterId
 *         regionId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         fields:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2, 3]
 *         subjects:
 *           type: array
 *           items:
 *             type: integer
 *           example: [4, 5, 6]
 *
 *     BranchWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Branch'
 *         - type: object
 *           properties:
 *             center:
 *               $ref: '#/components/schemas/EducationalCenter'
 *             Region:
 *               $ref: '#/components/schemas/Region'
 *             Fields:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Field'
 *             Subjects:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *
 *     EducationalCenter:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         image:
 *           type: string
 *
 *     Region:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *
 *     Field:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         image:
 *           type: string
 *
 *     Subject:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         image:
 *           type: string
 *
 *     CreateBranchInput:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - address
 *         - educationalCenterId
 *       properties:
 *         name:
 *           type: string
 *           example: "Main Branch"
 *         phone:
 *           type: string
 *           example: "+998901234567"
 *         address:
 *           type: string
 *           example: "123 Education Street"
 *         image:
 *           type: string
 *           example: "https://example.com/branch.jpg"
 *         educationalCenterId:
 *           type: integer
 *           example: 1
 *         centerID:
 *           type: integer
 *           description: Alias for educationalCenterId
 *           example: 1
 *         regionId:
 *           type: integer
 *           example: 1
 *         fields:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2]
 *         subjects:
 *           type: array
 *           items:
 *             type: integer
 *           example: [3, 4]
 *
 *     UpdateBranchInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Updated Branch Name"
 *         phone:
 *           type: string
 *           example: "+998907654321"
 *         address:
 *           type: string
 *           example: "456 Knowledge Avenue"
 *         image:
 *           type: string
 *           example: "https://example.com/new-branch.jpg"
 *         centerID:
 *           type: integer
 *           description: Alias for educationalCenterId
 *           example: 1
 *         regionId:
 *           type: integer
 *           example: 2
 *         fields:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 3]
 *         subjects:
 *           type: array
 *           items:
 *             type: integer
 *           example: [2, 4]
 */

module.exports = router;
