import React, { useEffect, useState } from "react";
import { Plus, Moon, Sun } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SpendingChart from "./components/SpendingChart";
import CategoryChart from "./components/CategoryChart";
import TransactionList from "./components/TransactionList";
import Model from "./components/Model";
import StatCard from "./components/StatCard";
import Sidebar from "./components/Sidebar";

import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  fetchIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} from "./api";

// ── CURRENCIES ────────────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "KES", symbol: "KSh", label: "Kenyan Shilling" },
  { code: "USD", symbol: "$",   label: "US Dollar" },
  { code: "EUR", symbol: "€",   label: "Euro" },
  { code: "GBP", symbol: "£",   label: "British Pound" },
  { code: "NGN", symbol: "₦",   label: "Nigerian Naira" },
  { code: "GHS", symbol: "₵",   label: "Ghanaian Cedi" },
  { code: "ZAR", symbol: "R",   label: "South African Rand" },
  { code: "UGX", symbol: "USh", label: "Ugandan Shilling" },
  { code: "TZS", symbol: "TSh", label: "Tanzanian Shilling" },
  { code: "INR", symbol: "₹",   label: "Indian Rupee" },
  { code: "JPY", symbol: "¥",   label: "Japanese Yen" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$",  label: "Australian Dollar" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
];

