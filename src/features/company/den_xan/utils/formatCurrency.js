export const formatUsd = (value) => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }
  
    const numericValue = Number(value);
  
    if (!Number.isFinite(numericValue)) {
      return "—";
    }
  
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };