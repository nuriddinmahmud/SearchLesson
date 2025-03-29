const express = require("express");
const dotenv = require("dotenv");
const mainRouter = require("./routes/index.js");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { db } = require("./config/database.js");
const multer = require("multer");
const path = require("path");
const app = express();
const cors = require("cors");
dotenv.config();

const PORT = process.env.PORT;

const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Course System API",
      version: "1.0.0",
      description:
        "API documentation for Course project by (AbuBakr, Islombek, Nuriddin)",
    },
    servers: [
      {
        url: `http://18.159.61.156:${PORT}`,
        description: "Local development server",
      },
      {
        url: "https://your-production-url.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Authorization header using the Bearer scheme",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "main.js"],
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

app.use(express.json());

app.use(cors());

app.use("/image", express.static("uploads"));
app.use("/api", mainRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: 📤 Upload an image
 *     description: "🖼️ Uploads an image file and returns its URL"
 *     tags: [🖼️ Images]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: "📁 The image file to upload"
 *     responses:
 *       200:
 *         description: "✅ Image uploaded successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: "🔗 The URL of the uploaded image"
 *                   example: "http://localhost:2000/image/filename.jpg"
 *       400:
 *         description: "❌ Bad request - No file uploaded or invalid file type"
 *       500:
 *         description: "🚨 Internal server error"
 */
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ message: "❌ No file uploaded or invalid file type!" });
  }
  res
    .status(200)
    .send({ url: `http://18.159.61.156:${PORT}/image/${req.file.filename}` });
});

async function Course() {
  try {
    await db.authenticate();
    console.log("Connected to database successfully ✅");
    // await db.sync({ force: true });
    // console.log("DB synced");
    app.listen(PORT, () =>
      console.log(
        `Server started on port ${PORT} ✅ , follow the path "http://18.159.61.156:7000/api-docs 🗿 "`
      )
    );
  } catch (error) {
    console.log(error.message);
  }
}
Course();
