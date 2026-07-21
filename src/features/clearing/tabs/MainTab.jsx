import { useEffect, useMemo, useState } from "react";
import { Alert, Card, DatePicker, Space, Spin, Typography } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";

import { useClearingDirectoryStore } from "@/store/clearing/clearingDirectoryStore";
import { useClearingOperationStore } from "@/store/clearing/clearingOperationStore";

import ClearingOperationTable from "@/features/clearing/components/ClearingOperationTable";
import ClearingSummary from "@/features/clearing/components/ClearingSummary";
import ClearingPeopleBalances from "@/features/clearing/components/ClearingPeopleBalances";

import ClearingPersonModal from "@/features/clearing/modals/ClearingPersonModal";

import { useClearingOperations } from "@/features/clearing/hooks/useClearingOperations";
import { useClearingPeople } from "@/features/clearing/hooks/useClearingPeople";

dayjs.locale("ru");

const { Text } = Typography;

const createEmptyDraft = () => ({
  sender_person_id: null,

  incoming_amount: null,
  incoming_percent: null,
  incoming_usd_rate: null,

  receiver_person_id: null,

  outgoing_percent: null,
  outgoing_usd_rate: null,

  comment: "",
});

const operationToDraft = (operation) => ({
  sender_person_id: operation.sender_person,

  incoming_amount: operation.incoming_amount,
  incoming_percent: operation.incoming_percent,
  incoming_usd_rate: operation.incoming_usd_rate,

  receiver_person_id: operation.receiver_person,

  outgoing_percent: operation.outgoing_percent,
  outgoing_usd_rate: operation.outgoing_usd_rate,

  comment: operation.comment || "",
});

export default function MainTab() {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [draft, setDraft] = useState(createEmptyDraft);
  const [drafts, setDrafts] = useState({});

  const {
    people,

    isLoadingPeople,
    isSubmitting: isDirectorySubmitting,
    error: directoryError,

    loadPeople,
    createPerson,
    updatePerson,

    clearDirectories,
  } = useClearingDirectoryStore();

  const {
    operations,
    summary,
    peopleBalances,

    isLoading,
    isSubmitting,
    error,

    loadOperations,
    createOperation,
    updateOperation,
    deleteOperation,

    clearOperations,
  } = useClearingOperationStore();

  const dateValue = selectedDate.format("YYYY-MM-DD");

  useEffect(() => {
    loadPeople();

    return () => {
      clearDirectories();
    };
  }, [loadPeople, clearDirectories]);

  useEffect(() => {
    loadOperations({
      date: dateValue,
    });

    return () => {
      clearOperations();
    };
  }, [dateValue, loadOperations, clearOperations]);

  const resolvedDrafts = useMemo(
    () =>
      Object.fromEntries(
        operations.map((operation) => [
          operation.id,
          {
            ...operationToDraft(operation),
            ...drafts[operation.id],
          },
        ])
      ),
    [operations, drafts]
  );

  const updateDraft = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateRowDraft = (rowId, field, value) => {
    const operation = operations.find((item) => item.id === rowId);

    if (!operation) return;

    setDrafts((prev) => ({
      ...prev,
      [rowId]: {
        ...operationToDraft(operation),
        ...prev[rowId],
        [field]: value,
      },
    }));
  };

  const {
    handleCreateOperation,
    handleUpdateOperation,
    handleDeleteOperation,
  } = useClearingOperations({
    draft,
    resolvedDrafts,
    dateValue,

    createOperation,
    updateOperation,
    deleteOperation,

    setDraft,
    setDrafts,

    createEmptyDraft,
  });

  const {
    personModal,
    emptyPersonForm,

    openCreatePerson,
    openEditPerson,
    closePersonModal,
    changePersonForm,
    handleSavePerson,
  } = useClearingPeople({
    people,
    createPerson,
    updatePerson,
    updateDraft,
    updateRowDraft,
  });

  const pageError = error || directoryError;

  const directoriesLoading = isLoadingPeople;

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {pageError && (
        <Alert
          type="error"
          message="Ошибка"
          description={
            typeof pageError === "string"
              ? pageError
              : JSON.stringify(pageError)
          }
          showIcon
        />
      )}

      <Card size="small">
        <Space wrap>
          <Text strong>Дата:</Text>

          <DatePicker
            value={selectedDate}
            format="DD.MM.YYYY"
            allowClear={false}
            onChange={(value) => {
              if (!value) return;

              setSelectedDate(value);
              setDraft(createEmptyDraft());
              setDrafts({});
            }}
          />

          <Text type="secondary">{selectedDate.format("D MMMM YYYY")}</Text>
        </Space>
      </Card>

      {(isLoading || directoriesLoading) && operations.length === 0 ? (
        <Spin />
      ) : (
        <Card title={`Операции за ${selectedDate.format("D MMMM")}`}>
          <ClearingOperationTable
            operations={operations}
            draft={draft}
            drafts={resolvedDrafts}
            isSubmitting={isSubmitting}
            onDraftChange={updateDraft}
            onRowChange={updateRowDraft}
            onCreate={handleCreateOperation}
            onUpdate={handleUpdateOperation}
            onDelete={handleDeleteOperation}
            onCreatePerson={openCreatePerson}
            onEditPerson={openEditPerson}
          />

          <ClearingSummary summary={summary} />

          <ClearingPeopleBalances rows={peopleBalances} />
        </Card>
      )}

      <ClearingPersonModal
        open={Boolean(personModal)}
        title={
          personModal?.mode === "edit"
            ? "Редактировать человека"
            : "Добавить человека"
        }
        form={personModal?.form || emptyPersonForm}
        loading={isDirectorySubmitting}
        onCancel={closePersonModal}
        onChange={changePersonForm}
        onSave={handleSavePerson}
      />
    </Space>
  );
}
