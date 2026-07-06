import { create } from "zustand";
import {
  getDenXanDaily,
  saveDenXanIncoming,
  addDenXanIncoming,
  saveDenXanOutgoing,
  saveDenXanIncomingComment,
  saveDenXanOutgoingComment,
} from "@api";

export const useDenXanStore = create((set, get) => ({
  date: null,
  rows: [],
  summary: null,

  isLoading: false,
  isSubmitting: false,
  error: null,

  loadDaily: async ({ company, date }) => {
    set({ isLoading: true, error: null });

    try {
      const data = await getDenXanDaily({ company, date });

      set({
        date: data.date,
        rows: data.rows || [],
        summary: data.summary || null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка загрузки DEN XAN",
        isLoading: false,
      });
    }
  },

  updateRowLocal: (updatedRow) => {
    const rows = get().rows.map((row) =>
      row.id === updatedRow.id ? updatedRow : row
    );

    set({ rows });
  },

  saveIncoming: async (rowId, payload) => {
    set({ isSubmitting: true, error: null });

    try {
      const updatedRow = await saveDenXanIncoming(rowId, payload);
      get().updateRowLocal(updatedRow);
      set({ isSubmitting: false });
      return updatedRow;
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка сохранения прихода",
        isSubmitting: false,
      });
      throw error;
    }
  },

  addIncoming: async (rowId, payload) => {
    set({ isSubmitting: true, error: null });

    try {
      const updatedRow = await addDenXanIncoming(rowId, payload);
      get().updateRowLocal(updatedRow);
      set({ isSubmitting: false });
      return updatedRow;
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка добавления прихода",
        isSubmitting: false,
      });
      throw error;
    }
  },

  saveOutgoing: async (rowId, payload) => {
    set({ isSubmitting: true, error: null });

    try {
      const updatedRow = await saveDenXanOutgoing(rowId, payload);
      get().updateRowLocal(updatedRow);
      set({ isSubmitting: false });
      return updatedRow;
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка сохранения исхода",
        isSubmitting: false,
      });
      throw error;
    }
  },

  saveIncomingComment: async (rowId, comment) => {
    set({ isSubmitting: true, error: null });

    try {
      const updatedRow = await saveDenXanIncomingComment(rowId, { comment });
      get().updateRowLocal(updatedRow);
      set({ isSubmitting: false });
      return updatedRow;
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка сохранения комментария",
        isSubmitting: false,
      });
      throw error;
    }
  },

  saveOutgoingComment: async (rowId, comment) => {
    set({ isSubmitting: true, error: null });

    try {
      const updatedRow = await saveDenXanOutgoingComment(rowId, { comment });
      get().updateRowLocal(updatedRow);
      set({ isSubmitting: false });
      return updatedRow;
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка сохранения комментария",
        isSubmitting: false,
      });
      throw error;
    }
  },

  clearDenXan: () => {
    set({
      date: null,
      rows: [],
      summary: null,
      error: null,
    });
  },
}));
