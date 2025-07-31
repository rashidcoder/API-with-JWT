// Express frameworkini chaqiramiz
const express = require("express");

// Sozlamalarni .env fayldan olish uchun
require("dotenv").config();

// CORS frontend bilan ishlash uchun (http://localhost:5173)
const cors = require("cors");

// Cookie parser - HTTP-only cookie bilan ishlash uchun
const cookieParser = require("cookie-parser");

// Marshrutlarni (routing) import qilamiz
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// JSON formatdagi so‘rovlarni qabul qilish uchun
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Frontenddan keladigan so‘rovlar uchun CORS sozlamasi
app.use(cors({
  origin: "http://localhost:5173", // bu yer frontend url bo'ladi
  credentials: true, // cookie yuborishga ruxsat
}));

// API marshrutlar
app.use("/api/auth", authRoutes);   // Auth bilan bog‘liq barcha yo‘llar
app.use("/api/user", userRoutes);   // Foydalanuvchi sahifasi uchun

// Serverni ishga tushiramiz
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server ${process.env.PORT}-portda ishlamoqda`);
});
