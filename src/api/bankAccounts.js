import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getBankAccounts = (params = {}) =>
  apiClient.get(ENDPOINTS.bankAccounts, { params });