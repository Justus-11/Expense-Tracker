const express = require("express");
const cors = require("cors");

const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/v2/expense", expenseRoutes);
app.use("/api/v2/income", incomeRoutes);

module.exports = app;