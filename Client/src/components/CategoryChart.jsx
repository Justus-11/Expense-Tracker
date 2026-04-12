import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function CategoryChart({
  expenses = [],
  darkMode = false,
}) {
  const colorMap = {
    Food: "#22c55e",
    Transportation: "#3b82f6",
    Entertainment: "#f97316",
    Shopping: "#ef4444",
    Bills: "#a855f7",
    Other: "#64748b",
  };

  const data = useMemo(() => {
    // ✅ GROUP DIRECTLY FROM RAW EXPENSES
    const grouped = {};

    expenses.forEach((item) => {
      const name = item.category || "Other";
      const value = Number(item.amount || 0);

      if (!grouped[name]) grouped[name] = 0;
      grouped[name] += value;
    });

    const total =
      Object.values(grouped).reduce((sum, v) => sum + v, 0) || 1;

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
      percent: (value / total) * 100,
      color: colorMap[name] || "#6366f1",
    }));
  }, [expenses]);

  const totalSpent = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  return (
    <div
      className={`p-5 rounded-xl shadow-md transition-all ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Category Breakdown</h2>
          <p className="text-xs opacity-60">Spending overview</p>
        </div>

        <div className="text-right">
          <p className="text-xs opacity-60">Total</p>
          <p className="text-lg font-bold">KSh {totalSpent}</p>
        </div>
      </div>

      {/* CHART */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {data.length === 0 ? (
            <p className="text-sm opacity-60">No data available</p>
          ) : (
            data.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="opacity-70">
                    {item.value} • {item.percent.toFixed(1)}%
                  </span>
                </div>

                <div
                  className={`w-full h-2 rounded-full overflow-hidden ${
                    darkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: item.color,
                    }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* LEGEND */}
      <div className="mt-6 flex flex-wrap gap-3 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="opacity-80">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}