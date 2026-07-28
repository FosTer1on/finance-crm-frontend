import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getDenXanOutgoings = async (params) => {
  const { data } = await apiClient.get(
    ENDPOINTS.denXanOutgoings,
    { params }
  );

  return data;
};

export const createDenXanOutgoing = async (payload) => {
  const { data } = await apiClient.post(
    ENDPOINTS.denXanOutgoings,
    payload
  );

  return data;
};

export const updateDenXanOutgoing = async (
  id,
  payload
) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.denXanOutgoings}${id}/`,
    payload
  );

  return data;
};

export const deleteDenXanOutgoing = async (id) => {
  await apiClient.delete(
    `${ENDPOINTS.denXanOutgoings}${id}/`
  );
};