import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getBalanceAdjustments = (params = {}) =>
  apiClient.get(ENDPOINTS.adjustments, { params });

export const createBalanceAdjustment = (data) =>
  apiClient.post(ENDPOINTS.adjustments, data);