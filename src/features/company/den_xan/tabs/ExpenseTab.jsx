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

const { Text } = Typography;

export default function ExpenseTab({ company, onAfterChange }) {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().startOf("month"));
  const [selectedDate, setSelectedDate] = useState(null);

  const [draft, setDraft] = useState({
    name: "",
    amount: null,
    expense_date: dayjs().format("YYYY-MM-DD"),
    comment: "",
  });

  const [drafts, setDrafts] = useState({});

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
  } = useDenXanExpenseStore();

  const loadData = () => {
    if (!company?.id) return;

    loadExpenses({
      company: company.id,
      month: selectedMonth.format("YYYY-MM-DD"),
      ...(selectedDate ? { date: selectedDate } : {}),
    });
  };

  useEffect(() => {
    loadData();

    return () => {
      clearExpenses();
    };
  }, [company?.id, selectedMonth, selectedDate]);

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
      [field]: value ?? "",
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

    if (!Number(draft.amount)) {
      message.error("Введите сумму расхода");
      return;
    }

    await createExpense({
      company_id: company.id,
      name: draft.name,
      amount: draft.amount || "0",
      expense_date: draft.expense_date,
      comment: draft.comment || "",
    });

    setDraft({
      name: "",
      amount: "0",
      expense_date: selectedDate || dayjs().format("YYYY-MM-DD"),
      comment: "",
    });

    message.success("Расход создан");
    loadData();
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

      <Space wrap>
        <Text strong>Месяц:</Text>
        <DatePicker
          picker="month"
          value={selectedMonth}
          format="MMMM YYYY"
          onChange={(value) => {
            if (value) {
              setSelectedMonth(value.startOf("month"));
              setSelectedDate(null);
            }
          }}
        />

        <Text strong>Дата:</Text>
        <Select
          style={{ width: 180 }}
          value={selectedDate || "all"}
          options={[
            { value: "all", label: "Все" },
            ...Array.from(
              { length: selectedMonth.daysInMonth() },
              (_, index) => {
                const date = selectedMonth.date(index + 1);
                return {
                  value: date.format("YYYY-MM-DD"),
                  label: date.format("DD.MM.YYYY"),
                };
              }
            ),
          ]}
          onChange={(value) => {
            setSelectedDate(value === "all" ? null : value);
            setDraft((prev) => ({
              ...prev,
              expense_date:
                value === "all" ? dayjs().format("YYYY-MM-DD") : value,
            }));
          }}
        />
      </Space>

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
        />

        <DenXanExpenseSummary summary={summary} />
      </Card>
    </Space>
  );
}