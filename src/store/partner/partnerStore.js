import { create } from "zustand";
import { createPartner, getPartners } from "@api";
import { getApiError } from "@store/core/apiError";

export const usePartnerStore = create((set, get) => ({
  partners: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadPartners: async (companyId) => {
    if (!companyId) return;

    set({ isLoading: true, error: null });

    try {
      const partners = await getPartners({ company: companyId });
      set({ partners, isLoading: false });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки партнёров"),
        isLoading: false,
      });
    }
  },

  createPartner: async (payload) => {
    set({ isSubmitting: true, error: null });

    try {
      const partner = await createPartner(payload);

      set({
        partners: [...get().partners, partner],
        isSubmitting: false,
      });

      return partner;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка создания фирмы исхода"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  clearPartners: () => {
    set({
      partners: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
    });
  },
}));