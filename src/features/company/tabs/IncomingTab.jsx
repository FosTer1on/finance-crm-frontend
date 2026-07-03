import { useIncomingStore } from "@store/incoming/incomingStore";
import { useEffect } from "react";
import StatusSelect from "@components/finance/StatusSelect";
import OperationSummaryCard from "@/components/finance/OperationSummaryCard";
import OperationTable from "@/components/finance/OperationTable";
import TransactionCard from "@/components/finance/TransactionCard";
import { getIncomingColumns } from "./incoming/incomingColumns";

export default function IncomingTab({ company, onAfterStatusChange }) {
  const {
    transactions,
    summary,
    isLoading,
    isSubmitting,
    loadIncoming,
    clearIncoming,
    changeStatus,
  } = useIncomingStore();

  useEffect(() => {
    if (!company?.id) return;

    loadIncoming({ company: company.id });

    return () => {
      clearIncoming();
    };
  }, [company?.id, loadIncoming, clearIncoming]);

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

  const columns = getIncomingColumns({
    company,
    renderStatus,
  });

  return (
    <TransactionCard title="Приходы" buttonText="Добавить приход">
      <OperationTable
        columns={columns}
        dataSource={transactions}
        loading={isLoading || isSubmitting}
        scrollX={1400}
      />

      <OperationSummaryCard summary={summary} />
    </TransactionCard>
  );
}
