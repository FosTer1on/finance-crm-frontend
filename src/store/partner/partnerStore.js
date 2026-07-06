import { create } from "zustand";
import { getPartners } from "@api";
import { getApiError } from "@store/core/apiError";

export const usePartnerStore = create((set) => ({
  partners: [],
  isLoading: false,
  error: null,

  loadPartners: async (companyId) => {
    if (!companyId) return;

    set({ isLoading: true, error: null });

    try {
      const partners = await getPartners({ company: companyId });

      set({
        partners,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки партнёров"),
        isLoading: false,
      });
    }
  },

  clearPartners: () => {
    set({
      partners: [],
      isLoading: false,
      error: null,
    });
  },
}));