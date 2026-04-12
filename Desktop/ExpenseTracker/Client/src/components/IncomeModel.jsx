import React, { useState, useEffect } from "react";

function IncomeModel({ onClose, onSave, darkMode }) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) return;

    onSave({
      amount: Number(amount),
      source: source || "Income",
    });

    setAmount("");
    setSource("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`w-full max-w-md p-6 rounded-xl shadow-lg ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Add Income</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="text-sm font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter income amount"
              className={`w-full p-2 rounded border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>

          {/* Source */}
          <div>
            <label className="text-sm font-medium">Source</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Salary, Business, etc"
              className={`w-full p-2 rounded border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-400 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IncomeModel;