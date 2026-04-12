import React, { useEffect, useState } from "react";
import {
  Plus,
  DollarSign,
  TrendingUp,
  Wallet,
  ShoppingCart,
  Moon,
  Sun,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SpendingChart from "./components/SpendingChart";
import CategoryChart from "./components/CategoryChart";
import TransactionList from "./components/TransactionList";
import Model from "./components/Model";
import StatCard from "./components/StatCard";
import IncomeHistory from "./components/IncomeHistory";
import IncomeModel from "./components/IncomeModel";

import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  fetchIncome,
  createIncome,
} from "./api";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [incomeList, setIncomeList] = useState([]);

  const [isModelOpen, setModelOpen] = useState(false);
  const [isIncomeOpen, setIncomeOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  // ---------------- NORMALIZER ----------------
  const normalize = (e) => ({
    _id: e._id,
    description: e.description || e.name || "No description",
    amount: Number(e.amount || 0),
    category: (e.category || "Other").trim(),
    date: e.date ? e.date.split("T")[0] : "",
  });

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const [expData, incData] = await Promise.all([
          fetchExpenses(),
          fetchIncome(),
        ]);

        setExpenses(expData.map(normalize));
        setIncomeList(incData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      }
    };

    loadData();
  }, []);

  // ---------------- CALCULATIONS ----------------
  const totalIncome = incomeList.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const balance = totalIncome - totalExpenses;

  // ---------------- INCOME ----------------
  const handleAddIncome = async (data) => {
    try {
      const saved = await createIncome(data);
      setIncomeList((prev) => [saved, ...prev]);

      toast.success("Income added!");
      setIncomeOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add income");
    }
  };

  // ---------------- EXPENSE ----------------
  const handleAddExpense = async (payload) => {
    try {
      const created = await createExpense(payload);
      setExpenses((prev) => [normalize(created), ...prev]);

      toast.success("Expense added!");
    } catch (error) {
      console.error(error);
      toast.error("Add failed");
    }
  };

  const onEdit = (expense) => {
    setEditingExpense(expense);
    setModelOpen(true);
  };

  const handleSaveEdit = async (payload) => {
    try {
      const updated = await updateExpense(editingExpense._id, payload);

      setExpenses((prev) =>
        prev.map((e) =>
          e._id === updated._id ? normalize(updated) : e
        )
      );

      setEditingExpense(null);
      setModelOpen(false);

      toast.success("Updated!");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));

      toast.success("Deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // ---------------- FILTER ----------------
  const filteredExpenses = expenses.filter((e) => {
    const matchCategory =
      filterCategory === "All" || e.category === filterCategory;

    const matchSearch = e.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  // ---------------- UI ----------------
  return (
    <div
      className={`min-h-screen transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className={darkMode ? "bg-gray-800" : "bg-white shadow"}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>

          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200"
            >
              {darkMode ? <Sun /> : <Moon />}
            </button>

            <button
              onClick={() => setIncomeOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              + Income
            </button>

            <button
              onClick={() => {
                setEditingExpense(null);
                setModelOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus /> Add Expense
            </button>
          </div>
        </div>
      </div>


      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        <StatCard icon={Wallet} title="Income" value={totalIncome} subtitle="Total income" bgColor="bg-green-600" iconColor="bg-green-300" />
        <StatCard icon={ShoppingCart} title="Expenses" value={totalExpenses} subtitle="Total spent" bgColor="bg-red-600" iconColor="bg-red-300" />
        <StatCard icon={DollarSign} title="Balance" value={balance} subtitle="Remaining money" bgColor="bg-blue-600" iconColor="bg-blue-300" />
        <StatCard icon={TrendingUp} title="Transactions" value={expenses.length} subtitle="All expenses" bgColor="bg-purple-600" iconColor="bg-purple-300" />
      </div>

      {/* CHARTS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 px-6 pb-6">
        <div className="lg:col-span-3">
          <SpendingChart expenses={filteredExpenses} darkMode={darkMode} />
        </div>

        <div className="lg:col-span-2">
          <CategoryChart expenses={filteredExpenses} darkMode={darkMode} />
        </div>
      </div>

      {/* INCOME HISTORY */}
      <IncomeHistory incomeList={incomeList} darkMode={darkMode} />

      {/* TRANSACTIONS */}
      <TransactionList
        expenses={filteredExpenses}
        onEdit={onEdit}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        darkMode={darkMode}
      />

      {/* MODALS */}
      {isModelOpen && (
        <Model
          editingExpense={editingExpense}
          onClose={() => setModelOpen(false)}
          onSave={editingExpense ? handleSaveEdit : handleAddExpense}
        />
      )}

      {isIncomeOpen && (
        <IncomeModel
          darkMode={darkMode}
          onClose={() => setIncomeOpen(false)}
          onSave={handleAddIncome}
        />
      )}

      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;