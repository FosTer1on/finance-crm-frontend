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

import { useDenXanCashStore } from "@/store/denXanCash/denXanCashStore";

import DenXanCashTable from "../components/DenXanCashTable";
import DenXanCashSummary from "../components/DenXanCashSummary";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const createEmptyDraft = () => ({
  name: "",
  amount: null,
  operation_date: dayjs().format("YYYY-MM-DD"),
  comment: "",
});

export default function CashExpensesTab({ company }) {
  const [period, setPeriod] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [draft, setDraft] = useState(
    createEmptyDraft
  );
  const [drafts, setDrafts] = useState({});

  const {
    account,
    operations,
    summary,
    isLoading,
    isSubmitting,
    error,
    loadCash,
    createOperation,
    updateOperation,
    deleteOperation,
    clearCash,
  } = useDenXanCashStore();

  const dateFrom = period?.[0]?.format("YYYY-MM-DD");
  const dateTo = period?.[1]?.format("YYYY-MM-DD");

  const loadData = () => {
    if (!company?.id) return;

    loadCash({
      company: company.id,
      ...(dateFrom ? { date_from: dateFrom } : {}),
      ...(dateTo ? { date_to: dateTo } : {}),
    });
  };

  useEffect(() => {
    loadData();

    return () => {
      clearCash();
    };
  }, [company?.id, dateFrom, dateTo]);

  useEffect(() => {
    const nextDrafts = {};

    operations.forEach((operation) => {
      nextDrafts[operation.id] = {
        name: operation.name,
        amount: operation.amount,
        operation_date: operation.operation_date,
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

  const handleCreate = async () => {
    if (!draft.name?.trim()) {
      message.error("Введите название операции");
      return;
    }

    if (
      draft.amount === null ||
      draft.amount === undefined ||
      Number(draft.amount) === 0
    ) {
      message.error("Введите ненулевую сумму");
      return;
    }

    if (!draft.operation_date) {
      message.error("Выберите дату");
      return;
    }

    await createOperation({
      company_id: company.id,
      operation_date: draft.operation_date,
      name: draft.name.trim(),
      amount: draft.amount,
      comment: draft.comment || "",
    });

    setDraft(createEmptyDraft());

    message.success("Кэш-операция создана");
  };

  const handleUpdate = async (row) => {
    const rowDraft = drafts[row.id];

    if (!rowDraft?.name?.trim()) {
      message.error("Введите название операции");
      return;
    }

    if (
      rowDraft.amount === null ||
      rowDraft.amount === undefined ||
      Number(rowDraft.amount) === 0
    ) {
      message.error("Введите ненулевую сумму");
      return;
    }

    await updateOperation(row.id, {
      name: rowDraft.name.trim(),
      amount: rowDraft.amount,
      comment: rowDraft.comment || "",
    });

    message.success("Кэш-операция обновлена");
  };

  const handleDelete = async (row) => {
    await deleteOperation(row.id);

    message.success("Кэш-операция удалена");
  };

  if (isLoading && !account) {
    return <Spin />;
  }

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ width: "100%" }}
    >
      {error && (
        <Alert
          type="error"
          message="Ошибка"
          description={String(error)}
          showIcon
        />
      )}

      <Space wrap>
        <Text strong>Период:</Text>

        <RangePicker
          value={period}
          format="DD.MM.YYYY"
          onChange={(values) => {
            if (values?.[0] && values?.[1]) {
              setPeriod(values);
            }
          }}
        />
      </Space>

      <DenXanCashSummary
          account={account}
          summary={summary}
        />

      <Card title="Расходы кэш">
        <DenXanCashTable
          operations={operations}
          draft={draft}
          drafts={drafts}
          isSubmitting={isSubmitting}
          onDraftChange={updateDraft}
          onRowChange={updateRowDraft}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </Card>
    </Space>
  );
}