import { create } from "zustand";
import { getCompanies } from "@api";

export const useCompanyStore = create((set) => ({
  companies: [],
  selectedCompany: null,

  isLoading: false,
  error: null,

  loadCompanies: async () => {
    set({ isLoading: true, error: null });

    try {
      const companies = await getCompanies();

      set({
        companies,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка загрузки фирм",
        isLoading: false,
      });
    }
  },

  setSelectedCompany: (company) => {
    set({ selectedCompany: company });
  },

  clearSelectedCompany: () => {
    set({ selectedCompany: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));