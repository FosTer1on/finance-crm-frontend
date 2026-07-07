import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getPartners = async (params = {}) => {
  const { data } = await apiClient.get(ENDPOINTS.partners, { params });
  return data;
};

export const createPartner = async (payload) => {
  const { data } = await apiClient.post(ENDPOINTS.partners, payload);
  return data;
};