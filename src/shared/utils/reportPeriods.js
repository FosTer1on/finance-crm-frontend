import dayjs from "dayjs";

export const REPORT_PERIODS = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  WEEK: "week",
  MONTH: "month",
  CUSTOM: "custom",
};

const getCurrentWeek = (baseDate) => {
  const daysFromMonday = (baseDate.day() + 6) % 7;
  const dateFrom = baseDate.subtract(daysFromMonday, "day").startOf("day");

  return {
    dateFrom,
    dateTo: dateFrom.add(6, "day").endOf("day"),
  };
};

export const getReportPeriod = (type, baseDate = dayjs()) => {
  switch (type) {
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
      return getCurrentWeek(baseDate);

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
