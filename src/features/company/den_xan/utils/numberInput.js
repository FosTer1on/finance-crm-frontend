export const moneyFormatter = (value) =>
  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const moneyParser = (value) => value?.replace(/\s/g, "") || "0";