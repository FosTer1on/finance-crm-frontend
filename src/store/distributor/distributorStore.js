import { create } from "zustand";
import { getDistributors } from "@api";
import { getApiError } from "@store/core/apiError";

export const useDistributorStore = create((set) => ({
  distributors: [],

  isLoading: false,
  error: null,

  loadDistributors: async (companyId) => {
    if (!companyId) return;

    set({ isLoading: true, error: null });

    try {
      const distributors = await getDistributors({ company: companyId });

      set({
        distributors,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки дистрибьюторов"),
        isLoading: false,
      });
    }
  },

  clearDistributors: () => {
    set({
      distributors: [],
      isLoading: false,
      error: null,
    });
  },
}));