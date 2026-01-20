const { title } = require("process");
const conn = require("../db.config");
const utils = require("util");
const query = utils.promisify(conn.query).bind(conn);


const createPosts = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const userId = req.user.userId;
    const image = req.file ? req.file.filename : null;
    const slug = title.split(" ").join("-").toLowerCase();

    // check if post already exist
    const slugSql = "SELECT * FROM Posts WHERE slug = ?";
    const slugQuery = await query(slugSql, [slug]);
    if (slugQuery.length > 0) {
      return res.status(400).json({ msg: "Post already exists" });
    }

    // create post
    const postSl =
      "INSERT INTO posts(title, content, image, userId, slug) VALUES(?, ?, ?,?,?)";
    const postQuery = await query(postSl, [
      title,
      content,
      image,
      userId,
      slug,
    ]);
    res.status(201).json({ msg: "post created successfully" });
  } catch (err) {
    console.log("error in creating");
    res.status(500).json(err.message);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const dataSql = "SELECT * FROM posts WHERE userId =?";
    const dataQuery = await query(dataSql, userId);
    if (dataQuery.length === 0) {
      return res.status(404).json({ msg: "You do not have any post" });
    }
    return res.status(200).json(dataQuery);
  } catch (error) {
    return res.status(500).json({ msg: "Error in get all Posts" });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const postSql = "SELECT * FROM posts WHERE id = ?";
  const postQuery = await query(postSql, [id]);
  console.log(postQuery);

  if (postQuery.length === 0) {
    res.status(404).json({ msg: "Post not found!" });
  }

  return res.status(200).json(postQuery);
};

const updatePostById = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, content } = req.body;
    const userId = req.user.userId;

    // check to see if client filled all fields
    title = !title ? postQuery[0].title : title;
    content = !content ? postQuery[0].content : content;

    const postSql = "SELECT * FROM posts WHERE id=?";
    const postQuery = await query(postSql, [id]);

    // check if post doesn't exist for this user
    if (postQuery.length === 0) {
      return res.status(404).json({ msg: "Post not found!!" });
    }

    // update the information in database
    const dataSql = "UPDATE Posts SET title = ?, content = ? WHERE id = ?";
    const dataQuery = await query(dataSql, [title, content, id]);
    return res.status(404).json(dataQuery);
  } catch (error) {
    return res.status(500).json({ msg: "Error in update controller" });
  }
};

const deletePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSql = "DELETE FROM posts WHERE id = ?";
    const deleteQuery = await query(deletePostBy, [id]);
    if (!deleteQuery.length === 0) {
      return res.status(404).json();
    }
    return res.status(200).json(deleteQuery); // Return deleted user
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// create
// read
// update
// delete

module.exports = {
  createPosts,
  updatePostById,
  getAllPosts,
  getPostById,
  deletePostById,
};
