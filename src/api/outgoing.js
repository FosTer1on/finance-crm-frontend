import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getOutgoingTransactions = (params = {}) =>
  apiClient.get(ENDPOINTS.outgoing, { params });

export const createOutgoingTransaction = (data) =>
  apiClient.post(ENDPOINTS.outgoing, data);

export const changeOutgoingStatus = (id, data) =>
  apiClient.post(`${ENDPOINTS.outgoing}${id}/change-status/`, data);