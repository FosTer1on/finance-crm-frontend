import dayjs from "dayjs";

const getWeekRange = (date = dayjs()) => {
  // day(): воскресенье = 0, понедельник = 1.
  const daysFromMonday = (date.day() + 6) % 7;
  const start = date.subtract(daysFromMonday, "day").startOf("day");

  return [
    start,
    start.add(6, "day").endOf("day"),
  ];
};

export const getPeriodRange = (preset, baseDate = dayjs()) => {
  switch (preset) {
    case "today":
      return [
        baseDate.startOf("day"),
        baseDate.endOf("day"),
      ];

    case "yesterday": {
      const yesterday = baseDate.subtract(1, "day");

      return [
        yesterday.startOf("day"),
        yesterday.endOf("day"),
      ];
    }

    case "week":
      return getWeekRange(baseDate);

    case "month":
      return [
        baseDate.startOf("month"),
        baseDate.endOf("month"),
      ];

    default:
      return [
        baseDate.startOf("month"),
        baseDate.endOf("month"),
      ];
  }
};