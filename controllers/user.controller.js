const conn = require("../db.config");
const utils = require("util");
const query = utils.promisify(conn.query).bind(conn);

const getAllUsers = async (req, res) => {
  try {
    console.log("i read this first");
    const sql = "SELECT * FROM users";
    console.log("look im still alive");

    const users = await query(sql);
    console.log("unbelievable");

    return res.status(200).json(users);
  } catch (err) {
    console.log("culprit");
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const users = await query(sql, [id]);
    if (users.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json(users[0]);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Server error in get user by ID", error: err.message });
  } 
};

const updateUserById = async (req, res) => {
  const { name, age } = req.body;
  const { id } = req.params;

  const sql = "SELECT * FROM users WHERE id = ?";
  theuser = await query(sql, [id]);
  if (theuser.length === 0) {
    return res.status(401).json({ msg: "User not found" });
  }

  try {
    const sql = "UPDATE users SET name=?, age=? WHERE id = ?";
    const updatedsql = await query(sql, [name, age, id]);
    return res.status(200).json(updatedsql);
  } catch (error) {
    return res.status(500).json({ msg: "Server error in update user by ID" });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM users WHERE id = ?";
  theuser = await query(sql, [id]);
  if (theuser.length === 0) {
    return res.status(401).json({ msg: "User not found" });
  }
  try {
    const sql = "DELETE FROM user WHERE id=?";
    const deletedsql = await query(sql, [id]);
    return res.status(200).json(deletedsql);
  } catch (error) {
    return res.status(500).json({ msg: "Server error in delete user by ID" });
  }
};

module.exports = { getAllUsers, getUserById, updateUserById, deleteUserById };
