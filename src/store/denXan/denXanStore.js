import { create } from "zustand";
import {
  getDenXanDaily,
  saveDenXanIncoming,
  addDenXanIncoming,
  saveDenXanOutgoing,
  saveDenXanIncomingComment,
  saveDenXanOutgoingComment,
  saveDenXanRates,
} from "@api";

const toNumber = (value) => Number(value || 0);

const calculateSummary = (rows) => {
  const summary = rows.reduce(
    (acc, row) => {
      acc.profit += toNumber(row.profit_amount);
      acc.mtg += toNumber(row.mtg_amount);
      acc.to_den_xan_account += toNumber(row.amount_to_account);
      acc.outgoing_total += toNumber(row.outgoing_amount);
      acc.need_to_give +=
        toNumber(row.total_amount) -
        toNumber(row.profit_amount) -
        toNumber(row.mtg_amount);
      acc.need_to_receive += toNumber(row.outgoing_after_percent);

      return acc;
    },
    {
      profit: 0,
      mtg: 0,
      to_den_xan_account: 0,
      outgoing_total: 0,
      need_to_give: 0,
      need_to_receive: 0,
    }
  );

  return summary;
};

export const useDenXanStore = create((set, get) => ({
  day: null,
  date: null,
  rows: [],
  summary: null,

  isLoading: false,
  isSubmitting: false,
  error: null,

  loadDaily: async ({ company, date }) => {
    set({
      isLoading: true,
      error: null,
      currentQuery: { company, date },
    });

    try {
      const data = await getDenXanDaily({ company, date });

      set({
        day: data.day || null,
        date: data.date,
        rows: data.rows || [],
        summary: data.summary || null,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка загрузки DEN XAN",
        isLoading: false,
      });

      throw error;
    }
  },

  reloadCurrentDay: async () => {
    const query = get().currentQuery;

    if (!query?.company || !query?.date) {
      return null;
    }

    return get().loadDaily(query);
  },

  updateRowLocal: (updatedRow) => {
    const rows = get().rows.map((row) =>
      row.id === updatedRow.id ? updatedRow : row
    );

    set({
      rows,
      summary: calculateSummary(rows),
    });
  },

  saveIncoming: async (rowId, payload) => {
    set({ isSubmitting: true, error: null });

    try {
      const updatedRow = await saveDenXanIncoming(rowId, payload);

      set({ isSubmitting: false });

      await get().reloadCurrentDay();

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
  
      set({ isSubmitting: false });
  
      await get().reloadCurrentDay();
  
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
  
      set({ isSubmitting: false });
  
      await get().reloadCurrentDay();
  
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

  saveRates: async (dayId, payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const day = await saveDenXanRates(dayId, payload);

      set({
        day,
        isSubmitting: false,
      });

      await get().reloadCurrentDay();

      return day;
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка сохранения курсов",
        isSubmitting: false,
      });

      throw error;
    }
  },

  clearDenXan: () => {
    set({
      day: null,
      date: null,
      rows: [],
      summary: null,
      currentQuery: null,
      error: null,
    });
  },
}));
