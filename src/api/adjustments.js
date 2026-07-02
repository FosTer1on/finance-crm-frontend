import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getBalanceAdjustments = async (params = {}) => {
  const { data } = await apiClient.get(ENDPOINTS.adjustments, { params });
  return data;
};

export const createBalanceAdjustment = async (payload) => {
  const { data } = await apiClient.post(ENDPOINTS.adjustments, payload);
  return data;
};