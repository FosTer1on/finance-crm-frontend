import { create } from "zustand";
import { getCompanies } from "@/api";

export const useCompanyStore = create((set) => ({
  companies: [],
  selectedCompany: null,
  isLoading: false,
  error: null,

  loadCompanies: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await getCompanies();

      set({
        companies: response.data,
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
}));