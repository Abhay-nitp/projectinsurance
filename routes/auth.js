// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const router = express.Router();

// // User Registration
// router.post("/register", async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ msg: "User already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user = new User({ name, email, phone, password: hashedPassword });
//     await user.save();

//     res.status(201).json({ msg: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // User Login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });

//     res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const TempUser = require("../models/TempUser");
dotenv.config();


const router = express.Router();
const JWT_SECRET = "your_secret_key"; // Replace with a secure key

// @route   POST /api/auth/register
// @desc    Register a new user
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, phone, password, role } = req.body;

//     // Check if user already exists (by email or phone)
//     let user = await User.findOne({ $or: [{ email }, { phone }] });
//     if (user) return res.status(400).json({ message: "Email or Phone already exists" });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     user = new User({ name, email, phone, password: hashedPassword, role });
//     await user.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// });

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// router.post("/login", async (req, res) => {
//   try {
//     const { emailOrPhone, password } = req.body;

//     // Check if user exists by email or phone
//     const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });
//     if (!user) return res.status(400).json({ message: "Invalid Credentials" });

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "10h" });
//          res.cookie("jwt", token, {
//             httpOnly: true,
//             secure: true, // Set to true in production with HTTPS
//             sameSite: "Lax",
//             maxAge: 36000008, // 1 hour
//         });
//   //   res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
//   // }
//   res.json({ token,message: "Login successful", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
//     } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// });
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    console.log("🔍 Login attempt for:", emailOrPhone);

    const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(400).json({ message: "Invalid Credentials" });  // ✅ RETURN here
    }

    console.log("✅ User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("❌ Password does not match. Entered:", password, "Stored:", user.password);
      return res.status(400).json({ message: "Invalid Credentials" });  // ✅ RETURN here
    }

    console.log("✅ Password matched");

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "10h" });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure : true,
      sameSite: "None",
      maxAge: 10 * 60 * 60 * 1000, // 10 hours
    });

    return res.json({  // ✅ RETURN here
      token,
      message: "Login successful",
      role:user.role,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("🔥 Server error:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
});



const authenticateToken = (req, res, next) => {
  const token = req.cookies?.jwt; // ✅ Use optional chaining to prevent errors
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
  } catch (error) {
      res.status(401).json({ message: "Invalid token" });
  }
};


router.get("/me", authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: "Server Error" });
  }
});



router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "15m" });

       // const resetLink = `${process.env.CLIENT_URL}/reset-password.html?token=${token}`;
        //const nodemailer = require("nodemailer");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,  // Replace with your Gmail
                pass: process.env.EMAIL_PASS     // Replace with the 16-digit App Password
            }
        });
        
        //const resetLink = `http://localhost:5000/reset-password.html?token=${token}`;
        const resetLink = `${process.env.CLIENT_URL}/reset-password.html?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });

        res.json({ success: true, message: "Reset link sent!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Step 2: Reset Password
router.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (err) {
        res.status(400).json({ success: false, message: "Invalid or expired token" });
    }
});



router.get("/me", async (req, res) => {
    try {
        const token = req.cookies.jwt; // Read JWT from cookies
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) return res.status(401).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

// router.post("/logout", (req, res) => {
//   res.clearCookie("jwt", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "Strict",
//   });
  
//   res.json({ message: "Logged out successfully" });
// });
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", { 
      path: "/", 
      httpOnly: true, 
      sameSite: "None",  // ✅ Ensure sameSite matches the login cookie
      secure: true,  // ✅ Required if using HTTPS
  });

  return res.status(200).json({ message: "Logged out successfully" });
});




// @desc    Register a new user and send verification email
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        let tempUser = await TempUser.findOne({ email });
        if (tempUser) return res.status(400).json({ message: "Verification pending. Check your email." });

        const hashedPassword = await bcrypt.hash(password, 10);
 const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,  // Replace with your Gmail
                pass: process.env.EMAIL_PASS     // Replace with the 16-digit App Password
            }
        });
        tempUser = new TempUser({ name, email, phone, password: hashedPassword });
        await tempUser.save();

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

        const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email",
            html: `<h3>Hello ${name},</h3>
                   <p>Please verify your email by clicking the link below:</p>
                   <a href="${verificationLink}">Verify Email</a>
                   <p>This link expires in 1 hour.</p>`,
        });

        res.json({ message: "Registration successful! Check your email for verification." });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/auth/verify/:token
// @desc    Verify user email and move from TempUser to User collection
router.get("/verify/:token", async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, JWT_SECRET);
        const tempUser = await TempUser.findOne({ email: decoded.email });

        if (!tempUser) return res.status(404).json({ message: "Invalid or expired token" });

        // Move to permanent User collection
        const newUser = new User({
            name: tempUser.name,
            email: tempUser.email,
            phone: tempUser.phone,
            password: tempUser.password,
            verified: true,
        });

        await newUser.save();
        await TempUser.deleteOne({ email: decoded.email });

        res.send("<h3>Email verified successfully! You can now <a href='http://localhost:5500/login.html'>login</a>.</h3>");

    } catch (error) {
        console.error("Email verification error:", error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
});

module.exports = router;
