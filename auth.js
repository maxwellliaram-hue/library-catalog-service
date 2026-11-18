const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const COOKIE_NAME = "token";
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 1000,
});

function issueToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) return res.status(400).json({ message: "username, email and password are required" });
    if (typeof password !== "string" || password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedUsername = String(username).trim();
    const existing = await User.findOne({ $or: [{ email: normalizedEmail }, { username: normalizedUsername }] });
    if (existing) return res.status(409).json({ message: "Username or email is already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ username: normalizedUsername, email: normalizedEmail, password: hashedPassword, role: "patron" });
    return res.status(201).json({ message: "Account created", user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Username or email is already registered" });
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, username, password } = req.body || {};
    const identity = String(email || username || "").trim();
    if (!identity || !password) return res.status(400).json({ message: "Email/username and password are required" });
    const user = await User.findOne({ $or: [{ email: identity.toLowerCase() }, { username: identity }] }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid credentials" });

    const token = issueToken(user);
    res.cookie(COOKIE_NAME, token, cookieOptions());
    return res.json({ message: "Login successful", user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    return next(error);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/" });
  return res.json({ message: "Logged out; authentication cookie cleared" });
});

module.exports = router;
