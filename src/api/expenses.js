import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getExpenses = (params = {}) =>
  apiClient.get(ENDPOINTS.expenses, { params });

export const createExpense = (data) =>
  apiClient.post(ENDPOINTS.expenses, data);

export const changeExpenseStatus = (id, data) =>
  apiClient.post(`${ENDPOINTS.expenses}${id}/change-status/`, data);