// ── DATE HELPER ───────────────────────────────────────────────────────────────
// Converts any date string/object → YYYY-MM-DD using LOCAL time
// Prevents the UTC midnight → day-before shift in EAT (UTC+3) and other timezones
const formatDate = (rawDate) => {
  const d = new Date(rawDate);
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day   = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function App() {
  const [expenses, setExpenses]             = useState([]);
  const [incomeList, setIncomeList]         = useState([]);
  const [isModelOpen, setModelOpen]         = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [darkMode, setDarkMode]             = useState(false);
  const [activePage, setActivePage]         = useState("Dashboard");
  const [currency, setCurrency]             = useState(CURRENCIES[0]);

  // ── NORMALIZE ───────────────────────────────────────────────────────────────
  // Handles both Income (source field) and Expense (description field) shapes
  const normalize = (e, type = "expense") => ({
    _id: e._id,
    description: e.description || e.source || e.name || "No description",
    amount: Number(e.amount || 0),
    category: (e.category || "Other").trim(),
    date: e.date ? formatDate(e.date) : "",
    type,
  });

  // ── LOAD DATA ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const [expData, incData] = await Promise.all([
          fetchExpenses(),
          fetchIncome(),
        ]);
        setExpenses(expData.map((e) => normalize(e, "expense")));
        setIncomeList(incData.map((i) => normalize(i, "income")));
      } catch {
        toast.error("Failed to load data");
      }
    };
    loadData();
  }, []);

  // ── DERIVED VALUES ──────────────────────────────────────────────────────────
  const totalIncome   = incomeList.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance       = totalIncome - totalExpenses;

  const allTransactions = [...expenses, ...incomeList].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // ── ADD ─────────────────────────────────────────────────────────────────────
  const handleAddTransaction = async (data) => {
    try {
      if (data.type === "income") {
        const saved = await createIncome(data);
        if (!saved?._id) throw new Error("No data returned from server");
        setIncomeList((prev) => [normalize(saved, "income"), ...prev]);
      } else {
        const saved = await createExpense(data);
        if (!saved?._id) throw new Error("No data returned from server");
        setExpenses((prev) => [normalize(saved, "expense"), ...prev]);
      }
      toast.success("Transaction added!");
      setModelOpen(false);
      setEditingExpense(null);
    } catch (err) {
      toast.error("Failed to add transaction");
      console.error("handleAddTransaction error:", err);
    }
  };

  // ── EDIT ────────────────────────────────────────────────────────────────────
  const handleEdit = (item) => {
    setEditingExpense(item);
    setModelOpen(true);
  };

  const handleUpdateTransaction = async (data) => {
    try {
      if (data.type === "income") {
        const saved = await updateIncome(editingExpense._id, data);
        if (!saved?._id) throw new Error("No data returned from server");
        setIncomeList((prev) =>
          prev.map((i) =>
            i._id === editingExpense._id ? normalize(saved, "income") : i
          )
        );
      } else {
        const saved = await updateExpense(editingExpense._id, data);
        if (!saved?._id) throw new Error("No data returned from server");
        setExpenses((prev) =>
          prev.map((e) =>
            e._id === editingExpense._id ? normalize(saved, "expense") : e
          )
        );
      }
      toast.success("Transaction updated!");
      setModelOpen(false);
      setEditingExpense(null);
    } catch (err) {
      toast.error("Update failed");
      console.error("handleUpdateTransaction error:", err);
    }
  };

  const handleSave = (data) => {
    if (editingExpense) {
      handleUpdateTransaction(data);
    } else {
      handleAddTransaction(data);
    }
  };

  // ── DELETE ──────────────────────────────────────────────────────────────────
  const handleDelete = async (item) => {
    try {
      if (item.type === "income") {
        await deleteIncome(item._id);
        setIncomeList((prev) => prev.filter((i) => i._id !== item._id));
      } else {
        await deleteExpense(item._id);
        setExpenses((prev) => prev.filter((e) => e._id !== item._id));
      }
      toast.success("Deleted!");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ── SPARKLINES (last 7 entries each) ────────────────────────────────────────
  const incomeSparkline  = incomeList.slice(-7).map((i) => i.amount);
  const expenseSparkline = expenses.slice(-7).map((e) => e.amount);
  const balanceSparkline = allTransactions
    .slice(-7)
    .map((t) => (t.type === "income" ? t.amount : -t.amount));

  // ── SHARED STAT CARDS ───────────────────────────────────────────────────────
  const StatCards = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Income"
        value={totalIncome}
        type="income"
        darkMode={darkMode}
        sparkline={incomeSparkline}
        trend={{ value: 8.2, label: "vs last month" }}
        prefix={currency.symbol}
      />
      <StatCard
        title="Expenses"
        value={totalExpenses}
        type="expense"
        darkMode={darkMode}
        sparkline={expenseSparkline}
        trend={{ value: -3.1, label: "vs last month" }}
        prefix={currency.symbol}
      />
      <StatCard
        title="Balance"
        value={balance}
        type="balance"
        darkMode={darkMode}
        sparkline={balanceSparkline}
        prefix={currency.symbol}
      />
      <StatCard
        title="Transactions"
        value={allTransactions.length}
        type="default"
        darkMode={darkMode}
        prefix=""
      />
    </div>
  );

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* SIDEBAR */}
      <Sidebar
        active={activePage}
        setActive={setActivePage}
        darkMode={darkMode}
      />

      <div className="flex-1 overflow-auto">

        {/* HEADER */}
        <div
          className={`flex justify-between items-center px-6 py-4 border-b sticky top-0 z-10 ${
            darkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-gray-50 border-gray-100"
          }`}
        >
          <h1 className="text-xl font-bold">{activePage}</h1>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-100 shadow-sm"
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setEditingExpense(null);
                setModelOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition"
            >
              <Plus className="w-4 h-4" /> Add Transaction
            </button>
          </div>
        </div>

        {/* ── DASHBOARD ─────────────────────────────────────────────────────── */}
        {activePage === "Dashboard" && (
          <div className="p-6 space-y-5">
            <StatCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SpendingChart transactions={allTransactions} darkMode={darkMode} />
              <CategoryChart expenses={allTransactions} darkMode={darkMode} />
            </div>

            {/* Recent 5 — full array + limit={5}, no .slice() in parent */}
            <TransactionList
              expenses={allTransactions}
              onDelete={handleDelete}
              onEdit={handleEdit}
              darkMode={darkMode}
              limit={5}
              currency={currency.symbol}
            />
          </div>
        )}

        {/* ── TRANSACTIONS ──────────────────────────────────────────────────── */}
        {activePage === "Transactions" && (
          <div className="p-6">
            {/* No limit → full paginated list */}
            <TransactionList
              transactions={allTransactions}
              onDelete={handleDelete}
              onEdit={handleEdit}
              darkMode={darkMode}
              currency={currency.symbol}
            />
          </div>
        )}

        {/* ── ANALYTICS ─────────────────────────────────────────────────────── */}
        {activePage === "Analytics" && (
          <div className="p-6 space-y-5">
            <StatCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SpendingChart transactions={allTransactions} darkMode={darkMode} />
              <CategoryChart expenses={allTransactions} darkMode={darkMode} />
            </div>
          </div>
        )}

        {/* ── SETTINGS ──────────────────────────────────────────────────────── */}
        {activePage === "Settings" && (
          <div className="p-6">
            <div
              className={`rounded-2xl border p-6 space-y-2 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <h2 className="text-base font-semibold mb-4">Preferences</h2>

              {/* Dark mode toggle */}
              <div
                className={`flex items-center justify-between py-3 border-b ${
                  darkMode ? "border-gray-700" : "border-gray-100"
                }`}
              >
                <span className="text-sm">Dark Mode</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    darkMode ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      darkMode ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Currency selector */}
              <div className="py-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Currency</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                      darkMode
                        ? "bg-indigo-900 text-indigo-300"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {currency.symbol} — {currency.code}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setCurrency(c)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition ${
                        currency.code === c.code
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold"
                          : darkMode
                          ? "border-gray-600 hover:border-gray-400 text-gray-300"
                          : "border-gray-200 hover:border-gray-400 text-gray-700"
                      }`}
                    >
                      <span className="w-6 text-center text-base">{c.symbol}</span>
                      <span className="text-xs">{c.code}</span>
                    </button>
                  ))}
                </div>

                <p className={`mt-3 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Selected: {currency.label}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL */}
      {isModelOpen && (
        <Model
          editingExpense={editingExpense}
          onClose={() => {
            setModelOpen(false);
            setEditingExpense(null);
          }}
          onSave={handleSave}
          darkMode={darkMode}
        />
      )}

      <ToastContainer
        position="bottom-right"
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default App;