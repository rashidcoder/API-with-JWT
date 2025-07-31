const bcrypt = require("bcryptjs"); // Parollarni hash qilish uchun
const jwt = require("jsonwebtoken"); // Tokenlar bilan ishlash uchun
const fs = require("fs"); // roles.json ni o‘qish uchun
const path = require("path");

const {
  addUser,
  findUserByUsername,
  findUserByRefreshToken,
  removeRefreshToken
} = require("../models/userModel");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/tokenUtils");

// Role'lar .json fayldan o‘qiladi
const roles = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/roles.json"), "utf-8")
);

/**
 * @desc   Ro‘yxatdan o‘tish
 * @route  POST /api/auth/register
 */
const register = async (req, res) => {
  const { username, password, role } = req.body;

  // Foydalanuvchi mavjud emasligini tekshiramiz
  const existingUser = findUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ message: "Bu username band" });
  }

  // Rol mavjudligini tekshiramiz (faqat to‘rttasidan biri bo‘lishi kerak)
  if (!roles.includes(role)) {
    return res.status(400).json({ message: "Noto‘g‘ri rol kiritildi" });
  }

  // Parolni xavfsiz qilish uchun hash qilamiz
  const hashedPassword = await bcrypt.hash(password, 10);

  // Userni saqlaymiz (hozircha xotirada)
  const user = addUser({
    username,
    password: hashedPassword,
    role,
    refreshToken: null // boshlanishda refresh token yo‘q
  });

  res.status(201).json({ message: "Ro‘yxatdan o‘tildi", user: { id: user.id, username: user.username, role: user.role } });
};

/**
 * @desc   Login qilish va tokenlar yaratish
 * @route  POST /api/auth/login
 */
const login = async (req, res) => {
  const { username, password } = req.body;

  // Foydalanuvchini topamiz
  const user = findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ message: "Noto‘g‘ri username yoki password" });
  }

  // Parol to‘g‘riligini tekshiramiz
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Noto‘g‘ri username yoki password" });
  }

  // Access va Refresh tokenlar yaratamiz
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Refresh tokenni user modeliga saqlaymiz
  user.refreshToken = refreshToken;

  // Tokenlarni clientga yuborish (cookie + JSON)
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true, // JavaScriptdan o‘qib bo‘lmaydi
      secure: false, // true bo‘lsa faqat HTTPS (prod uchun)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 kun
    })
    .json({
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
};

/**
 * @desc   Refresh token orqali yangi access token olish
 * @route  POST /api/auth/refresh
 */
const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // Refresh token mavjudligini tekshiramiz
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token yo‘q" });
  }

  const user = findUserByRefreshToken(refreshToken);
  if (!user) {
    return res.status(403).json({ message: "Noto‘g‘ri token" });
  }

  // Tokenni verify qilamiz
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      return res.status(403).json({ message: "Token yaroqsiz" });
    }

    // Yangi access token beriladi
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
};

/**
 * @desc   Logout qilish — refresh tokenni o‘chiramiz
 * @route  POST /api/auth/logout
 */
const logout = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(204); // All good
  }

  removeRefreshToken(refreshToken); // User modeldan refresh tokenni olib tashlaymiz
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });

  res.json({ message: "Logout muvaffaqiyatli bo‘ldi" });
};

module.exports = {
  register,
  login,
  refresh,
  logout
};
