/**
 * @desc   Foydalanuvchining profile sahifasini ko‘rsatish
 * @route  GET /api/user/profile
 * @access Protected
 */
const getProfile = (req, res) => {
  // req.user middleware orqali kiritilgan
  res.json({
    message: "Bu profile sahifasi",
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
};

module.exports = { getProfile };
