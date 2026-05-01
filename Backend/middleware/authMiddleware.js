const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user; // available in all protected routes as req.user
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    res.status(500).json({ message: "Authentication error." });
  }
};

module.exports = { protect };