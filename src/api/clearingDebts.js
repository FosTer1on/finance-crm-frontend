import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getClearingDebts = async (params = {}) => {
  const { data } = await apiClient.get(ENDPOINTS.clearingDebts, { params });

  return data;
};

export const getClearingDebt = async (personId) => {
  const { data } = await apiClient.get(
    `${ENDPOINTS.clearingDebts}${personId}/`
  );

  return data;
};

export const getOverdueClearingDebts = async (params = {}) => {
  const { data } = await apiClient.get(`${ENDPOINTS.clearingDebts}overdue/`, {
    params,
  });

  return data;
};

export const getDueTodayClearingDebts = async (params = {}) => {
  const { data } = await apiClient.get(`${ENDPOINTS.clearingDebts}due-today/`, {
    params,
  });

  return data;
};

export const createManualClearingDebt = async (payload) => {
  const { data } = await apiClient.post(
    `${ENDPOINTS.clearingDebts}manual/`,
    payload
  );

  return data;
};

export const updateClearingDebt = async (debtId, payload) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.clearingDebts}${debtId}/edit/`,
    payload
  );

  return data;
};

export const createClearingDebtPayment = async (debtId, payload) => {
  const { data } = await apiClient.post(
    `${ENDPOINTS.clearingDebts}${debtId}/payment/`,
    payload
  );

  return data;
};

export const createClearingDebtGroupPayment = async (payload) => {
  const { data } = await apiClient.post(
    `${ENDPOINTS.clearingDebts}group-payment/`,
    payload
  );

  return data;
};
