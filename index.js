const express = require("express");

const authroutes = require("./routes/auth.routes");
const userroutes = require("./routes/user.routes");
const postroutes = require("./routes/post.routes");
const commentroutes = require("./routes/comment.routes");

const conn = require("./db.config");
const app = express();
app.use(express.json());
app.use("/api/auth/", authroutes);
app.use("/api/users/", userroutes);
app.use("/api/posts/", postroutes);
app.use("/api/comments/", commentroutes);

// app.post("/api/upload", (req, res) => {
//   res.send("Uploaded successfully!");
// });

conn.connect((err, result) => {
  if (err) return err.message;
  console.log("connected");
  // console.log(result);
});

app.get("/", async (req, res) => {
  res.send("<h1>Welcome</h1>");
});
app.listen(5001, () => {
  console.log(`listening to port 5001`);
});
