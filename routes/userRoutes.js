const express = require("express");
const router = express.Router();

const { getProfile } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Profile sahifasi faqat login bo‘lganlar uchun ochiq
router.get("/profile", verifyToken, getProfile);

module.exports = router;
