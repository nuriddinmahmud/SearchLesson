const { Router } = require("express");
const CommentRouter = Router();
const {
  getAll,
  getOne,
  post,
  update,
  remove,
  myComments,
} = require("../controllers/comment.controller");
const verifyToken = require("../middlewares/verifyToken");

/**
 * @swagger
 * /api/comment:
 *   get:
 *     summary: Get all comments
 *     description: "Retrieve all comments with filtering and sorting options."
 *     tags: [Comments]
 *     parameters:
 *       - name: take
 *         in: query
 *         description: Number of comments to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *       - name: from
 *         in: query
 *         description: Starting point for retrieval
 *         required: false
 *         schema:
 *           type: integer
 *       - name: star
 *         in: query
 *         description: Filter comments by rating (stars)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: educationCenterId
 *         in: query
 *         description: Filter comments by education center ID
 *         required: false
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: query
 *         description: Filter comments by user ID
 *         required: false
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         description: Sorting order ("asc" or "desc")
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Server error
 */
CommentRouter.get("/", getAll);

/**
 * @swagger
 * /api/comment/{id}:
 *   get:
 *     summary: Berilgan `id` ga ega izohni olish
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Izoh topildi
 *       404:
 *         description: Izoh topilmadi
 */
CommentRouter.get("/:id", getOne);

/**
 * @swagger
 * /api/comment/my-comments:
 *   get:
 *     summary: Foydalanuvchining shaxsiy izohlarini olish
 *     security:
 *       - BearerAuth: []
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Foydalanuvchiga tegishli kommentlar
 *       404:
 *         description: Foydalanuvchining kommentlari topilmadi
 *       401:
 *         description: Ruxsat yo‘q (Token noto‘g‘ri yoki yo‘q)
 *       500:
 *         description: Server xatosi
 */
CommentRouter.get("/my-comments", verifyToken, myComments);

/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: Yangi izoh qo‘shish
 *     description: "Foydalanuvchi tomonidan yangi izoh qo‘shish"
 *     security:
 *       - BearerAuth: []
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Bu joy juda zo‘r!"
 *               star:
 *                 type: integer
 *                 example: 5
 *               educationCenterID:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Izoh muvaffaqiyatli yaratildi
 *       400:
 *         description: Xato ma’lumotlar
 *       401:
 *         description: Ruxsat yo‘q
 *       500:
 *         description: Server xatosi
 */
CommentRouter.post("/", verifyToken, post);

/**
 * @swagger
 * /api/comment/{id}:
 *   patch:
 *     summary: Izohni yangilash
 *     security:
 *       - BearerAuth: []
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               star:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Izoh muvaffaqiyatli yangilandi
 *       400:
 *         description: Xato ma’lumotlar
 *       401:
 *         description: Ruxsat yo‘q
 *       404:
 *         description: Izoh topilmadi
 *       500:
 *         description: Server xatosi
 */
CommentRouter.patch("/:id", verifyToken, update);

/**
 * @swagger
 * /api/comment/{id}:
 *   delete:
 *     summary: Izohni o‘chirish
 *     security:
 *       - BearerAuth: []
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Izoh muvaffaqiyatli o‘chirildi
 *       401:
 *         description: Ruxsat yo‘q
 *       404:
 *         description: Izoh topilmadi
 *       500:
 *         description: Server xatosi
 */
CommentRouter.delete("/:id", verifyToken, remove);

module.exports = CommentRouter;
