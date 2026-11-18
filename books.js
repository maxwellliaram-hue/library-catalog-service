const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
const librarianOnly = [requireAuth, requireRole("librarian")];

// Catalog reads are public. Every catalog mutation requires a librarian.
router.get("/", async (_req, res, next) => {
  try {
    const books = await Book.find().populate("genre", "name slug");
    res.json({ books });
  } catch (error) { next(error); }
});

router.post("/", ...librarianOnly, async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ book });
  } catch (error) { next(error); }
});

router.put("/:id", ...librarianOnly, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid book id" });
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ book });
  } catch (error) { next(error); }
});

router.delete("/:id", ...librarianOnly, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid book id" });
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted", id: book._id });
  } catch (error) { next(error); }
});

module.exports = router;
