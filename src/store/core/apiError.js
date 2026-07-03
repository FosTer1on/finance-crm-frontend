export const getApiError = (error, fallbackMessage) => {
  return error?.response?.data || fallbackMessage;
};
