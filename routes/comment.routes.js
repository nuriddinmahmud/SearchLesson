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
 *     summary: Barcha izohlarni olish
 *     description: "Barcha izohlarni olish, filtr va saralash parametrlarini qo‘llab-quvvatlaydi."
 *     security:
 *       - bearerAuth: []
 *     tags: [Comment]
 *     parameters:
 *       - name: take
 *         in: query
 *         description: Nechta element olish kerak
 *         required: false
 *         schema:
 *           type: integer
 *       - name: from
 *         in: query
 *         description: Qaysi elementdan boshlab olish kerak
 *         required: false
 *         schema:
 *           type: integer
 *       - name: star
 *         in: query
 *         description: Faqat ma’lum yulduz bahosiga ega izohlarni olish
 *         required: false
 *         schema:
 *           type: integer
 *       - name: educationCenterId
 *         in: query
 *         description: Ma’lum ta’lim markaziga tegishli izohlarni olish
 *         required: false
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: query
 *         description: Ma’lum foydalanuvchiga tegishli izohlarni olish
 *         required: false
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: Qaysi maydon bo‘yicha saralash
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         description: Saralash tartibi ("asc" yoki "desc")
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli natija
 *       401:
 *         description: Ruxsat yo‘q (token noto‘g‘ri yoki mavjud emas)
 *       500:
 *         description: Server xatosi
 */
CommentRouter.get("/", verifyToken, getAll);

/**
 * @swagger
 * /api/comment/{id}:
 *   get:
 *     summary: Berilgan `id` ga ega izohni olish
 *     security:
 *       - bearerAuth: []
 *     tags: [Comment]
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
CommentRouter.get("/:id", verifyToken, getOne);

/**
 * @swagger
 * /api/comment/my-comments:
 *   get:
 *     summary: Foydalanuvchining shaxsiy izohlarini olish
 *     security:
 *       - bearerAuth: []
 *     tags: [Comment]
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
 *       - bearerAuth: []
 *     tags: [Comment]
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
 *               userId:
 *                 type: integer
 *                 example: 1
 *               educationCenterId:
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
 *       - bearerAuth: []
 *     tags: [Comment]
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
 *       - bearerAuth: []
 *     tags: [Comment]
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
