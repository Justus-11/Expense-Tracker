const express = require("express");
const router = express.Router();
const Income = require("../models/Income");

// GET ALL INCOME
router.get("/", async (req, res) => {
  try {
    const income = await Income.find().sort({ createdAt: -1 });
    res.json(income);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD INCOME
router.post("/", async (req, res) => {
  try {
    const { description, amount, category, date, notes } = req.body;

    if (!description || !amount || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const income = new Income({
      description,
      amount: Number(amount),
      category,
      date: date ? new Date(date + "T00:00:00") : Date.now(),
      notes,
    });

    const saved = await income.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE INCOME
router.put("/:id", async (req, res) => {
  try {
    const updated = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Income not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE INCOME
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Income.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Income not found" });
    res.json({ message: "Income deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;