import { useIncomingStore } from "@store/incoming/incomingStore";
import { useEffect, useState } from "react";
import StatusSelect from "@components/finance/StatusSelect";
import OperationSummaryCard from "@components/finance/OperationSummaryCard";
import OperationTable from "@components/finance/OperationTable";
import TransactionCard from "@components/finance/TransactionCard";
import { getIncomingColumns } from "./incoming/incomingColumns";
import { useDistributorStore } from "@store/distributor/distributorStore";
import IncomingCreateModal from "./incoming/IncomingCreateModal";

export default function IncomingTab({
  company,
  accounts = [],
  onAfterStatusChange,
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    transactions,
    summary,
    isLoading,
    isSubmitting,
    loadIncoming,
    clearIncoming,
    changeStatus,
    createIncoming,
  } = useIncomingStore();

  const { distributors, loadDistributors, clearDistributors } =
    useDistributorStore();

  useEffect(() => {
    if (!company?.id) return;

    loadIncoming({ company: company.id });

    if (company.schema_type === "den_xan") {
      loadDistributors(company.id);
    }

    return () => {
      clearIncoming();
      clearDistributors();
    };
  }, [
    company?.id,
    company?.schema_type,
    loadIncoming,
    clearIncoming,
    loadDistributors,
    clearDistributors,
  ]);

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
    <TransactionCard
      title="Приходы"
      buttonText="Добавить приход"
      onCreate={() => setIsCreateOpen(true)}
    >
      <OperationTable
        columns={columns}
        dataSource={transactions}
        loading={isLoading || isSubmitting}
        scrollX={1400}
      />

      <OperationSummaryCard
        summary={summary}
        variant={company?.schema_type === "den_xan" ? "den_xan" : "standard"}
      />
      <IncomingCreateModal
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        company={company}
        accounts={accounts}
        distributors={distributors}
        loading={isSubmitting}
        onSubmit={async (payload) => {
          await createIncoming(payload);
          setIsCreateOpen(false);

          if (onAfterStatusChange) {
            onAfterStatusChange();
          }
        }}
      />
    </TransactionCard>
  );
}
