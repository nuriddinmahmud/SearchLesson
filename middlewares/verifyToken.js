const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const accessKey = process.env.ACCESS_KEY || "accessKey";

function verifyToken(req, res, next) {
  try {
    let authHeader = req.header("Authorization");
    console.log(authHeader);
    

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized ❌ (Token not found or invalid)" });
    }

    let token = authHeader.split(" ")[1];

    jwt.verify(token, accessKey, (err, decoded) => {
      req.user = decoded;
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    res.status(500).json({ error_message: error.message });
  }
}

module.exports = verifyToken;
