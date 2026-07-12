import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getDenXanCash = async (params = {}) => {
  const { data } = await apiClient.get(
    ENDPOINTS.denXanCash,
    { params }
  );

  return data;
};

export const createDenXanCashOperation = async (payload) => {
  const { data } = await apiClient.post(
    ENDPOINTS.denXanCash,
    payload
  );

  return data;
};

export const updateDenXanCashOperation = async (
  operationId,
  payload
) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.denXanCash}${operationId}/`,
    payload
  );

  return data;
};

export const deleteDenXanCashOperation = async (
  operationId
) => {
  await apiClient.delete(
    `${ENDPOINTS.denXanCash}${operationId}/`
  );
};