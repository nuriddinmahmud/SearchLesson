const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },

  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
});

const upload = multer({ storage });

module.exports = upload;
