import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
} from "lucide-react";

const iconMap = {
  balance: Wallet,
  income: ArrowDownCircle,
  expense: ArrowUpCircle,
  default: DollarSign,
};

const colorMap = {
  balance: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    icon: "text-blue-500",
  },
  income: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100",
    icon: "text-green-500",
  },
  expense: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
    icon: "text-red-500",
  },
};

export default function StatCard({
  title = "Stat",
  value = 0,
  type = "default",
  trend = null, // { value: number, label: string } e.g. { value: 12.5, label: "vs last month" }
  sparkline = [], // array of numbers for mini chart
  prefix = "KSh",
  darkMode = false,
}) {
  const Icon = iconMap[type] || iconMap.default;
  const colors = colorMap[type] || colorMap.balance;

  const trendPositive = trend?.value > 0;
  const trendNeutral = trend?.value === 0;
  const TrendIcon = trendNeutral ? Minus : trendPositive ? TrendingUp : TrendingDown;
  const trendColor = trendNeutral
    ? "text-gray-400"
    : trendPositive
    ? "text-green-500"
    : "text-red-500";

  // Sparkline SVG
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = max - min || 1;
    const w = 80;
    const h = 28;
    const pts = sparkline.map((v, i) => {
      const x = (i / (sparkline.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    });
    const lineColor =
      type === "income"
        ? "#22c55e"
        : type === "expense"
        ? "#ef4444"
        : "#3b82f6";

    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-70">
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke={lineColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Filled area */}
        <polyline
          points={`0,${h} ${pts.join(" ")} ${w},${h}`}
          fill={lineColor}
          fillOpacity="0.08"
          stroke="none"
        />
      </svg>
    );
  };

  return (
    <div
      className={`relative rounded-2xl p-5 border transition-all duration-200 hover:shadow-md ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-white"
          : `bg-white ${colors.border} border text-gray-900`
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={`p-2 rounded-xl ${
            darkMode ? "bg-gray-700" : colors.bg
          }`}
        >
          <Icon
            size={18}
            className={darkMode ? "text-gray-300" : colors.icon}
          />
        </div>

        {/* Trend badge */}
        {trend !== null && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trendNeutral
                ? darkMode
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-100 text-gray-400"
                : trendPositive
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            <TrendIcon size={11} />
            {Math.abs(trend.value).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Label */}
      <p
        className={`text-xs font-medium uppercase tracking-wide mb-1 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {title}
      </p>

      {/* Value */}
      <p
        className={`text-2xl font-bold tracking-tight ${
          darkMode ? "text-white" : colors.text
        }`}
      >
        {prefix} {Number(value).toLocaleString()}
      </p>

      {/* Sparkline + trend label */}
      <div className="flex items-end justify-between mt-3">
        {trend?.label && (
          <p
            className={`text-[11px] ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {trend.label}
          </p>
        )}
        <div className="ml-auto">{renderSparkline()}</div>
      </div>
    </div>
  );
}