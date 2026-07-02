import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getExpenses = async (params = {}) => {
  const { data } = await apiClient.get(ENDPOINTS.expenses, { params });
  return data;
};

export const createExpense = async (payload) => {
  const { data } = await apiClient.post(ENDPOINTS.expenses, payload);
  return data;
};

export const changeExpenseStatus = async (id, payload) => {
  const { data } = await apiClient.post(
    `${ENDPOINTS.expenses}${id}/change-status/`,
    payload
  );
  return data;
};