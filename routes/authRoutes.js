const express = require("express");
const router = express.Router();

// Auth controller funksiyalarini chaqiramiz
const {
  register,
  login,
  refresh,
  logout
} = require("../controllers/authController");

// Har bir marshrut kerakli controllerga ulanadi

// Foydalanuvchini ro‘yxatdan o‘tkazish
router.post("/register", register);

// Login qilish va tokenlarni berish
router.post("/login", login);

// Refresh token orqali yangi access token olish
router.post("/refresh", refresh);

// Logout qilish (refresh tokenni yo‘q qilish)
router.post("/logout", logout);

module.exports = router;
