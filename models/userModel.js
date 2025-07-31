// Hozircha foydalanuvchilarni xotirada saqlaymiz (real DB yo'q)
const users = [
  {
    "id": 1,
    "username": "rashidcoder",
    "password": "Abdurashid20100308",
    "role": "boss"
  },
  {
    "id": 2,
    "username": "super_admin",
    "password": "adminsup123",
    "role": "admin"
  },
  {
    "id": 3,
    "username" : "admin",
    "password": "adminpass",
    "role": "admin"
  },
  {
    "id": 4,
    "username": "developer",
    "password": "developerpass",
    "role": "developer"
  },
  {
    "id": 5,
    "username": "simple_user",
    "password": "simplepass",
    "role": "simpleuser"
  }
]; // { id, username, password (hashed), role, refreshToken }

// Har bir foydalanuvchiga ID berish uchun oddiy id generator
let idCounter = 1;

// Foydalanuvchi qo‘shish
const addUser = (user) => {
  user.id = idCounter++; // Unikal ID beramiz
  users.push(user);
  return user;
};

// Foydalanuvchi login bo‘yicha topish
const findUserByUsername = (username) => {
  return users.find(u => u.username === username);
};

// ID bo‘yicha topish
const findUserById = (id) => {
  return users.find(u => u.id === id);
};

// Refresh token orqali topish
const findUserByRefreshToken = (token) => {
  return users.find(u => u.refreshToken === token);
};

// Refresh tokenni o‘chirish
const removeRefreshToken = (token) => {
  const user = findUserByRefreshToken(token);
  if (user) user.refreshToken = null;
};

module.exports = {
  addUser,
  findUserByUsername,
  findUserById,
  findUserByRefreshToken,
  removeRefreshToken
};
