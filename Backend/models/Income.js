const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: "Other",
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);