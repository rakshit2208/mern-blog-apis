const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const rootPath = path.join(__dirname, '..');
  const client = path.join(rootPath, 'client');
  // const publicDir = path.join(rootPath, 'public');
  const publicDir = path.join(__dirname, 'public');


const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Database connected successfully.........."))
    .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

app.use(express.static(client));

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  app.get('*', (req, res) => {
    console.log("(req.url", req.url);
    if (ALLOWED_EXTENSIONS.filter((ext) => req.url.indexOf(ext) > 0).length > 0) {
      res.sendFile(path.resolve(`${publicDir}/${req.url}`));
    } else {
      res.sendFile('index.html', {
        root: client
      });
    }
  });


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
