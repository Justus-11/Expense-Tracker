import React from "react";

function IncomeHistory({ incomeList, darkMode }) {
  return (
    <div
      className={`max-w-7xl mx-auto p-6 rounded-lg ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Income History</h2>

      {incomeList.length === 0 ? (
        <p className="text-gray-500">No income added yet</p>
      ) : (
        incomeList.map((item) => (
          <div
            key={item.id}
            className={`flex justify-between p-3 mb-2 rounded ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <div>
              <p className="font-semibold">{item.source}</p>
              <p className="text-sm opacity-70">{item.date}</p>
            </div>

            <p className="font-bold text-green-500">
              +KSh {item.amount}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default IncomeHistory;