const jwt = require("jsonwebtoken");
const { findUserById } = require("../models/userModel");

// Bu middleware access token orqali foydalanuvchini tekshiradi
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization header mavjudligini tekshiramiz
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token berilmagan" });
  }

  const token = authHeader.split(" ")[1];

  // Access tokenni verify qilamiz
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token yaroqsiz" });
    }

    // Token ichidagi user ID orqali foydalanuvchini topamiz
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "Foydalanuvchi topilmadi" });
    }

    req.user = user; // Keyingi middleware yoki controllerga yuboriladi
    next(); // Yo‘ling ochiq!
  });
};

// Rol asosida sahifaga ruxsat berish (masalan: faqat adminlar kirishi mumkin)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bu sahifaga kirish taqiqlangan" });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles
};
