import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getIncomingTransactions = (params = {}) =>
  apiClient.get(ENDPOINTS.incoming, { params });

export const createIncomingTransaction = (data) =>
  apiClient.post(ENDPOINTS.incoming, data);

export const changeIncomingStatus = (id, data) =>
  apiClient.post(`${ENDPOINTS.incoming}${id}/change-status/`, data);