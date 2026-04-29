import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function SpendingChart({ transactions = [], darkMode }) {
  const chartData = useMemo(() => {
    // Group by date (month-day), accumulate income vs expense
    const map = {};

    transactions.forEach((t) => {
      if (!t.date) return;
      // Format as "MMM DD"
      const d = new Date(t.date);
      const label = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!map[label]) {
        map[label] = { date: label, income: 0, expenses: 0, _raw: d };
      }

      if (t.type === "income") {
        map[label].income += t.amount;
      } else {
        map[label].expenses += t.amount;
      }
    });

    return Object.values(map)
      .sort((a, b) => a._raw - b._raw)
      .map(({ _raw, ...rest }) => rest);
  }, [transactions]);

  const textColor = darkMode ? "#9ca3af" : "#6b7280";
  const gridColor = darkMode ? "#374151" : "#e5e7eb";

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className={`px-4 py-3 rounded-xl shadow-lg text-sm border ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: ${p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`rounded-2xl p-5 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-sm`}
    >
      <h2 className="text-base font-semibold mb-4">Spending Overview</h2>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-sm opacity-40">
          No data to display
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: textColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: textColor }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value) =>
                value.charAt(0).toUpperCase() + value.slice(1)
              }
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#incomeGrad)"
              dot={{ r: 3, fill: "#6366f1" }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#expenseGrad)"
              dot={{ r: 3, fill: "#f43f5e" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default SpendingChart;