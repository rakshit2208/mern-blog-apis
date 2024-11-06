// controllers/userController.js
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../public/uploads/profile_pics");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

exports.uploadMiddleware = upload.single("profilePic");

exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;
    const userId = req.user.userId;
    let profilePicUrl;

    if (req.file) {
        profilePicUrl = `/uploads/profile_pics/${req.file.filename}`;
    }

    try {
        // Find the user by ID and update the fields
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.username = username || user.username;
        user.email = email || user.email;
        if (profilePicUrl) user.profilePic = profilePicUrl; // Save profilePic path to user document

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Failed to update profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};


exports.getUserProfile = async (req, res) => {
    const userId = req.user.userId; // Ensure the user ID is set from middleware

    try {
        const user = await User.findById(userId).select("username email profilePic"); // Select only the necessary fields
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ username: user.username, email: user.email, profilePic: user.profilePic });
    } catch (error) {
        console.error("Failed to get user profile:", error);
        res.status(500).json({ error: "Failed to retrieve user profile" });
    }
};
