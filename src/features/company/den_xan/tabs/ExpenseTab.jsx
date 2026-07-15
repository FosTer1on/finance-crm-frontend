import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  DatePicker,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";

import { useDenXanExpenseStore } from "@/store/denXanExpense/denXanExpenseStore";

import DenXanExpenseTable from "../components/DenXanExpenseTable";
import DenXanExpenseSummary from "../components/DenXanExpenseSummary";
import DenXanExpenseGroups from "../components/DenXanExpenseGroups";
import DenXanPeriodFilter from "../components/DenXanPeriodFilter";
import { getPeriodRange } from "../utils/periodPresets";

const { Text } = Typography;

export default function ExpenseTab({ company, onAfterChange }) {
  const [period, setPeriod] = useState(getPeriodRange("month"));

  const [activePreset, setActivePreset] = useState("month");

  const createEmptyDraft = () => ({
    name: "",
    amount: null,
    expense_date: dayjs().format("YYYY-MM-DD"),
    comment: "",
  });

  const [draft, setDraft] = useState(createEmptyDraft);

  const [drafts, setDrafts] = useState({});

  const dateFrom = period?.[0]?.format("YYYY-MM-DD");
  const dateTo = period?.[1]?.format("YYYY-MM-DD");

  const {
    expenses,
    summary,
    isLoading,
    isSubmitting,
    error,
    loadExpenses,
    createExpense,
    updateExpense,
    clearExpenses,
    deleteExpense,
  } = useDenXanExpenseStore();

  const loadData = async () => {
    if (!company?.id || !dateFrom || !dateTo) {
      return;
    }
  
    await loadExpenses({
      company: company.id,
      date_from: dateFrom,
      date_to: dateTo,
    });
  };

  useEffect(() => {
    if (!company?.id || !dateFrom || !dateTo) return;

    loadExpenses({
      company: company.id,
      date_from: dateFrom,
      date_to: dateTo,
    });
  }, [company?.id, dateFrom, dateTo, loadExpenses]);

  useEffect(() => {
    const nextDrafts = {};

    expenses.forEach((expense) => {
      nextDrafts[expense.id] = {
        name: expense.name,
        amount: expense.amount,
        expense_date: expense.expense_date,
        comment: expense.comment || "",
      };
    });

    setDrafts(nextDrafts);
  }, [expenses]);

  const updateDraft = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      [field]:
        field === "amount"
          ? value ?? null
          : value ?? "",
    }));
  };

  const updateRowDraft = (id, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value ?? "",
      },
    }));
  };

  const handleCreate = async () => {
    if (!draft.name?.trim()) {
      message.error("Введите название расхода");
      return;
    }
  
    if (
      draft.amount === null ||
      draft.amount === undefined ||
      Number(draft.amount) <= 0
    ) {
      message.error("Введите сумму расхода");
      return;
    }
  
    await createExpense({
      company_id: company.id,
      name: draft.name.trim(),
      amount: draft.amount,
      expense_date: draft.expense_date,
      comment: draft.comment || "",
    });
  
    setDraft(createEmptyDraft());
  
    message.success("Расход создан");
  
    await loadData();
    onAfterChange?.();
  };

  const handleUpdate = async (row) => {
    const rowDraft = drafts[row.id];

    if (!rowDraft?.name?.trim()) {
      message.error("Введите название расхода");
      return;
    }

    await updateExpense(row.id, {
      name: rowDraft.name,
      amount: rowDraft.amount || "0",
      comment: rowDraft.comment || "",
    });

    message.success("Расход обновлён");
    loadData();
    onAfterChange?.();
  };

  const handleDelete = async (row) => {
    await deleteExpense(row.id);

    message.success("Расход удалён");

    await loadData();

    onAfterChange?.();
  };

  if (isLoading) return <Spin />;

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
        }}
      />

      <Card title="Прочие расходы">
        <DenXanExpenseTable
          expenses={expenses}
          draft={draft}
          drafts={drafts}
          isSubmitting={isSubmitting}
          onDraftChange={updateDraft}
          onRowChange={updateRowDraft}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />

        <DenXanExpenseSummary summary={summary} />

        <DenXanExpenseGroups groups={summary?.groups || []} />
      </Card>
    </Space>
  );
}
