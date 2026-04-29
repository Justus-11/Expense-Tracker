import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v2';

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

// ------------------ EXPENSE APIS ------------------
// Expense backend wraps responses: { success, data: ... }

export const fetchExpenses = async () => {
  const res = await api.get("/expense");
  // Returns: { success: true, count: N, data: [...] }
  return res.data?.data ?? [];
};

export const createExpense = async (payload) => {
  const res = await api.post("/expense", payload);
  // Returns: { success: true, data: { ...expense } }
  return res.data?.data ?? null;
};

export const updateExpense = async (id, payload) => {
  const res = await api.put(`/expense/${id}`, payload);
  // Returns: { success: true, data: { ...expense } }
  return res.data?.data ?? null;
};

export const deleteExpense = async (id) => {
  await api.delete(`/expense/${id}`);
  // Returns: { success: true, message: "Deleted Successfully" }
  return true;
};

// ------------------ INCOME APIS ------------------
// Income backend returns objects directly (no wrapper)

export const fetchIncome = async () => {
  const res = await api.get("/income");
  // Returns: [ {...}, {...} ]
  return Array.isArray(res.data) ? res.data : [];
};

export const createIncome = async (payload) => {
  const res = await api.post("/income", payload);
  // Returns: { ...income }
  return res.data ?? null;
};

export const updateIncome = async (id, payload) => {
  const res = await api.put(`/income/${id}`, payload);
  // Returns: { ...income }
  return res.data ?? null;
};

export const deleteIncome = async (id) => {
  await api.delete(`/income/${id}`);
  return true;
};