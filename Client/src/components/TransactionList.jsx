import React, { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

function TransactionList({
  expenses,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  darkMode
}) {
  const [confirmId, setConfirmId] = useState(null);

  const categories = [
    "All",
    "Food",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Bills",
    "Healthcare",
    "Other"
  ];

  const filtered = expenses.filter((e) => {
    const description = e.description || "";
    const category = e.category || "";

    const matchesCategory =
      filterCategory === "All" || category === filterCategory;

    const matchesSearch = description
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className={`max-w-7xl mx-auto px-6 py-8 rounded-2xl shadow-lg transition-colors ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full md:w-1/3 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={`w-full md:w-1/3 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-gray-100"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr
              className={`text-sm uppercase ${
                darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr
                  key={e._id || e.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-2">
                    {e.date ? new Date(e.date).toLocaleDateString() : "-"}
                  </td>

                  <td className="px-4 py-2">{e.category || "-"}</td>

                  <td className="px-4 py-2">{e.description || "-"}</td>

                  <td className="px-4 py-2">
                    Ksh {(e.amount || 0).toLocaleString()}
                  </td>

                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(e)}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => setConfirmId(e._id || e.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 CONFIRMATION MODAL */}
      {confirmId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className={`w-[90%] max-w-md p-6 rounded-2xl shadow-xl transition ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-lg font-semibold mb-3">
              Confirm Deletion
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onDelete(confirmId);
                  setConfirmId(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionList;