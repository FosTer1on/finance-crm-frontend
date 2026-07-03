import { create } from "zustand";
import {
  changeOutgoingStatus,
  createOutgoingTransaction,
  getOutgoingTransactions,
} from "@api";
import { getApiError } from "@store/core/apiError";
import { calculateOperationSummary } from "@store/core/transactionSummary";

export const useOutgoingStore = create((set, get) => ({
  transactions: [],
  summary: calculateOperationSummary([]),

  isLoading: false,
  isSubmitting: false,
  error: null,
  filters: {},

  loadOutgoing: async (params = {}) => {
    set({ isLoading: true, error: null, filters: params });

    try {
      const transactions = await getOutgoingTransactions(params);

      set({
        transactions,
        summary: calculateOperationSummary(transactions),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки исходящих"),
        isLoading: false,
      });
    }
  },

  createOutgoing: async (payload) => {
    set({ isSubmitting: true, error: null });

    try {
      await createOutgoingTransaction(payload);

      const { filters, loadOutgoing } = get();
      await loadOutgoing(filters);

      set({ isSubmitting: false });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка создания исходящего"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  changeStatus: async (id, status) => {
    set({ isSubmitting: true, error: null });

    try {
      await changeOutgoingStatus(id, { status });

      const { filters, loadOutgoing } = get();
      await loadOutgoing(filters);

      set({ isSubmitting: false });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка смены статуса"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  clearOutgoing: () => {
    set({
      transactions: [],
      summary: calculateOperationSummary([]),
      filters: {},
      error: null,
      isLoading: false,
      isSubmitting: false,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));