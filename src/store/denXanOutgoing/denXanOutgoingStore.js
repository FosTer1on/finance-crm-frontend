import { create } from "zustand";

import {
  createDenXanOutgoing,
  deleteDenXanOutgoing,
  getDenXanOutgoings,
  updateDenXanOutgoing,
} from "@/api";
import { getApiError } from "@store/core/apiError";

export const useDenXanOutgoingStore = create((set, get) => ({
  outgoings: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadOutgoings: async ({ company, day }) => {
    if (!company || !day) {
      set({ outgoings: [] });
      return;
    }

    set({
      isLoading: true,
      error: null,
    });

    try {
      const result = await getDenXanOutgoings({
        company,
        day,
      });

      const outgoings = Array.isArray(result) ? result : result?.results || [];

      set({
        outgoings,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки исходов"),
        isLoading: false,
      });
    }
  },

  createOutgoing: async (payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const outgoing = await createDenXanOutgoing(payload);

      set({
        outgoings: [outgoing, ...get().outgoings],
        isSubmitting: false,
      });

      return outgoing;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка создания исхода"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  updateOutgoing: async (id, payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const outgoing = await updateDenXanOutgoing(id, payload);

      set({
        outgoings: get().outgoings.map((item) =>
          item.id === outgoing.id ? outgoing : item
        ),
        isSubmitting: false,
      });

      return outgoing;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка обновления исхода"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  deleteOutgoing: async (id) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      await deleteDenXanOutgoing(id);

      set({
        outgoings: get().outgoings.filter((item) => item.id !== id),
        isSubmitting: false,
      });
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка удаления исхода"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  clearOutgoings: () => {
    set({
      outgoings: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
    });
  },
}));
