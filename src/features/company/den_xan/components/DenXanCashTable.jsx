import DenXanOperationTable from "./operations/DenXanOperationTable";

export default function DenXanCashTable({
  operations,
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
      operations={operations}
      draft={draft}
      drafts={drafts}
      isSubmitting={isSubmitting}
      onDraftChange={onDraftChange}
      onRowChange={onRowChange}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
      nameTitle="Название операции"
      namePlaceholder="Например: Пополнение кассы"
      amountTitle="Сумма операции, $"
      allowNegative
      deleteTitle="Удалить кэш-операцию?"
      deleteDescription="Влияние операции на кэш-баланс будет отменено."
      emptyText="Кэш-операций пока нет"
    />
  );
}