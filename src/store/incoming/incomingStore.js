import { create } from "zustand";
import {
  changeIncomingStatus,
  createIncomingTransaction,
  getIncomingTransactions,
} from "@api";

const calculateSummary = (transactions) => {
  const completed = transactions.filter((item) => item.status === "completed");
  const cancelled = transactions.filter((item) => item.status === "cancelled");

  return {
    totalAmount: completed.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    ),
    totalAfterPercent: completed.reduce(
      (sum, item) => sum + Number(item.amount_after_percent || 0),
      0
    ),
    operationsCount: transactions.length,
    completedCount: completed.length,
    cancelledCount: cancelled.length,
  };
};

export const useIncomingStore = create((set, get) => ({
  transactions: [],
  summary: calculateSummary([]),

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
        summary: calculateSummary(transactions),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка загрузки приходов",
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
        error: error?.response?.data || "Ошибка создания прихода",
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
        error: error?.response?.data || "Ошибка смены статуса",
        isSubmitting: false,
      });

      throw error;
    }
  },

  clearIncoming: () => {
    set({
      transactions: [],
      summary: calculateSummary([]),
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