import React from "react";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Transactions", icon: Receipt },
  { name: "Analytics", icon: BarChart3 },
  { name: "Settings", icon: Settings },
];

const Sidebar = ({ active, setActive, darkMode }) => {
  return (
    <div
      className={`h-screen w-56 flex flex-col flex-shrink-0 sticky top-0 ${
        darkMode
          ? "bg-gray-800 text-white border-r border-gray-700"
          : "bg-white text-gray-900 border-r border-gray-100 shadow-sm"
      }`}
    >
      {/* LOGO */}
      <div
        className={`px-5 py-5 text-base font-bold border-b flex items-center gap-2 ${
          darkMode ? "border-gray-700" : "border-gray-100"
        }`}
      >
        <span
          className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs"
          aria-hidden="true"
        >
          $
        </span>
        Smart Finance
      </div>

      {/* MENU */}
      <nav className="flex-1 p-3 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : darkMode
                  ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={16} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div
        className={`px-5 py-4 text-xs border-t ${
          darkMode
            ? "border-gray-700 text-gray-500"
            : "border-gray-100 text-gray-400"
        }`}
      >
        © 2026 Smart Finance
      </div>
    </div>
  );
};

export default Sidebar;