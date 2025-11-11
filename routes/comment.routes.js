const { addComment } = require("../controllers/comment.controller");

const express = require("express");

const router = express.Router();
router.post("/create-comment", addComment);

module.exports = router;
