const {
  addComment,
  editComment,
} = require("../controllers/comment.controller");

const express = require("express");

const router = express.Router();
router.post("/create-comment", addComment);
router.post("/:id", editComment);

module.exports = router;
