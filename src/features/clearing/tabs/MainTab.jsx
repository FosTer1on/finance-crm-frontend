import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Card,
  DatePicker,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";

import { useClearingDirectoryStore } from "@/store/clearing/clearingDirectoryStore";
import { useClearingOperationStore } from "@/store/clearing/clearingOperationStore";

import ClearingOperationTable from "@/features/clearing/components/ClearingOperationTable";
import ClearingSummary from "@/features/clearing/components/ClearingSummary";
import ClearingPeopleBalances from "@/features/clearing/components/ClearingPeopleBalances";

import ClearingPersonModal from "@/features/clearing/modals/ClearingPersonModal";

import { useClearingOperations } from "@/features/clearing/hooks/useClearingOperations";


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

const emptyPersonForm = {
  id: null,
  name: "",
  comment: "",
  is_active: true,
};

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

  const [personModal, setPersonModal] = useState(null);

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

  const applyPersonToTarget = (target, personId) => {
    const field =
      target.side === "sender" ? "sender_person_id" : "receiver_person_id";

    if (target.row.isNew) {
      updateDraft(field, personId);
    } else {
      updateRowDraft(target.row.id, field, personId);
    }
  };

  const openCreatePerson = ({ side, row }) => {
    setPersonModal({
      mode: "create",
      target: {
        side,
        row,
      },
      form: {
        ...emptyPersonForm,
      },
    });
  };

  const openEditPerson = ({ personId, side, row }) => {
    const person = people.find((item) => item.id === personId);

    if (!person) {
      message.error("Человек не найден");
      return;
    }

    setPersonModal({
      mode: "edit",
      target: {
        side,
        row,
      },
      form: {
        id: person.id,
        name: person.name || "",
        comment: person.comment || "",
        is_active: person.is_active ?? true,
      },
    });
  };

  const handleSavePerson = async () => {
    const name = personModal?.form?.name?.trim();

    if (!name) {
      message.error("Введите имя");
      return;
    }

    const payload = {
      name,
      comment: personModal.form.comment || "",
      is_active: personModal.form.is_active ?? true,
    };

    let savedPerson;

    if (personModal.mode === "edit") {
      savedPerson = await updatePerson(personModal.form.id, payload);

      message.success("Данные человека обновлены");
    } else {
      savedPerson = await createPerson(payload);

      message.success("Человек создан");
    }

    applyPersonToTarget(personModal.target, savedPerson.id);

    setPersonModal(null);
  };

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
        onCancel={() => setPersonModal(null)}
        onChange={(field, value) =>
          setPersonModal((prev) => ({
            ...prev,
            form: {
              ...prev.form,
              [field]: value,
            },
          }))
        }
        onSave={handleSavePerson}
      />
    </Space>
  );
}
