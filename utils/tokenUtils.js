const jwt = require("jsonwebtoken");

// ACCESS token yaratish (foydalanuvchi ID va roli asosida)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // qisqa umr — xavfsizlik uchun
  );
};

// REFRESH token yaratish (uzoq umrli)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
