const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controller.js");
const express = require("express");

const router = express.Router();
router.get("/getAllUser", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUserById);
router.delete("/:id", deleteUserById);

module.exports = router;
