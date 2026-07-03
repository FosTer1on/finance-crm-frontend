import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getCompanies = async () => {
  const { data } = await apiClient.get(ENDPOINTS.companies);
  return data;
};

export const getCompanyById = async (id) => {
  const { data } = await apiClient.get(`${ENDPOINTS.companies}${id}/`);
  return data;
};