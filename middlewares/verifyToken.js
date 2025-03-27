const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] ||
    req.headers["Authorization"] ||
    req.headers["token"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No token provided or invalid format!" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const user = jwt.verify(token, "access_secret");
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ message: "Invalid token!" });
  }
};

module.exports = authMiddleware;
