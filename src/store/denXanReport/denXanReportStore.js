import { create } from "zustand";
import { getDenXanReport } from "@api";

export const useDenXanReportStore = create((set) => ({
  report: null,
  isLoading: false,
  error: null,

  loadReport: async (params) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const report = await getDenXanReport(params);

      set({
        report,
        isLoading: false,
      });

      return report;
    } catch (error) {
      set({
        error: error?.response?.data || "Ошибка загрузки отчёта",
        isLoading: false,
      });

      throw error;
    }
  },

  clearReport: () => {
    set({
      report: null,
      error: null,
    });
  },
}));