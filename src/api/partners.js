import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getPartners = async (params = {}) => {
  const { data } = await apiClient.get(ENDPOINTS.partners, { params });
  return data;
};