import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v2';

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

// ------------------ EXPENSE APIS ------------------

// Fetch all expenses
export const fetchExpenses = async () => {
  const res = await api.get("/expense");
  return (res.data && res.data.data) || [];
};

// Create a new expense
export const createExpense = async (payload) => {
  const res = await api.post("/expense", payload); // send payload
  return (res.data && res.data.data) || null;
};

// Update an expense
export const updateExpense = async (id, payload) => {
  const res = await api.put(`/expense/${id}`, payload); // use backticks
  return (res.data && res.data.data) || null;
};

// Delete an expense
export const deleteExpense = async (id) => {
  const res = await api.delete(`/expense/${id}`); // DELETE instead of GET
  return (res.data && res.data.data) || null;
};

export const fetchIncome = async () => {
  const res = await fetch("http://localhost:8000/api/v2/income");
  return res.json();
};

export const createIncome = async (data) => {
  const res = await fetch("http://localhost:8000/api/v2/income", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};