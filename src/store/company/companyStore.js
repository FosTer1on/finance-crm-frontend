import { create } from "zustand";
import { getCompanies, getCompanyById } from "@api";

export const useCompanyStore = create((set) => ({
  companies: [],
  selectedCompany: null,
  isLoading: false,
  error: null,

  loadCompanies: async () => {
    set({ isLoading: true, error: null });

    try {
      const companies = await getCompanies();
      set({ companies, isLoading: false });
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка загрузки фирм",
        isLoading: false,
      });
    }
  },

  loadCompanyById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const company = await getCompanyById(id);
      set({ selectedCompany: company, isLoading: false });
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка загрузки фирмы",
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