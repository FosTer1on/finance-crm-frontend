import { create } from "zustand";
import { getBankAccounts } from "@api";

const calculateTotalBalance = (accounts) =>
  accounts.reduce((total, account) => total + Number(account.balance || 0), 0);

export const useBankStore = create((set) => ({
  // Счета выбранной компании.
  accounts: [],

  // Счета всех компаний для внутренних переводов.
  allAccounts: [],

  totalBalance: 0,

  isLoading: false,
  isAllAccountsLoading: false,
  error: null,

  loadAccounts: async (companyId) => {
    if (!companyId) return;

    set({
      isLoading: true,
      error: null,
    });

    try {
      const accounts = await getBankAccounts({
        company: companyId,
      });

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

  loadAllAccounts: async () => {
    set({
      isAllAccountsLoading: true,
      error: null,
    });

    try {
      const allAccounts = await getBankAccounts();

      set({
        allAccounts,
        isAllAccountsLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка загрузки счетов",
        isAllAccountsLoading: false,
      });
    }
  },

  clearAccounts: () => {
    set({
      accounts: [],
      allAccounts: [],
      totalBalance: 0,
      error: null,
      isLoading: false,
      isAllAccountsLoading: false,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
