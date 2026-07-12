import DenXanOperationTable from "./operations/DenXanOperationTable";

export default function DenXanExpenseTable({
  expenses,
  draft,
  drafts,
  isSubmitting,
  onDraftChange,
  onRowChange,
  onCreate,
  onUpdate,
  onDelete,
}) {
  return (
    <DenXanOperationTable
      operations={expenses}
      draft={draft}
      drafts={drafts}
      isSubmitting={isSubmitting}
      onDraftChange={onDraftChange}
      onRowChange={onRowChange}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
      nameTitle="Название расхода"
      namePlaceholder="Например: Аренда склада"
      amountTitle="Сумма расхода"
      allowNegative={false}
      deleteTitle="Удалить расход?"
      deleteDescription="Сумма расхода вернётся на банковский счёт."
      emptyText="Расходов пока нет"
    />
  );
}