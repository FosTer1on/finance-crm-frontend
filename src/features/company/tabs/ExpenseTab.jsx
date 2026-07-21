import { useEffect } from "react";
import StatusSelect from "@components/finance/StatusSelect";
import OperationTable from "@components/finance/OperationTable";
import TransactionCard from "@components/finance/TransactionCard";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useExpenseStore } from "@store/expense/expenseStore";
import { getExpenseColumns } from "./expense/expenseColumns";
import { Card, Space, Typography } from "antd";

const { Text } = Typography;

export default function ExpenseTab({ company, onAfterStatusChange }) {
  const {
    expenses,
    summary,
    isLoading,
    isSubmitting,
    loadExpenses,
    clearExpenses,
    changeStatus,
  } = useExpenseStore();

  useEffect(() => {
    if (!company?.id) return;

    loadExpenses({ company: company.id });

    return () => {
      clearExpenses();
    };
  }, [company?.id, loadExpenses, clearExpenses]);

  const handleStatusChange = async (record, status) => {
    if (record.status === status) return;

    await changeStatus(record.id, status);

    if (onAfterStatusChange) {
      onAfterStatusChange();
    }
  };

  const renderStatus = (status, record) => (
    <StatusSelect
      value={status}
      loading={isSubmitting}
      onChange={(value) => handleStatusChange(record, value)}
    />
  );

  const columns = getExpenseColumns({ renderStatus });

  return (
    <TransactionCard title="Прочие расходы" buttonText="Добавить расход">
      <OperationTable
        columns={columns}
        dataSource={expenses}
        loading={isLoading || isSubmitting}
        scrollX={900}
      />

      <Card size="small" style={{ marginTop: 16 }}>
        <Space size="large" wrap>
          <Text>Общая сумма: {formatMoney(summary.totalAmount)}</Text>
          <Text>Всего: {summary.operationsCount}</Text>
          <Text>Completed: {summary.completedCount}</Text>
          <Text>Cancelled: {summary.cancelledCount}</Text>
        </Space>
      </Card>
    </TransactionCard>
  );
}