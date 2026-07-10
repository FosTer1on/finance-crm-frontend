import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getDenXanExpenses = async (params = {}) => {
  const { data } = await apiClient.get(ENDPOINTS.denXanExpenses, { params });
  return data;
};

export const createDenXanExpense = async (payload) => {
  const { data } = await apiClient.post(ENDPOINTS.denXanExpenses, payload);
  return data;
};

export const updateDenXanExpense = async (id, payload) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.denXanExpenses}${id}/`,
    payload
  );
  return data;
};