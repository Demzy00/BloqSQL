const conn = require("../db.config");
const utils = require("util");
const query = utils.promisify(conn.query).bind(conn);

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { name, email, content } = req.body;

    if (!name || !email || !content) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    console.log(req.user);
    const userId = !req.user ? null : req.user.userId;

    const postCheck = "SELECT * FROM posts WHERE id=?";
    const postQuery = await query(postCheck, [postId]);

    if (postQuery.length === 0) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const commentSql =
      "INSERT INTO comments (name, email, content, userId, postId) VALUES (?, ?,?, ?,?)";
    const commentQuery = await query(commentSql, [
      name,
      email,
      content,
      userId,
      postId,
    ]);
    return res.status(200).json(commentQuery);
  } catch (error) {
    console.error(" error in addcomment:", error.message);
    return res.status(500).json(error.message);
  }
};

const editComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // check
  const commentSql = "SELECT * FROM comments WHERE id = ?";
  const commentQuery = await query(commentSql, [id]);

  if (commentQuery === 0) {
    return res.status(404).json({ msg: "Comment not found" });
  } else {
    const updateComment = "UPDATE comments SET content = ?";
    const updateQuery = await query(updateComment, [content]);
    return res.status(404).json(updateQuery);
  }
};

module.exports = { addComment, editComment };
