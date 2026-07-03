import { useEffect } from "react";
import StatusSelect from "@components/finance/StatusSelect";
import OperationSummaryCard from "@components/finance/OperationSummaryCard";
import OperationTable from "@components/finance/OperationTable";
import TransactionCard from "@components/finance/TransactionCard";
import { useOutgoingStore } from "@store/outgoing/outgoingStore";
import { getOutgoingColumns } from "./outgoing/outgoingColumns";

export default function OutgoingTab({ company, onAfterStatusChange }) {
  const {
    transactions,
    summary,
    isLoading,
    isSubmitting,
    loadOutgoing,
    clearOutgoing,
    changeStatus,
  } = useOutgoingStore();

  useEffect(() => {
    if (!company?.id) return;

    loadOutgoing({ company: company.id });

    return () => {
      clearOutgoing();
    };
  }, [company?.id, loadOutgoing, clearOutgoing]);

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

  const columns = getOutgoingColumns({
    renderStatus,
  });

  return (
    <TransactionCard title="Исходящие" buttonText="Добавить исходящий">
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