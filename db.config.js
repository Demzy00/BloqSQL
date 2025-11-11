const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  database: "blog_sql",
  user: "root",
  password: "",
});

module.exports = conn;
