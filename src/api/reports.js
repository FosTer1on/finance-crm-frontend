import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getPeriodReport = (params = {}) =>
  apiClient.get(ENDPOINTS.reports, { params });