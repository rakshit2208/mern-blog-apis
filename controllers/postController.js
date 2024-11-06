const Post = require("../models/Post");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../public/uploads/post_pics");
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

exports.uploadMiddleware = upload.single("imageUrl");

exports.createPost = async (req, res) => {
    try {

        const post = new Post({
            ...req.body,
            author: req.user.userId,
            imageUrl: req.file ? `/uploads/post_pics/${req.file.filename}` : null
        });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
  
        res.status(500).json({ error: "Post creation failed" });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const updatedData = { ...req.body };
        if (req.file) updatedData.imageUrl = `/uploads/post_pics/${req.file.filename}`;
        
        const post = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!post) return res.status(404).json({ error: "Post not found" });
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: "Failed to update post" });
    }
};


exports.getPosts = async (req, res) => {
    const posts = await Post.find().populate("author", "username").sort({ createdAt: -1 });;
    res.json(posts);
};

exports.getMyPosts = async (req, res) => {
    try {
        // Get the user ID from the authenticated token
        const userId = req.user.userId;

        // Find posts created by this user
        const myPosts = await Post.find({ author: userId });
        
        res.json(myPosts);
    } catch (error) {
       
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

exports.getPost = async (req, res) => {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
};


exports.deletePost = async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted successfully" });
};
