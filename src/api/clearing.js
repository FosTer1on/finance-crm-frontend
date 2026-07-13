import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getClearingPeople = async (params = {}) => {
  const { data } = await apiClient.get(
    ENDPOINTS.clearingPeople,
    { params }
  );

  return data;
};

export const createClearingPerson = async (payload) => {
  const { data } = await apiClient.post(
    ENDPOINTS.clearingPeople,
    payload
  );

  return data;
};

export const updateClearingPerson = async (personId, payload) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.clearingPeople}${personId}/`,
    payload
  );

  return data;
};

export const getClearingCompanies = async (params = {}) => {
  const { data } = await apiClient.get(
    ENDPOINTS.clearingCompanies,
    { params }
  );

  return data;
};

export const createClearingCompany = async (payload) => {
  const { data } = await apiClient.post(
    ENDPOINTS.clearingCompanies,
    payload
  );

  return data;
};

export const updateClearingCompany = async (
  companyId,
  payload
) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.clearingCompanies}${companyId}/`,
    payload
  );

  return data;
};

export const getClearingOperations = async (params = {}) => {
  const { data } = await apiClient.get(
    ENDPOINTS.clearingOperations,
    { params }
  );

  return data;
};

export const createClearingOperation = async (payload) => {
  const { data } = await apiClient.post(
    ENDPOINTS.clearingOperations,
    payload
  );

  return data;
};

export const updateClearingOperation = async (
  operationId,
  payload
) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.clearingOperations}${operationId}/`,
    payload
  );

  return data;
};

export const deleteClearingOperation = async (operationId) => {
  await apiClient.delete(
    `${ENDPOINTS.clearingOperations}${operationId}/`
  );
};