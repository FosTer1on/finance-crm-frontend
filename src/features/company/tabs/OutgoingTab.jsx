import { useEffect, useState } from "react";
import StatusSelect from "@components/finance/StatusSelect";
import OperationSummaryCard from "@components/finance/OperationSummaryCard";
import OperationTable from "@components/finance/OperationTable";
import TransactionCard from "@components/finance/TransactionCard";
import { useOutgoingStore } from "@store/outgoing/outgoingStore";
import { getOutgoingColumns } from "./outgoing/outgoingColumns";
import { usePartnerStore } from "@/store/partner/partnerStore";
import OutgoingCreateModal from "./outgoing/OutgoingCreateModal";

export default function OutgoingTab({
  company,
  accounts = [],
  onAfterStatusChange,
}) {
  const {
    transactions,
    summary,
    isLoading,
    isSubmitting,
    loadOutgoing,
    clearOutgoing,
    changeStatus,
    createOutgoing,
  } = useOutgoingStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { partners, loadPartners, clearPartners } = usePartnerStore();

  useEffect(() => {
    if (!company?.id) return;

    loadOutgoing({ company: company.id });
    loadPartners(company.id);

    return () => {
      clearOutgoing();
      clearPartners();
    };
  }, [company?.id, loadOutgoing, clearOutgoing, loadPartners, clearPartners]);

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
    <TransactionCard
      title="Исходящие"
      buttonText="Добавить исходящий"
      onCreate={() => setIsCreateOpen(true)}
    >
      <OperationTable
        columns={columns}
        dataSource={transactions}
        loading={isLoading || isSubmitting}
        scrollX={1400}
      />

      <OperationSummaryCard summary={summary} />

      <OutgoingCreateModal
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        company={company}
        accounts={accounts}
        partners={partners}
        loading={isSubmitting}
        onSubmit={async (payload) => {
          await createOutgoing(payload);
          setIsCreateOpen(false);

          if (onAfterStatusChange) {
            onAfterStatusChange();
          }
        }}
      />
    </TransactionCard>
  );
}
