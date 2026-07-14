import { create } from "zustand";

import { getClearingReport } from "@api";

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

export const useClearingReportStore = create((set) => ({
  report: null,
  isLoading: false,
  error: null,

  loadReport: async (params) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const report = await getClearingReport(params);

      set({
        report,
        isLoading: false,
      });

      return report;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки отчёта взаиморасчётов"),
        isLoading: false,
      });

      throw error;
    }
  },

  clearReport: () => {
    set({
      report: null,
      isLoading: false,
      error: null,
    });
  },
}));
