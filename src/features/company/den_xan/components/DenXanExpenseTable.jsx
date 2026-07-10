import { useMemo } from "react";
import { Button, DatePicker, Input, InputNumber, Table } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { formatMoney } from "@/utils/formatMoney";
import { moneyFormatter, moneyParser } from "../utils/numberInput";

export default function DenXanExpenseTable({
  expenses,
  draft,
  drafts,
  isSubmitting,
  onDraftChange,
  onRowChange,
  onCreate,
  onUpdate,
}) {
  const tableData = [
    {
      id: "__new__",
      isNew: true,
    },
    ...expenses,
  ];

  const columns = useMemo(
    () => [
      {
        title: "Название расхода",
        width: 220,
        render: (_, row) => (
          <Input
            value={row.isNew ? draft.name : drafts[row.id]?.name}
            placeholder="Например: Аренда"
            onChange={(event) =>
              row.isNew
                ? onDraftChange("name", event.target.value)
                : onRowChange(row.id, "name", event.target.value)
            }
          />
        ),
      },
      {
        title: "Сумма",
        width: 180,
        render: (_, row) => (
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            value={row.isNew ? draft.amount : drafts[row.id]?.amount}
            formatter={moneyFormatter}
            parser={moneyParser}
            onChange={(value) =>
              row.isNew
                ? onDraftChange("amount", value)
                : onRowChange(row.id, "amount", value)
            }
          />
        ),
      },
      {
        title: "Дата",
        width: 170,
        render: (_, row) => (
          <DatePicker
            style={{ width: "100%" }}
            value={
              row.isNew
                ? dayjs(draft.expense_date)
                : dayjs(drafts[row.id]?.expense_date)
            }
            format="DD.MM.YYYY"
            disabled={!row.isNew}
            onChange={(value) => {
              if (!row.isNew) return;
              onDraftChange(
                "expense_date",
                value ? value.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD")
              );
            }}
          />
        ),
      },
      {
        title: "Комментарий",
        width: 260,
        render: (_, row) => (
          <Input
            value={row.isNew ? draft.comment : drafts[row.id]?.comment}
            placeholder="Комментарий"
            onChange={(event) =>
              row.isNew
                ? onDraftChange("comment", event.target.value)
                : onRowChange(row.id, "comment", event.target.value)
            }
          />
        ),
      },
      {
        title: "",
        width: 130,
        render: (_, row) => (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            onClick={() => (row.isNew ? onCreate() : onUpdate(row))}
          >
            Сохранить
          </Button>
        ),
      },
    ],
    [draft, drafts, isSubmitting]
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tableData}
      pagination={false}
      scroll={{ x: 960 }}
    />
  );
}