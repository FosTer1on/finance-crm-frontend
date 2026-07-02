import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getBankAccounts = async (params = {}) => {
  const { data } = await apiClient.get(ENDPOINTS.bankAccounts, { params });
  return data;
};