const Expense = require("./../models/expenseModels");

// GET ALL
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE
exports.createExpense = async (req, res) => {
  try {
    const { description, amount, category, date, notes } = req.body;

    if (!description || !amount || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const expense = new Expense({
      description,
      amount: Number(amount), // ✅ FIX
      category,
      date: date ? new Date(date + "T00:00:00") : Date.now(), // ✅ FIX
      notes
    });

    const newExpense = await expense.save();

    res.status(201).json({
      success: true,
      data: newExpense // ✅ FIXED
    });

  } catch (error) {
    console.error("CREATE ERROR:", error); // 🔥 important
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    res.json({
      success: true,
      data: updatedExpense // ✅ IMPORTANT
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Not Found"
      });
    }

    res.json({
      success: true,
      message: "Deleted Successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};