import { create } from "zustand";
import {
  changeIncomingStatus,
  createIncomingTransaction,
  getIncomingTransactions,
} from "@api";
import { getApiError } from "@store/core/apiError";
import { calculateOperationSummary } from "@store/core/transactionSummary";

export const useIncomingStore = create((set, get) => ({
  transactions: [],
  summary: calculateOperationSummary([]),

  isLoading: false,
  isSubmitting: false,
  error: null,
  filters: {},

  loadIncoming: async (params = {}) => {
    set({ isLoading: true, error: null, filters: params });

    try {
      const transactions = await getIncomingTransactions(params);

      set({
        transactions,
        summary: calculateOperationSummary(transactions),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки приходов"),
        isLoading: false,
      });
    }
  },

  createIncoming: async (payload) => {
    set({ isSubmitting: true, error: null });

    try {
      await createIncomingTransaction(payload);

      const { filters, loadIncoming } = get();
      await loadIncoming(filters);

      set({ isSubmitting: false });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка создания прихода"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  changeStatus: async (id, status) => {
    set({ isSubmitting: true, error: null });

    try {
      await changeIncomingStatus(id, { status });

      const { filters, loadIncoming } = get();
      await loadIncoming(filters);

      set({ isSubmitting: false });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка смены статуса"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  clearIncoming: () => {
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