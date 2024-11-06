// models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    imageUrl: { type: String, default: "" },
}, { timestamps: true }); // Enable timestamps

module.exports = mongoose.model("Post", PostSchema);
