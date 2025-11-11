// MIDDLEWARE - Verify JWT Token (Authentication)
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const verifyToken = (req, res, next) => {
  try {
    // console.log(req.headers.cookie.split(";")[0].split("=")[0]);
    // console.log("end of req.cookie");
    // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJlbWFpbCI6IkVIVU5hamVAZ21haWwuY29tIiwiaWF0IjoxNzYyNTk3ODY3LCJleHAiOjE3NjI2MDUwNjd9.-dlWYwcWXEpFUDM1SUaSDxZMED9d8lIbDPzrxtzdDwo",

    const token = req.headers.cookie.split(";")[0].split("=")[0];
    console.log(token);
    if (!token) {
      //   req.user = null;
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." }); // No token found
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded);
    req.user = decoded;
    console.log("still in veri");

    next(); // Token is valid, proceed to the next middleware or route handler
  } catch (err) {
    // Token is invalid (e.g., expired, tampered)
    return res.status(403).json({ message: "Invalid or expired Token ." });
  }
};

module.exports = { verifyToken };
