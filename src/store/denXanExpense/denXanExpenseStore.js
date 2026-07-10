import { create } from "zustand";
import {
  getDenXanExpenses,
  createDenXanExpense,
  updateDenXanExpense,
} from "@api";

export const useDenXanExpenseStore = create((set, get) => ({
  expenses: [],
  summary: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadExpenses: async (params) => {
    set({ isLoading: true, error: null });

    try {
      const data = await getDenXanExpenses(params);

      set({
        expenses: data.expenses || [],
        summary: data.summary || null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка загрузки расходов",
        isLoading: false,
      });
    }
  },

  createExpense: async (payload) => {
    set({ isSubmitting: true, error: null });

    try {
      const expense = await createDenXanExpense(payload);

      set({
        expenses: [expense, ...get().expenses],
        isSubmitting: false,
      });

      return expense;
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка создания расхода",
        isSubmitting: false,
      });
      throw error;
    }
  },

  updateExpense: async (id, payload) => {
    set({ isSubmitting: true, error: null });

    try {
      const expense = await updateDenXanExpense(id, payload);

      set({
        expenses: get().expenses.map((item) =>
          item.id === expense.id ? expense : item
        ),
        isSubmitting: false,
      });

      return expense;
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка обновления расхода",
        isSubmitting: false,
      });
      throw error;
    }
  },

  clearExpenses: () => {
    set({
      expenses: [],
      summary: null,
      error: null,
    });
  },
}));