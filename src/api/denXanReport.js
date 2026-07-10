import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getDenXanReport = async (params) => {
  const { data } = await apiClient.get(ENDPOINTS.denXanReport, {
    params,
  });

  return data;
};