const express = require("express");
const expenseController = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware"); // 👈 NEW

const router = express.Router();

// All expense routes are protected — user must be logged in
router.use(protect); // 👈 applies to every route below

router
  .get("/", expenseController.getAllExpenses)
  .post("/", expenseController.createExpense);

router
  .put("/:id", expenseController.updateExpense)
  .delete("/:id", expenseController.deleteExpense);

module.exports = router;