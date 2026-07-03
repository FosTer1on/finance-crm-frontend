import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getDistributors = async (params = {}) => {
  const { data } = await apiClient.get(ENDPOINTS.distributors, { params });
  return data;
};