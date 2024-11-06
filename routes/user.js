// routes/user.js
const express = require("express");
const { updateProfile, uploadMiddleware, getUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/profile", authMiddleware, uploadMiddleware, updateProfile);
// Route to get user profile
router.get("/user-profile", authMiddleware, getUserProfile);

module.exports = router;
