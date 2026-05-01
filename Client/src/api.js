// ── api.js ────────────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v2";

// Grab token from localStorage
const getToken = () => localStorage.getItem("et_token");

// Central fetch wrapper — attaches Bearer token to every request
const apiFetch = async (path, options = {}) => {
  const token = getToken();

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Token expired / invalid → clear token and reload to show login screen
  if (res.status === 401) {
    localStorage.removeItem("et_token");
    window.location.href = "/"; // ✅ reload root — AuthGate shows login
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API error");
  return data.data || data;
};

// ── EXPENSES ──────────────────────────────────────────────────────────────────
export const fetchExpenses  = ()         => apiFetch("/expense");
export const createExpense  = (data)     => apiFetch("/expense",      { method: "POST",   body: JSON.stringify(data) });
export const updateExpense  = (id, data) => apiFetch(`/expense/${id}`,{ method: "PUT",    body: JSON.stringify(data) });
export const deleteExpense  = (id)       => apiFetch(`/expense/${id}`,{ method: "DELETE" });

// ── INCOME ────────────────────────────────────────────────────────────────────
export const fetchIncome    = ()         => apiFetch("/income");
export const createIncome   = (data)     => apiFetch("/income",       { method: "POST",   body: JSON.stringify(data) });
export const updateIncome   = (id, data) => apiFetch(`/income/${id}`, { method: "PUT",    body: JSON.stringify(data) });
export const deleteIncome   = (id)       => apiFetch(`/income/${id}`, { method: "DELETE" });

// ── AUTH (public endpoints — no token needed) ─────────────────────────────────
export const forgotPasswordApi = (email) =>
  fetch(`${BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then((r) => r.json());

export const resetPasswordApi = (token, password) =>
  fetch(`${BASE}/auth/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  }).then((r) => r.json());