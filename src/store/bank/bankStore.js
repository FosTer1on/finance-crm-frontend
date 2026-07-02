import { create } from "zustand";
import { getBankAccounts } from "@api";

const calculateTotalBalance = (accounts) =>
  accounts.reduce((total, account) => total + Number(account.balance || 0), 0);

export const useBankStore = create((set) => ({
  accounts: [],
  totalBalance: 0,

  isLoading: false,
  error: null,

  loadAccounts: async (companyId) => {
    if (!companyId) return;

    set({ isLoading: true, error: null });

    try {
      const accounts = await getBankAccounts({ company: companyId });

      set({
        accounts,
        totalBalance: calculateTotalBalance(accounts),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка загрузки счетов",
        isLoading: false,
      });
    }
  },

  clearAccounts: () => {
    set({
      accounts: [],
      totalBalance: 0,
      error: null,
      isLoading: false,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));