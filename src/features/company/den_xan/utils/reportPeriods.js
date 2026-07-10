import dayjs from "dayjs";

export const REPORT_PERIODS = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  WEEK: "week",
  MONTH: "month",
  CUSTOM: "custom",
};

export const getReportPeriod = (periodType, baseDate = dayjs()) => {
  switch (periodType) {
    case REPORT_PERIODS.TODAY:
      return {
        dateFrom: baseDate.startOf("day"),
        dateTo: baseDate.endOf("day"),
      };

    case REPORT_PERIODS.YESTERDAY: {
      const yesterday = baseDate.subtract(1, "day");

      return {
        dateFrom: yesterday.startOf("day"),
        dateTo: yesterday.endOf("day"),
      };
    }

    case REPORT_PERIODS.WEEK:
      return {
        // dayjs: Sunday = 0, Monday = 1
        dateFrom: baseDate
          .subtract((baseDate.day() + 6) % 7, "day")
          .startOf("day"),
        dateTo: baseDate
          .subtract((baseDate.day() + 6) % 7, "day")
          .add(6, "day")
          .endOf("day"),
      };

    case REPORT_PERIODS.MONTH:
      return {
        dateFrom: baseDate.startOf("month"),
        dateTo: baseDate.endOf("month"),
      };

    default:
      return {
        dateFrom: baseDate.startOf("month"),
        dateTo: baseDate.endOf("month"),
      };
  }
};

export const serializeReportPeriod = ({ dateFrom, dateTo }) => ({
  date_from: dateFrom.format("YYYY-MM-DD"),
  date_to: dateTo.format("YYYY-MM-DD"),
});