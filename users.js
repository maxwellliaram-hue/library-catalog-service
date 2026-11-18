const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/profile", requireAuth, (req, res) => {
  // User identity is derived from the verified token, never request parameters.
  res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role } });
});

module.exports = router;
