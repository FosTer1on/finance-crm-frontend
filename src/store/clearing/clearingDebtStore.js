import { create } from "zustand";

import {
  getClearingDebts,
  getClearingDebt,
  getOverdueClearingDebts,
  getDueTodayClearingDebts,
  createManualClearingDebt,
  updateClearingDebt,
  createClearingDebtPayment,
} from "@api";

const getApiError = (error, fallback) => {
  const data = error?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.detail) {
    return data.detail;
  }

  return data || fallback;
};

export const useClearingDebtStore = create((set, get) => ({
  debts: [],
  selectedPerson: null,

  currentSearch: "",
  activeFilter: "all",

  isLoading: false,
  isLoadingPerson: false,
  isSubmitting: false,
  error: null,

  loadDebts: async ({ search = "", filter = "all" } = {}) => {
    set({
      isLoading: true,
      error: null,
      currentSearch: search,
      activeFilter: filter,
    });

    try {
      let data;

      if (filter === "overdue") {
        data = await getOverdueClearingDebts({
          ...(search ? { search } : {}),
        });
      } else if (filter === "due-today") {
        data = await getDueTodayClearingDebts({
          ...(search ? { search } : {}),
        });
      } else {
        data = await getClearingDebts({
          ...(search ? { search } : {}),
        });
      }

      set({
        debts: Array.isArray(data) ? data : [],
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки долгов"),
        isLoading: false,
      });

      throw error;
    }
  },

  loadPersonDebt: async (personId) => {
    if (!personId) {
      set({
        selectedPerson: null,
      });

      return null;
    }

    set({
      isLoadingPerson: true,
      error: null,
    });

    try {
      const data = await getClearingDebt(personId);

      set({
        selectedPerson: data,
        isLoadingPerson: false,
      });

      return data;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки долгов человека"),
        isLoadingPerson: false,
      });

      throw error;
    }
  },

  reloadDebts: async () => {
    const { currentSearch, activeFilter } = get();

    return get().loadDebts({
      search: currentSearch,
      filter: activeFilter,
    });
  },

  refreshPersonAndList: async (personId) => {
    await get().reloadDebts();

    if (personId) {
      try {
        await get().loadPersonDebt(personId);
      } catch (error) {
        const status = error?.response?.status;

        if (status === 404) {
          set({
            selectedPerson: null,
          });

          return;
        }

        throw error;
      }
    }
  },

  createManualDebt: async (payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const personSummary = await createManualClearingDebt(payload);

      set({
        selectedPerson: personSummary,
        isSubmitting: false,
      });

      await get().reloadDebts();

      return personSummary;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка создания долга"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  updateDebt: async (debtId, personId, payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const personSummary = await updateClearingDebt(debtId, payload);

      set({
        selectedPerson: personSummary,
        isSubmitting: false,
      });

      await get().reloadDebts();

      return personSummary;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка обновления долга"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  createPayment: async (debtId, personId, payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const response = await createClearingDebtPayment(debtId, payload);

      set({
        isSubmitting: false,
      });

      const isClosedResponse = response?.message === "Долг полностью погашен.";

      if (isClosedResponse) {
        await get().reloadDebts();

        const personStillExists = get().debts.some(
          (item) => Number(item.person_id) === Number(personId)
        );

        if (personStillExists) {
          await get().loadPersonDebt(personId);
        } else {
          set({
            selectedPerson: null,
          });
        }

        return response;
      }

      set({
        selectedPerson: response,
      });

      await get().reloadDebts();

      return response;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка погашения долга"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  selectPerson: async (personId) => {
    return get().loadPersonDebt(personId);
  },

  clearSelectedPerson: () => {
    set({
      selectedPerson: null,
    });
  },

  clearDebts: () => {
    set({
      debts: [],
      selectedPerson: null,
      currentSearch: "",
      activeFilter: "all",
      error: null,
    });
  },
}));
