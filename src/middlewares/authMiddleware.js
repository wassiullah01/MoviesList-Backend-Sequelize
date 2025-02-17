const jwt = require("jsonwebtoken");
const { sequelize } = require("../config/db");
const { QueryTypes } = require("sequelize");
const JWT_SECRET = "your_jwt_secret";

module.exports = async function (req, res, next) {
  const authHeader = req.header("Authorization");
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const users = await sequelize.query(
      `SELECT u.id, u.email, u.username, r.name AS role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      {
        replacements: [userId],
        type: QueryTypes.SELECT,
      }
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = users[0];
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};