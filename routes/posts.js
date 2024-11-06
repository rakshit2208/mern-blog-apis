const express = require("express");
const { createPost, getPosts, getPost, updatePost, deletePost, getMyPosts, uploadMiddleware } = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, uploadMiddleware , createPost);
router.get("/", getPosts);
router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/:id", getPost);
router.put("/:id", authMiddleware,uploadMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);


module.exports = router;
