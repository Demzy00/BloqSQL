const bcrypt = require("bcryptjs");
const conn = require("../db.config");
const utils = require("util");
const query = utils.promisify(conn.query).bind(conn);
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const signup = async (req, res) => {
  // console.log(req.body);
  const { name, age, email, password } = req.body;

  if (!name || !age || !email || !password) {
    return res.status(400).json({ msg: "Please fill all fields" });
  }

  try {
    const checkSql = "SELECT email FROM auths WHERE email = ?";
    const existingUser = await query(checkSql, [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const userSql = "INSERT INTO users (name, age) VALUES (?, ?)";
    const userResult = await query(userSql, [name, age]);
    console.log({ userResult });
    const userId = userResult.insertId;
    console.log(`This is userId: - ${userId}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const authSql =
      "INSERT INTO auths (email, password, userId) VALUES (?, ?, ?)";
    await query(authSql, [email, hashedPassword, userId]);

    return res.status(201).json({
      msg: "User created successfully!",
      userId,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      msg: "Server error ",
      error: err.message,
    });
  }
};

//     console.log(req.body);
//     const { name, age, email, password } = req.body;

//     if (!name || !email || !password || !age) {
//         res.status(401).json({ msg: 'fill all fields' })
//     }
//     try {

//         let sql = "SELECT email FROM auths WHERE email=?";
//         const theemail = await query(sql, [email]);
//         if (theemail.length > 0) return res.status(401).json({ msg: "user exist" })

//         let insertsql = "INSERT INTO users(name,age) VALUES (?,?)";
//         const user = await query(insertsql, [name, age])
//         console.log(user.insertId)
//         const hashed = await bcrypt.hash(password, 10)
//         const authsql = "INSERT INTO auths(email,password, userId) VALUES(?,?,?)"
//         const authquery = await query(authsql, [email, hashed, user.insertId])
//         return res.status(201).json({ msg: "created" });
//     } catch (err) {
//         return res.status(500).json(err.message)
//     }

// };

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const sql = "SELECT * FROM auths WHERE email = ?";
    const theemail = await query(sql, [email]);

    console.log(theemail);
    console.log("the email up");
    if (theemail.length === 0) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const auth = theemail[0];
    console.log(auth);

    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const userSql = "SELECT * FROM users WHERE id = ?";
    const userDetails = await query(userSql, [auth.userId]);
    console.log(userDetails);
    console.log("end of userDeatils");
    const fullUser = userDetails[0];
    console.log(fullUser);

    const token = jwt.sign(
      { userId: auth.userId, email: auth.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );

    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoicXVlZW5CRUVAZ21haWwuY29tIiwiaWF0IjoxNzYyNTIxNDI3LCJleHAiOjE3NjI1Mjg2Mjd9.mvIPzksPpnLAvcTPlV_FNwAfE6SpwKZ2JP_yiDVlWO8
    //R6WupIt2FyWueKWI2wpSiC01YXT9VKM5eTR4XjdcTBI
    res.cookie(token, process.env.ACCESS_TOKEN_SECRET, {
      httpOnly: true,
    });

    console.log("res cookie starting");
    console.log(res.cookie());
    return res.status(200).json({
      msg: "Signin successful",
      token,
      user: {
        email: auth.email,
        userId: auth.userId,
        name: fullUser?.name,
        age: fullUser?.age,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { signup, signin };

//get all
