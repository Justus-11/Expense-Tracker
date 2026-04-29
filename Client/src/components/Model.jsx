import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Healthcare",
  "Other",
];

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Rental",
  "Gift",
  "Refund",
  "Other",
];

// ✅ Returns today's date as YYYY-MM-DD using LOCAL time (not UTC)
// Fixes the "date saved as day before" bug caused by toISOString() using UTC
const getLocalDateString = () => {
  const now = new Date();
  const year  = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day   = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function Model({ editingExpense, onSave, onClose, darkMode }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: getLocalDateString(), // ✅ local date, not UTC
    type: "expense",
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        description: editingExpense.description || "",
        amount: editingExpense.amount || "",
        category: editingExpense.category || "",
        date: editingExpense.date || getLocalDateString(),
        type: editingExpense.type || "expense",
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: getLocalDateString(), // ✅ local date, not UTC
        type: "expense",
      });
    }
  }, [editingExpense]);

  const handleTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      type: e.target.value,
      category: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      toast.error("Please fill all fields");
      return;
    }

    const data = { ...formData, amount: Number(formData.amount) };
    onSave(data);
  };

  const isIncome  = formData.type === "income";
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const inputClass = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400"
  }`;

  const labelClass = "block text-xs font-medium opacity-60 mb-1";

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
      <div
        className={`w-[420px] rounded-2xl shadow-2xl overflow-hidden ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className={`h-1 w-full ${isIncome ? "bg-indigo-500" : "bg-rose-500"}`} />

        <div className="p-6">
          <h2 className="text-lg font-semibold mb-5 text-center">
            {editingExpense ? "Edit Transaction" : "Add Transaction"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* TYPE TOGGLE */}
            <div
              className={`flex rounded-xl overflow-hidden border ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              {["expense", "income"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTypeChange({ target: { value: t } })}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    formData.type === t
                      ? t === "income"
                        ? "bg-indigo-600 text-white"
                        : "bg-rose-500 text-white"
                      : darkMode
                      ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className={labelClass}>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={isIncome ? "e.g. Monthly Salary" : "e.g. Grocery Shopping"}
                className={inputClass}
              />
            </div>

            {/* AMOUNT */}
            <div>
              <label className={labelClass}>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={inputClass}
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className={labelClass}>
                Category{" "}
                <span
                  className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    isIncome
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {isIncome ? "Income" : "Expense"}
                </span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`flex-1 py-2 rounded-xl text-sm font-semibold text-white transition ${
                  isIncome
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-rose-500 hover:bg-rose-600"
                }`}
              >
                {editingExpense
                  ? "Save Changes"
                  : `Add ${isIncome ? "Income" : "Expense"}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Model;