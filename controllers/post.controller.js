const conn = require("../db.config");
const utils = require("util");
const query = utils.promisify(conn.query).bind(conn);

const createPosts = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    console.log(req.user);
    const userId = req.user.userId;
    console.log("below is req.file");
    console.log(req.file);
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
  // console.log(req);

  // const theinputfields =
  //   "SELECT * FROM Posts WHERE title = ? AND content = ? AND image = ?";
  // const inputfields = await query(theinputfields, [title, content, image]);
  // // console.log(`This is input length.- ${inputfields.length}`);
  // if (inputfields.length === 0) {
  //   return res.status(400).json({ msg: "Please fill all fields" });
  // }

  // const thetitle = "SELECT email FROM Posts WHERE title = ? ";
  // const existingTitle = await query(thetitle, [title]);

  // if (existingTitle.length > 0) {
  //   return res.status(400).json({ msg: "post already exist" });
  // }
  // const theslug = "SELECT email FROM Posts WHERE slug = ? ";
  // const existingslug = await query(theslug, [slug]);

  // if (existingslug.length > 0) {
  //   return res.status(400).json({ msg: "post already exist" });
  // }
  // const postSql = "INSERT INTO Posts (title, content, image) VALUES (?, ?, ?)";
  // const postResult = await query(postSql, [title, content, image]);
  // console.log(`this is the post: ${post}`);
  // postId = postResult.insertId;
};

const editPost = async (req, res) => {
  // const {id } = req.body
  return console.log(req.body);

  // check if post doesn't exist
  // const slugSql = "SELECT * FROM Posts WHERE slug = ?";
  // const slugQuery = await query(slugSql, [slug]);
  // if (slugQuery.length > 0) {
  //   return res.status(400).json({ msg: "Post already exists" });
  // }
};

module.exports = { createPosts, editPost };
