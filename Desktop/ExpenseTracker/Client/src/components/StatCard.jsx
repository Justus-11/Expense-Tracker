import React from "react";

function StatCard({ icon: Icon, title, value, subtitle, bgColor, iconColor }) {
  return (
    <div
      className={`${bgColor} rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer transition-all hover:scale-105 hover:shadow-2xl`}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition duration-300"></div>

      <div className="relative z-10">
        <div
          className={`inline-flex p-3 ${iconColor} rounded-xl mb-4 group-hover:rotate-12 transition-all duration-300`}
        >
          <Icon className="w-6 h-6" strokeWidth={2.5} />
        </div>

        <h3 className="text-3xl lg:text-4xl font-bold mb-1">
          {value}
        </h3>

        <p className="text-sm opacity-90 font-medium">{title}</p>

        <p className="text-xs opacity-75 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

export default StatCard;