// const jwt = require("jsonwebtoken");
// const JWT_SECRET = "your_secret_key"; // Same secret key used in login

// module.exports = (req, res, next) => {
//   const token = req.header("Authorization");
  
//   if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

//   try {
//     const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid Token" });
//   }
// };
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key"; // Use the same secret key as in login

module.exports = (req, res, next) => {
  let token = req.header("Authorization");

  // If no token in headers, check cookies
  if (!token && req.cookies?.jwt) {
    token = `Bearer ${req.cookies.jwt}`; // Format to match header-based token
  }

  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
