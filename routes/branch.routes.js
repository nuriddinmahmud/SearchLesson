const { Router } = require("express");
const BranchRouter = Router();
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
 *   name: 🏢 Branches
 *   description: 🌿 Branch management endpoints
 */
/**
 * @swagger
 * /api/branch:
 *   get:
 *     summary: 📋 Get all branches
 *     tags: [🏢 Branches]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *         description: 🔍 Filter by branch name
 *       - in: query
 *         name: regionId
 *         schema: { type: integer }
 *         description: 🌍 Filter by region ID
 *       - in: query
 *         name: centerId
 *         schema: { type: integer }
 *         description: 🏛️ Filter by educational center ID
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: 📄 Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: 📊 Items per page
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: "createdAt" }
 *         description: 🔼 Sort field
 *       - in: query
 *         name: order
 *         schema: { type: string, default: "DESC", enum: [ASC, DESC] }
 *         description: ⬆️ Sort order
 *     responses:
 *       200:
 *         description: ✅ Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/BranchWithDetails' }
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *       500:
 *         description: 🚨 Server error
 */
BranchRouter.get("/", getAll);

/**
 * @swagger
 * /api/branch/{id}:
 *   get:
 *     summary: 🔍 Get branch details
 *     tags: [🏢 Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: 🆔 Branch ID
 *     responses:
 *       200:
 *         description: ✅ Branch details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/BranchWithDetails' }
 *       404:
 *         description: ❌ Branch not found
 *       500:
 *         description: 🚨 Server error
 */
BranchRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/branch:
 *   post:
 *     summary: ✨ Create new branch
 *     tags: [🏢 Branches]
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
 *         description: ✅ Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/BranchWithDetails' }
 *       400:
 *         description: ❌ Validation error
 *       403:
 *         description: ⛔ Forbidden
 *       404:
 *         description: ❌ Resource not found
 *       422:
 *         description: ❌ Validation error
 *       500:
 *         description: 🚨 Server error
 */
BranchRouter.post("/", verifyToken, checkRole(["Ceo", "Admin"]), create);

/**
 * @swagger
 * /api/branch/{id}:
 *   patch:
 *     summary: ✏️ Update branch
 *     tags: [🏢 Branches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: 🆔 Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBranchInput'
 *     responses:
 *       200:
 *         description: ✅ Branch updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Branch' }
 *       400:
 *         description: ❌ Validation error
 *       403:
 *         description: ⛔ Forbidden
 *       404:
 *         description: ❌ Branch not found
 *       500:
 *         description: 🚨 Server error
 */
BranchRouter.patch("/:id", verifyToken, selfPolice(["Admin", "Ceo"]), update);

/**
 * @swagger
 * /api/branch/{id}:
 *   delete:
 *     summary: 🗑️ Delete branch
 *     tags: [🏢 Branches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: 🆔 Branch ID
 *     responses:
 *       200:
 *         description: ✅ Branch deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *       403:
 *         description: ⛔ Forbidden
 *       404:
 *         description: ❌ Branch not found
 *       500:
 *         description: 🚨 Server error
 */
BranchRouter.delete("/:id", verifyToken, selfPolice(["Admin", "Ceo"]), remove);

/**
 * @swagger
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       properties:
 *         id: { type: integer, description: 🆔 ID }
 *         name: { type: string, description: 🏷️ Name }
 *         phone: { type: string, description: 📞 Phone }
 *         address: { type: string, description: 🏠 Address }
 *         image: { type: string, description: 🖼️ Image URL }
 *         regionID: { type: integer, description: 🌍 Region ID }
 *         educationalCenterID: { type: integer, description: 🏛️ Center ID }
 *         createdAt: { type: string, format: date-time, description: ⏰ Created at }
 *         updatedAt: { type: string, format: date-time, description: ⏳ Updated at }
 *
 *     BranchWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Branch'
 *         - type: object
 *           properties:
 *             EducationalCenter: { $ref: '#/components/schemas/EducationalCenter' }
 *             Region: { $ref: '#/components/schemas/Region' }
 *             Subjects:
 *               type: array
 *               items: { $ref: '#/components/schemas/Subject' }
 *               description: 📚 Subjects
 *             Fields:
 *               type: array
 *               items: { $ref: '#/components/schemas/Field' }
 *               description: 🔬 Fields
 *
 *     EducationalCenter:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *         phone: { type: string }
 *
 *     Region:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *
 *     Subject:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *         image: { type: string }
 *
 *     Field:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *         image: { type: string }
 *
 *     CreateBranchInput:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - address
 *         - image
 *         - regionID
 *         - educationalCenterID
 *       properties:
 *         name: { type: string }
 *         phone: { type: string }
 *         address: { type: string }
 *         image: { type: string }
 *         regionID: { type: integer }
 *         educationalCenterID: { type: integer }
 *         subjects:
 *           type: array
 *           items: { type: integer }
 *           description: 📚 Subject IDs
 *         fields:
 *           type: array
 *           items: { type: integer }
 *           description: 🔬 Field IDs
 *
 *     UpdateBranchInput:
 *       type: object
 *       properties:
 *         name: { type: string }
 *         phone: { type: string }
 *         address: { type: string }
 *         image: { type: string }
 *         regionID: { type: integer }
 *         educationalCenterID: { type: integer }
 *         subjects: { type: array, items: { type: integer } }
 *         fields: { type: array, items: { type: integer } }
 */
module.exports = BranchRouter;
