import React, { useEffect } from "react";
import { AlertTriangle, LogOut, X } from "lucide-react";

/**
 * ConfirmDialog — a professional modal confirmation component
 *
 * Props:
 *  isOpen      {boolean}  — controls visibility
 *  onConfirm   {fn}       — called when user clicks the confirm button
 *  onCancel    {fn}       — called when user clicks Cancel or the X or backdrop
 *  darkMode    {boolean}
 *  variant     {string}   — "danger" | "warning" | "logout" (default: "danger")
 *  title       {string}   — modal heading
 *  message     {string}   — body text
 *  confirmText {string}   — confirm button label (default: "Confirm")
 *  cancelText  {string}   — cancel button label  (default: "Cancel")
 */
function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  darkMode = false,
  variant = "danger",
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  // ── Variant config ────────────────────────────────────────────────────────
  const variants = {
    danger: {
      icon: <AlertTriangle className="w-5 h-5" />,
      iconBg: darkMode ? "bg-red-900/40 text-red-400" : "bg-red-50 text-red-500",
      confirmBtn: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      iconBg: darkMode ? "bg-amber-900/40 text-amber-400" : "bg-amber-50 text-amber-500",
      confirmBtn: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400 text-white",
    },
    logout: {
      icon: <LogOut className="w-5 h-5" />,
      iconBg: darkMode ? "bg-indigo-900/40 text-indigo-400" : "bg-indigo-50 text-indigo-500",
      confirmBtn: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white",
    },
  };

  const v = variants[variant] || variants.danger;

  const overlay = "fixed inset-0 z-50 flex items-center justify-center p-4";
  const card    = `relative w-full max-w-sm rounded-2xl shadow-2xl border p-6 ${
    darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-100 text-gray-900"
  }`;

  return (
    <div className={overlay} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className={card}>
        {/* Close button */}
        <button
          onClick={onCancel}
          className={`absolute top-4 right-4 p-1 rounded-lg transition ${
            darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-400 hover:bg-gray-100"
          }`}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 p-2.5 rounded-xl ${v.iconBg}`}>
            {v.icon}
          </div>
          <div className="pt-0.5">
            <h3 id="confirm-title" className="text-sm font-semibold leading-tight">
              {title}
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {message}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t mb-4 ${darkMode ? "border-gray-700" : "border-gray-100"}`} />

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition border ${
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${v.confirmBtn}`}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;