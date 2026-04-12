import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function SpendingChart({ expenses = [], darkMode }) {
  const data = useMemo(() => {
    if (!expenses.length) return [];

    return [...expenses]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
        amount: Number(item.amount),
      }));
  }, [expenses]);

  if (!data.length) {
    return (
      <div
        className={`p-6 rounded-xl shadow-md text-center transition-colors ${
          darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-500"
        }`}
      >
        <p className="text-sm">No spending data available yet.</p>
      </div>
    );
  }

  return (
    <div
      className={`p-5 rounded-xl shadow-lg transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Spending Overview</h2>
        <span className="text-xs opacity-60">Last transactions trend</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={darkMode ? "#374151" : "#e5e7eb"}
          />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke={darkMode ? "#d1d5db" : "#6b7280"}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            stroke={darkMode ? "#d1d5db" : "#6b7280"}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#111827" : "#ffffff",
              borderRadius: "8px",
              border: "none",
            }}
            labelStyle={{ fontWeight: "bold" }}
          />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpendingChart;