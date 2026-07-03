export const calculateOperationSummary = (items = {}) => {
  const list = Array.isArray(items) ? items : [];

  const completed = list.filter((item) => item.status === "completed");
  const cancelled = list.filter((item) => item.status === "cancelled");

  return {
    totalAmount: completed.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    ),
    totalAfterPercent: completed.reduce(
      (sum, item) => sum + Number(item.amount_after_percent || 0),
      0
    ),
    operationsCount: list.length,
    completedCount: completed.length,
    cancelledCount: cancelled.length,
  };
};

export const calculateExpenseSummary = (items = {}) => {
  const list = Array.isArray(items) ? items : [];

  const completed = list.filter((item) => item.status === "completed");
  const cancelled = list.filter((item) => item.status === "cancelled");

  return {
    totalAmount: completed.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    ),
    operationsCount: list.length,
    completedCount: completed.length,
    cancelledCount: cancelled.length,
  };
};
