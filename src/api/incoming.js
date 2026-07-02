import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getIncomingTransactions = async (params = {}) => {
  const { data } = await apiClient.get(ENDPOINTS.incoming, { params });
  return data;
};

export const createIncomingTransaction = async (payload) => {
  const { data } = await apiClient.post(ENDPOINTS.incoming, payload);
  return data;
};

export const changeIncomingStatus = async (id, payload) => {
  const { data } = await apiClient.post(
    `${ENDPOINTS.incoming}${id}/change-status/`,
    payload
  );
  return data;
};