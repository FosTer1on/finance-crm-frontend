import { create } from "zustand";
import { createDistributor, getDistributors } from "@api";
import { getApiError } from "@store/core/apiError";

export const useDistributorStore = create((set, get) => ({
  distributors: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadDistributors: async (companyId) => {
    if (!companyId) return;

    set({ isLoading: true, error: null });

    try {
      const distributors = await getDistributors({ company: companyId });
      set({ distributors, isLoading: false });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки дистрибьюторов"),
        isLoading: false,
      });
    }
  },

  createDistributor: async (payload) => {
    set({ isSubmitting: true, error: null });

    try {
      const distributor = await createDistributor(payload);

      set({
        distributors: [...get().distributors, distributor],
        isSubmitting: false,
      });

      return distributor;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка создания дистрибьютора"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  clearDistributors: () => {
    set({
      distributors: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
    });
  },
}));