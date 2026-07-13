import { useEffect, useState } from "react";
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
import ClearingCompanyModal from "@/features/clearing/modals/ClearingCompanyModal";

dayjs.locale("ru");

const { Title, Text } = Typography;

const createEmptyDraft = () => ({
  sender_person_id: null,
  sender_company_id: null,

  incoming_amount: null,
  incoming_percent: null,
  incoming_usd_rate: null,

  receiver_person_id: null,
  receiver_company_id: null,

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

const emptyCompanyForm = {
  id: null,
  name: "",
  inn: "",
  comment: "",
  is_active: true,
};

export default function ClearingPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [draft, setDraft] = useState(createEmptyDraft);
  const [drafts, setDrafts] = useState({});

  const [personModal, setPersonModal] = useState(null);
  const [companyModal, setCompanyModal] = useState(null);

  const {
    people,
    companies,

    isLoadingPeople,
    isLoadingCompanies,
    isSubmitting: isDirectorySubmitting,
    error: directoryError,

    loadPeople,
    loadCompanies,

    createPerson,
    updatePerson,
    createCompany,
    updateCompany,

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
    Promise.all([loadPeople(), loadCompanies()]);

    return () => {
      clearDirectories();
    };
  }, [loadPeople, loadCompanies, clearDirectories]);

  useEffect(() => {
    loadOperations({
      date: dateValue,
    });

    return () => {
      clearOperations();
    };
  }, [dateValue, loadOperations, clearOperations]);

  useEffect(() => {
    const nextDrafts = {};

    operations.forEach((operation) => {
      nextDrafts[operation.id] = {
        sender_person_id: operation.sender_person,
        sender_company_id: operation.sender_company,

        incoming_amount: operation.incoming_amount,
        incoming_percent: operation.incoming_percent,
        incoming_usd_rate: operation.incoming_usd_rate,

        receiver_person_id: operation.receiver_person,
        receiver_company_id: operation.receiver_company,

        outgoing_percent: operation.outgoing_percent,
        outgoing_usd_rate: operation.outgoing_usd_rate,

        comment: operation.comment || "",
      };
    });

    setDrafts(nextDrafts);
  }, [operations]);

  const updateDraft = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateRowDraft = (rowId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }));
  };

  const validateOperation = (form) => {
    if (!form.sender_person_id) {
      message.error("Выберите имя отправителя");
      return false;
    }

    if (!form.sender_company_id) {
      message.error("Выберите фирму прихода");
      return false;
    }

    if (
      form.incoming_amount === null ||
      form.incoming_amount === undefined ||
      Number(form.incoming_amount) <= 0
    ) {
      message.error("Введите сумму прихода");
      return false;
    }

    if (form.incoming_percent === null || form.incoming_percent === undefined) {
      message.error("Введите комиссию прихода");
      return false;
    }

    if (
      form.incoming_usd_rate === null ||
      form.incoming_usd_rate === undefined ||
      Number(form.incoming_usd_rate) <= 0
    ) {
      message.error("Введите курс прихода");
      return false;
    }

    if (!form.receiver_person_id) {
      message.error("Выберите получателя");
      return false;
    }

    if (!form.receiver_company_id) {
      message.error("Выберите фирму получения");
      return false;
    }

    if (form.outgoing_percent === null || form.outgoing_percent === undefined) {
      message.error("Введите комиссию получения");
      return false;
    }

    if (
      form.outgoing_usd_rate === null ||
      form.outgoing_usd_rate === undefined ||
      Number(form.outgoing_usd_rate) <= 0
    ) {
      message.error("Введите курс получения");
      return false;
    }

    return true;
  };

  const buildOperationPayload = (form) => ({
    operation_date: dateValue,

    sender_person_id: form.sender_person_id,
    sender_company_id: form.sender_company_id,

    incoming_amount: form.incoming_amount,
    incoming_percent: form.incoming_percent,
    incoming_usd_rate: form.incoming_usd_rate,

    receiver_person_id: form.receiver_person_id,
    receiver_company_id: form.receiver_company_id,

    outgoing_percent: form.outgoing_percent,
    outgoing_usd_rate: form.outgoing_usd_rate,

    comment: form.comment || "",
  });

  const handleCreateOperation = async () => {
    if (!validateOperation(draft)) return;

    await createOperation(buildOperationPayload(draft));

    setDraft(createEmptyDraft());

    message.success("Операция создана");
  };

  const handleUpdateOperation = async (row) => {
    const rowDraft = drafts[row.id];

    if (!rowDraft) {
      message.error("Данные операции не найдены");
      return;
    }

    if (!validateOperation(rowDraft)) return;

    await updateOperation(row.id, buildOperationPayload(rowDraft));

    message.success("Операция обновлена");
  };

  const handleDeleteOperation = async (row) => {
    await deleteOperation(row.id);

    message.success("Операция удалена");
  };

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

  const applyCompanyToTarget = (target, companyId) => {
    const field =
      target.side === "sender" ? "sender_company_id" : "receiver_company_id";

    if (target.row.isNew) {
      updateDraft(field, companyId);
    } else {
      updateRowDraft(target.row.id, field, companyId);
    }
  };

  const openCreateCompany = ({ side, row }) => {
    setCompanyModal({
      mode: "create",
      target: {
        side,
        row,
      },
      form: {
        ...emptyCompanyForm,
      },
    });
  };

  const openEditCompany = ({ companyId, side, row }) => {
    const company = companies.find((item) => item.id === companyId);

    if (!company) {
      message.error("Фирма не найдена");
      return;
    }

    setCompanyModal({
      mode: "edit",
      target: {
        side,
        row,
      },
      form: {
        id: company.id,
        name: company.name || "",
        inn: company.inn || "",
        comment: company.comment || "",
        is_active: company.is_active ?? true,
      },
    });
  };

  const handleSaveCompany = async () => {
    const name = companyModal?.form?.name?.trim();

    if (!name) {
      message.error("Введите название фирмы");
      return;
    }

    const payload = {
      name,
      inn: companyModal.form.inn || "",
      comment: companyModal.form.comment || "",
      is_active: companyModal.form.is_active ?? true,
    };

    let savedCompany;

    if (companyModal.mode === "edit") {
      savedCompany = await updateCompany(companyModal.form.id, payload);

      message.success("Фирма обновлена");
    } else {
      savedCompany = await createCompany(payload);

      message.success("Фирма создана");
    }

    applyCompanyToTarget(companyModal.target, savedCompany.id);

    setCompanyModal(null);
  };

  const pageError = error || directoryError;

  const directoriesLoading = isLoadingPeople || isLoadingCompanies;

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={2} style={{ marginBottom: 4 }}>
          Взаиморасчёты
        </Title>

        <Text type="secondary">
          Переводы между фирмами и расчёты по ответственным лицам
        </Text>
      </div>

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
              if (value) {
                setSelectedDate(value);
                setDraft(createEmptyDraft());
              }
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
            drafts={drafts}
            isSubmitting={isSubmitting}
            onDraftChange={updateDraft}
            onRowChange={updateRowDraft}
            onCreate={handleCreateOperation}
            onUpdate={handleUpdateOperation}
            onDelete={handleDeleteOperation}
            onCreatePerson={openCreatePerson}
            onEditPerson={openEditPerson}
            onCreateCompany={openCreateCompany}
            onEditCompany={openEditCompany}
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

      <ClearingCompanyModal
        open={Boolean(companyModal)}
        title={
          companyModal?.mode === "edit"
            ? "Редактировать фирму"
            : "Добавить фирму"
        }
        form={companyModal?.form || emptyCompanyForm}
        loading={isDirectorySubmitting}
        onCancel={() => setCompanyModal(null)}
        onChange={(field, value) =>
          setCompanyModal((prev) => ({
            ...prev,
            form: {
              ...prev.form,
              [field]: value,
            },
          }))
        }
        onSave={handleSaveCompany}
      />
    </Space>
  );
}
