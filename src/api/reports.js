import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getPeriodReport = async (params = {}) => {
  const { data } = await apiClient.get(ENDPOINTS.reports, { params });
  return data;
};