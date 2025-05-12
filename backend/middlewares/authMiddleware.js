const { verifyToken } = require("../controllers/authController");

function authMiddleware(socket, next) {
  verifyToken(socket, next);
}

module.exports = authMiddleware;
