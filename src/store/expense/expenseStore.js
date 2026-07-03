import { create } from "zustand";
import { changeExpenseStatus, createExpense, getExpenses } from "@api";
import { getApiError } from "@store/core/apiError";
import { calculateExpenseSummary } from "@store/core/transactionSummary";

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  summary: calculateExpenseSummary([]),

  isLoading: false,
  isSubmitting: false,
  error: null,
  filters: {},

  loadExpenses: async (params = {}) => {
    set({ isLoading: true, error: null, filters: params });

    try {
      const expenses = await getExpenses(params);

      set({
        expenses,
        summary: calculateExpenseSummary(expenses),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки расходов"),
        isLoading: false,
      });
    }
  },

  createExpense: async (payload) => {
    set({ isSubmitting: true, error: null });

    try {
      await createExpense(payload);

      const { filters, loadExpenses } = get();
      await loadExpenses(filters);

      set({ isSubmitting: false });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка создания расхода"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  changeStatus: async (id, status) => {
    set({ isSubmitting: true, error: null });

    try {
      await changeExpenseStatus(id, { status });

      const { filters, loadExpenses } = get();
      await loadExpenses(filters);

      set({ isSubmitting: false });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка смены статуса"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  clearExpenses: () => {
    set({
      expenses: [],
      summary: calculateExpenseSummary([]),
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