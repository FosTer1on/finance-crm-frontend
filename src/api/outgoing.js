import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getOutgoingTransactions = async (params = {}) => {
  const { data } = await apiClient.get(ENDPOINTS.outgoing, { params });
  return data;
};

export const createOutgoingTransaction = async (payload) => {
  const { data } = await apiClient.post(ENDPOINTS.outgoing, payload);
  return data;
};

export const changeOutgoingStatus = async (id, payload) => {
  const { data } = await apiClient.post(
    `${ENDPOINTS.outgoing}${id}/change-status/`,
    payload
  );
  return data;
};