const express = require("express");
const router = express.Router();
const fs = require("fs");

const multer = require("multer");
const path = require("path");

const { createPosts, editPost } = require("../controllers/post.controller");
const { verifyToken } = require("../middleware/authcheck");

const uploadDir = "./uploads"; // Define your uploads directory path

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if the directory exists
    if (!fs.existsSync(uploadDir)) {
      // If not, create it
      fs.mkdir(uploadDir, { recursive: true }, (err) => {
        if (err) {
          console.error("Error creating upload directory:", err);
          return cb(err); // Pass the error to Multer
        }
        cb(null, uploadDir); // Directory created or already exists, proceed
      });
    } else {
      cb(null, uploadDir); // Directory already exists, proceed
    }
  },
  filename: (req, file, cb) => {
    // Define how the uploaded file will be named
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // limit: 10MB
});

router.post("/createpost", verifyToken, upload.single("image"), createPosts);
router.post("/edit-post", verifyToken, editPost);
module.exports = router;
