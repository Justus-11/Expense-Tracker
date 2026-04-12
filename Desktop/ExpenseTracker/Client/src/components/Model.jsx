import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function Model({ editingExpense, onSave, onClose, darkMode }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: ""
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        description: editingExpense.description || "",
        amount: editingExpense.amount || "",
        category: editingExpense.category || "",
        date: editingExpense.date
          ? editingExpense.date.split("T")[0] // 👈 fix date format
          : ""
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0] // 👈 default today
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      toast.error("Please fill in all fields!");
      return;
    }

    const expenseData = {
      ...formData,
      amount: Number(formData.amount), // 👈 fix backend crash
      id: editingExpense ? editingExpense._id : Date.now()
    };

    onSave(expenseData);
    toast.success(editingExpense ? "Expense updated!" : "Expense added!");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
      <div
        className={`w-[400px] p-6 rounded-2xl shadow-2xl ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-5 text-center">
          {editingExpense ? "Edit Expense" : "Add Expense"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm opacity-80">Description</label>
            <input
              type="text"
              name="description" // ✅ FIXED
              placeholder="e.g. Lunch"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 ${
                darkMode
                  ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                  : "bg-gray-100 border-gray-300 focus:ring-blue-400"
              }`}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1 text-sm opacity-80">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 ${
                darkMode
                  ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                  : "bg-gray-100 border-gray-300 focus:ring-blue-400"
              }`}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 text-sm opacity-80">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 ${
                darkMode
                  ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                  : "bg-gray-100 border-gray-300 focus:ring-blue-400"
              }`}
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 text-sm opacity-80">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 ${
                darkMode
                  ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                  : "bg-gray-100 border-gray-300 focus:ring-blue-400"
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingExpense ? "Save Changes" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Model;