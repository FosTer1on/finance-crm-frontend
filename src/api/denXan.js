import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getDenXanDaily = async ({ company, date }) => {
  const { data } = await apiClient.get(ENDPOINTS.denXanDaily, {
    params: { company, date },
  });

  return data;
};

export const saveDenXanIncoming = async (rowId, payload) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.denXanDaily}${rowId}/save-incoming/`,
    payload
  );

  return data;
};

export const addDenXanIncoming = async (rowId, payload) => {
  const { data } = await apiClient.post(
    `${ENDPOINTS.denXanDaily}${rowId}/add-incoming/`,
    payload
  );

  return data;
};

export const saveDenXanOutgoing = async (rowId, payload) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.denXanDaily}${rowId}/save-outgoing/`,
    payload
  );

  return data;
};

export const saveDenXanIncomingComment = async (rowId, payload) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.denXanDaily}${rowId}/incoming-comment/`,
    payload
  );

  return data;
};

export const saveDenXanOutgoingComment = async (rowId, payload) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.denXanDaily}${rowId}/outgoing-comment/`,
    payload
  );

  return data;
};

export const saveDenXanRates = async (dayId, payload) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.denXanDaily}${dayId}/save-rates/`,
    payload
  );

  return data;
};