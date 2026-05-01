import React, { useState, useMemo } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  Edit2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

const DATE_OPTIONS = [
  { label: "All time",   value: "all" },
  { label: "Today",      value: "today" },
  { label: "This week",  value: "week" },
  { label: "This month", value: "month" },
];

const TYPE_OPTIONS = [
  { label: "All",     value: "all" },
  { label: "Income",  value: "income" },
  { label: "Expense", value: "expense" },
];

const PAGE_SIZE = 10;

function filterByDate(transactions, filter) {
  if (filter === "all") return transactions;
  const now = new Date();
  return transactions.filter((t) => {
    const d = new Date(t.date);
    if (filter === "today") return d.toDateString() === now.toDateString();
    if (filter === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d >= weekAgo;
    }
    if (filter === "month") {
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });
}

function TransactionList({
  expenses = [],
  onDelete,
  onEdit,
  darkMode = false,
  limit = null,
  currency = "KSh",
}) {
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);

  // ── Delete confirm dialog state ───────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDateFilter = (val) => { setDateFilter(val); setPage(1); };
  const handleTypeFilter = (val) => { setTypeFilter(val); setPage(1); };
  const handleSearch     = (val) => { setSearch(val);     setPage(1); };

  const requestDelete = (item) => setDeleteTarget(item);
  const confirmDelete = () => {
    if (deleteTarget) onDelete(deleteTarget);
    setDeleteTarget(null);
  };

  // Base filtered list: date + search only (no type filter)
  const baseFiltered = useMemo(() => {
    let list = filterByDate(expenses, dateFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [expenses, dateFilter, search]);

  const totalIncome = useMemo(
    () =>
      baseFiltered
        .filter((t) => t.type?.toLowerCase() === "income")
        .reduce((s, t) => s + Number(t.amount), 0),
    [baseFiltered]
  );
  const totalExpense = useMemo(
    () =>
      baseFiltered
        .filter((t) => t.type?.toLowerCase() === "expense")
        .reduce((s, t) => s + Number(t.amount), 0),
    [baseFiltered]
  );

  const filtered = useMemo(() => {
    if (typeFilter === "all") return baseFiltered;
    return baseFiltered.filter(
      (t) => t.type?.toLowerCase() === typeFilter
    );
  }, [baseFiltered, typeFilter]);

  const paginated = useMemo(() => {
    if (limit !== null) return filtered.slice(0, limit);
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page, limit]);

  const totalPages =
    limit !== null ? 1 : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const base = darkMode
    ? "bg-gray-800 text-white border-gray-700"
    : "bg-white text-gray-900 border-gray-100";

  // ── Shared select class ───────────────────────────────────────────────────
  const selectClass = `outline-none cursor-pointer ${
    darkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-700"
  }`;

  return (
    <>
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${base}`}>

        {/* ── Header ── */}
        <div className={`px-5 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold">Transactions</h2>
              <p className="text-xs opacity-50 mt-0.5">
                {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                +{currency} {totalIncome.toLocaleString()}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 font-medium">
                -{currency} {totalExpense.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ── Filters ── */}
          <div className="flex gap-2 flex-wrap">
            {/* Search */}
            <div className={`flex items-center gap-2 flex-1 min-w-[140px] px-3 py-1.5 rounded-xl border text-sm ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-700"
            }`}>
              <Search size={13} className="opacity-40 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search transactions..."
                className="bg-transparent outline-none text-xs w-full placeholder:opacity-40"
              />
            </div>

            {/* Type filter */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-700"
            }`}>
              <select
                value={typeFilter}
                onChange={(e) => handleTypeFilter(e.target.value)}
                className={selectClass}
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Date filter */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-700"
            }`}>
              <Filter size={12} className="opacity-40" />
              <select
                value={dateFilter}
                onChange={(e) => handleDateFilter(e.target.value)}
                className={selectClass}
              >
                {DATE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── List ── */}
        <div>
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 opacity-40">
              <p className="text-sm">No transactions found</p>
            </div>
          ) : (
            paginated.map((item) => {
              const isIncome = item.type?.toLowerCase() === "income";
              return (
                <div
                  key={item._id || item.id}
                  className={`flex justify-between items-center px-5 py-3.5 border-b last:border-b-0 transition-colors group ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-50 hover:bg-gray-50"
                  }`}
                >
                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full flex-shrink-0 ${
                      isIncome ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
                    }`}>
                      {isIncome ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                    </div>

                    <div>
                      <p className="text-sm font-medium leading-tight">{item.description}</p>
                      <p className="text-xs opacity-50 mt-0.5">
                        {item.date}{item.category && ` · ${item.category}`}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>
                        {isIncome ? "+" : "-"}{currency} {Number(item.amount).toLocaleString()}
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        isIncome ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      }`}>
                        {isIncome ? "Income" : "Expense"}
                      </span>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => requestDelete(item)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Pagination ── */}
        {limit === null && totalPages > 1 && (
          <div className={`flex items-center justify-between px-5 py-3 border-t text-xs ${
            darkMode ? "border-gray-700 text-gray-400" : "border-gray-100 text-gray-500"
          }`}>
            <span>Page {page} of {totalPages} · {filtered.length} total</span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`p-1.5 rounded-lg transition disabled:opacity-30 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-1 self-center">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs transition ${
                        page === p
                          ? "bg-indigo-600 text-white"
                          : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`p-1.5 rounded-lg transition disabled:opacity-30 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete confirmation dialog ── */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        darkMode={darkMode}
        variant="danger"
        title="Delete this transaction?"
        message={
          deleteTarget
            ? `"${deleteTarget.description}" will be permanently removed. This cannot be undone.`
            : "This transaction will be permanently removed."
        }
        confirmText="Yes, delete"
        cancelText="Keep it"
      />
    </>
  );
}

export default TransactionList;