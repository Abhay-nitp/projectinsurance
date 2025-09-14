const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/protected
// @desc    Example protected route
router.get("/", authMiddleware, (req, res) => {
  res.json({ message: `Welcome, user ID: ${req.user.id}` });
});

module.exports = router;
