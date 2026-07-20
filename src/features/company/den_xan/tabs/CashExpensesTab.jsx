import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Space, Spin, message } from "antd";
import dayjs from "dayjs";

import { useDenXanCashStore } from "@/store/denXanCash/denXanCashStore";

import DenXanCashTable from "../components/DenXanCashTable";
import DenXanCashSummary from "../components/DenXanCashSummary";
import DenXanPeriodFilter from "../components/DenXanPeriodFilter";

import { getPeriodRange } from "../utils/periodPresets";

const createEmptyDraft = () => ({
  name: "",
  amount: null,
  operation_date: dayjs().format("YYYY-MM-DD"),
  comment: "",
});

const operationToDraft = (operation) => ({
  name: operation.name,
  amount: operation.amount,
  operation_date: operation.operation_date,
  comment: operation.comment || "",
});

export default function CashExpensesTab({ company }) {
  const [period, setPeriod] = useState(getPeriodRange("month"));

  const [activePreset, setActivePreset] = useState("month");

  const [draft, setDraft] = useState(createEmptyDraft);
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

  useEffect(() => {
    if (!company?.id) return;

    loadCash({
      company: company.id,
      ...(dateFrom ? { date_from: dateFrom } : {}),
      ...(dateTo ? { date_to: dateTo } : {}),
    });

    return () => {
      clearCash();
    };
  }, [company?.id, dateFrom, dateTo, loadCash, clearCash]);

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
    const rowDraft = resolvedDrafts[row.id];

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

    setDrafts((prev) => {
      const next = { ...prev };
      delete next[row.id];
      return next;
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
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {error && (
        <Alert
          type="error"
          message="Ошибка"
          description={String(error)}
          showIcon
        />
      )}

      <DenXanPeriodFilter
        value={period}
        activePreset={activePreset}
        onChange={({ range, preset }) => {
          setPeriod(range);
          setActivePreset(preset);
          setDrafts({});
        }}
      />

      <DenXanCashSummary account={account} summary={summary} />

      <Card title="Расходы кэш">
        <DenXanCashTable
          operations={operations}
          draft={draft}
          drafts={resolvedDrafts}
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
