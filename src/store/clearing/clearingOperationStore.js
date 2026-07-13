import { create } from "zustand";

import {
  getClearingOperations,
  createClearingOperation,
  updateClearingOperation,
  deleteClearingOperation,
} from "@api";

const getApiError = (error, fallback) => {
  const data = error?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.detail) {
    return data.detail;
  }

  return data || fallback;
};

export const useClearingOperationStore = create((set, get) => ({
  operations: [],
  summary: null,
  peopleBalances: [],
  currentQuery: null,

  isLoading: false,
  isSubmitting: false,
  error: null,

  loadOperations: async (params = {}) => {
    set({
      isLoading: true,
      error: null,
      currentQuery: params,
    });

    try {
      const data = await getClearingOperations(params);

      set({
        operations: data.operations || [],
        summary: data.summary || null,
        peopleBalances: data.people_balances || [],
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки взаиморасчётов"),
        isLoading: false,
      });

      throw error;
    }
  },

  reloadOperations: async () => {
    const query = get().currentQuery;

    if (!query) {
      return null;
    }

    return get().loadOperations(query);
  },

  createOperation: async (payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const operation = await createClearingOperation(payload);

      set({ isSubmitting: false });

      await get().reloadOperations();

      return operation;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка создания операции"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  updateOperation: async (operationId, payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const operation = await updateClearingOperation(operationId, payload);

      set({ isSubmitting: false });

      await get().reloadOperations();

      return operation;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка обновления операции"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  deleteOperation: async (operationId) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      await deleteClearingOperation(operationId);

      set({ isSubmitting: false });

      await get().reloadOperations();
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка удаления операции"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  clearOperations: () => {
    set({
      operations: [],
      summary: null,
      peopleBalances: [],
      currentQuery: null,
      error: null,
    });
  },
}));
