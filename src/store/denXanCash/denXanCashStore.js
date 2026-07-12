import { create } from "zustand";

import {
  getDenXanCash,
  createDenXanCashOperation,
  updateDenXanCashOperation,
  deleteDenXanCashOperation,
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

export const useDenXanCashStore = create((set, get) => ({
  account: null,
  operations: [],
  summary: null,
  currentQuery: null,

  isLoading: false,
  isSubmitting: false,
  error: null,

  loadCash: async (params) => {
    set({
      isLoading: true,
      error: null,
      currentQuery: params,
    });

    try {
      const data = await getDenXanCash(params);

      set({
        account: data.account || null,
        operations: data.operations || [],
        summary: data.summary || null,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        error: getApiError(
          error,
          "Ошибка загрузки кэш-операций"
        ),
        isLoading: false,
      });

      throw error;
    }
  },

  reloadCash: async () => {
    const query = get().currentQuery;

    if (!query?.company) {
      return null;
    }

    return get().loadCash(query);
  },

  createOperation: async (payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const operation =
        await createDenXanCashOperation(payload);

      set({ isSubmitting: false });

      await get().reloadCash();

      return operation;
    } catch (error) {
      set({
        error: getApiError(
          error,
          "Ошибка создания кэш-операции"
        ),
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
      const operation =
        await updateDenXanCashOperation(
          operationId,
          payload
        );

      set({ isSubmitting: false });

      await get().reloadCash();

      return operation;
    } catch (error) {
      set({
        error: getApiError(
          error,
          "Ошибка обновления кэш-операции"
        ),
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
      await deleteDenXanCashOperation(operationId);

      set({ isSubmitting: false });

      await get().reloadCash();
    } catch (error) {
      set({
        error: getApiError(
          error,
          "Ошибка удаления кэш-операции"
        ),
        isSubmitting: false,
      });

      throw error;
    }
  },

  clearCash: () => {
    set({
      account: null,
      operations: [],
      summary: null,
      currentQuery: null,
      isLoading: false,
      isSubmitting: false,
      error: null,
    });
  },
}));