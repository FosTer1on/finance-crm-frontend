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
      totalProfit: completed.reduce(
        (sum, item) => sum + Number(item.profit_amount || 0),
        0
      ),
      totalMtg: completed.reduce(
        (sum, item) => sum + Number(item.mtg_amount || 0),
        0
      ),
      totalCompanyAmount: completed.reduce(
        (sum, item) => sum + Number(item.company_amount || 0),
        0
      ),
      totalNetAmount: completed.reduce(
        (sum, item) =>
          sum +
          (
            Number(item.amount || 0) -
            Number(item.mtg_amount || 0) -
            Number(item.profit_amount || 0)
          ),
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