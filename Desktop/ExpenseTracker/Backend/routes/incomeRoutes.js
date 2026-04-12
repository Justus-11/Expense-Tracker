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
    const income = new Income(req.body);
    const saved = await income.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE INCOME
router.delete("/:id", async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;