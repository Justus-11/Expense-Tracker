import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const EXPENSE_COLORS = {
  Food: "#22c55e",
  Transportation: "#3b82f6",
  Entertainment: "#f97316",
  Shopping: "#ef4444",
  Bills: "#a855f7",
  Healthcare: "#06b6d4",
  Other: "#64748b",
};

const INCOME_COLORS = {
  Salary: "#10b981",
  Freelance: "#6366f1",
  Business: "#f59e0b",
  Investments: "#3b82f6",
  Rental: "#ec4899",
  Gift: "#14b8a6",
  Refund: "#84cc16",
  Other: "#64748b",
};

const CustomTooltip = ({ active, payload, darkMode }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div
        className={`px-3 py-2 rounded-xl shadow-lg text-sm ${
          darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800 border border-gray-100"
        }`}
      >
        <p className="font-semibold">{item.name}</p>
        <p className="text-xs opacity-70">KSh {item.value.toLocaleString()}</p>
        <p className="text-xs opacity-70">{item.percent.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

function buildChartData(expenses, mode) {
  const colorMap = mode === "income" ? INCOME_COLORS : EXPENSE_COLORS;
  const filtered = expenses.filter((e) => e.type === mode);
  const grouped = {};
  filtered.forEach((item) => {
    const name = item.category || "Other";
    grouped[name] = (grouped[name] || 0) + Number(item.amount || 0);
  });
  const total = Object.values(grouped).reduce((s, v) => s + v, 0) || 1;
  return {
    data: Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
      percent: (value / total) * 100,
      color: colorMap[name] || "#94a3b8",
    })),
    total: Object.values(grouped).reduce((s, v) => s + v, 0),
  };
}

export default function CategoryChart({ expenses = [], darkMode = false }) {
  const [mode, setMode] = useState("expense"); // "expense" | "income"

  const { data, total } = useMemo(
    () => buildChartData(expenses, mode),
    [expenses, mode]
  );

  const isIncome = mode === "income";

  return (
    <div
      className={`p-5 rounded-2xl shadow-sm border transition-all ${
        darkMode
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-gray-900 border-gray-100"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-base font-semibold">Category Breakdown</h2>
          <p className="text-xs opacity-50 mt-0.5">
            {isIncome ? "Where your money comes from" : "Where your money goes"}
          </p>
        </div>

        {/* Toggle */}
        <div
          className={`flex rounded-xl overflow-hidden border text-xs font-medium ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          {["expense", "income"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 transition-colors ${
                mode === m
                  ? m === "income"
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white"
                  : darkMode
                  ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Total pill */}
      <div className="flex justify-end mb-3">
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${
            isIncome
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          Total: KSh {total.toLocaleString()}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 opacity-40">
          <p className="text-sm">No {mode} data available</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Donut Chart — minWidth:0 prevents negative size in grid/flex */}
          <div style={{ minWidth: 0, width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar list */}
          <div className="space-y-3">
            {data.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="opacity-60">
                    KSh {item.value.toLocaleString()} · {item.percent.toFixed(1)}%
                  </span>
                </div>
                <div
                  className={`w-full h-1.5 rounded-full overflow-hidden ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: item.color,
                    }}
                    className="h-full rounded-full transition-all duration-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      {data.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2.5 text-xs">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="opacity-70">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}