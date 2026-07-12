import { useMemo } from "react";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import {
  moneyFormatter,
  moneyParser,
} from "../../utils/numberInput";

const { Text } = Typography;

const getAmountValue = (value, hideZero) => {
  if (
    hideZero &&
    (value === null ||
      value === undefined ||
      value === "" ||
      Number(value) === 0)
  ) {
    return null;
  }

  return value;
};

export default function DenXanOperationTable({
  operations = [],
  draft,
  drafts,
  isSubmitting,

  onDraftChange,
  onRowChange,
  onCreate,
  onUpdate,
  onDelete,

  nameTitle = "Название",
  namePlaceholder = "Введите название",
  amountTitle = "Сумма",
  commentTitle = "Комментарий",

  allowNegative = false,
  hideZeroInNewRow = true,
  canEditDate = false,

  deleteTitle = "Удалить операцию?",
  deleteDescription = "Операция будет удалена.",
  emptyText = "Операций пока нет",
}) {
  const tableData = [
    {
      id: "__new__",
      isNew: true,
    },
    ...operations,
  ];

  const columns = useMemo(
    () => [
      {
        title: nameTitle,
        width: 240,
        render: (_, row) => {
          const value = row.isNew
            ? draft.name
            : drafts[row.id]?.name;

          return (
            <Input
              value={value}
              placeholder={namePlaceholder}
              onChange={(event) => {
                const nextValue = event.target.value;

                if (row.isNew) {
                  onDraftChange("name", nextValue);
                } else {
                  onRowChange(row.id, "name", nextValue);
                }
              }}
            />
          );
        },
      },
      {
        title: amountTitle,
        width: 200,
        render: (_, row) => {
          const rawValue = row.isNew
            ? draft.amount
            : drafts[row.id]?.amount;

          return (
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <InputNumber
                min={allowNegative ? undefined : 0}
                style={{ width: "100%" }}
                placeholder={
                  allowNegative
                    ? "Например: 3 000 или -3 000"
                    : "Введите сумму"
                }
                value={getAmountValue(
                  rawValue,
                  row.isNew && hideZeroInNewRow
                )}
                formatter={moneyFormatter}
                parser={moneyParser}
                onChange={(value) => {
                  if (row.isNew) {
                    onDraftChange("amount", value);
                  } else {
                    onRowChange(row.id, "amount", value);
                  }
                }}
              />
            </Space>
          );
        },
      },
      {
        title: "Дата",
        width: 170,
        render: (_, row) => {
          const dateValue = row.isNew
            ? draft.operation_date || draft.expense_date
            : drafts[row.id]?.operation_date ||
              drafts[row.id]?.expense_date;

          return (
            <DatePicker
              style={{ width: "100%" }}
              value={dateValue ? dayjs(dateValue) : null}
              format="DD.MM.YYYY"
              disabled={!row.isNew && !canEditDate}
              onChange={(value) => {
                if (!row.isNew && !canEditDate) return;

                const field = draft.operation_date !== undefined
                  ? "operation_date"
                  : "expense_date";

                const nextValue = value
                  ? value.format("YYYY-MM-DD")
                  : null;

                if (row.isNew) {
                  onDraftChange(field, nextValue);
                } else {
                  onRowChange(row.id, field, nextValue);
                }
              }}
            />
          );
        },
      },
      {
        title: commentTitle,
        width: 280,
        render: (_, row) => {
          const value = row.isNew
            ? draft.comment
            : drafts[row.id]?.comment;

          return (
            <Input
              value={value}
              placeholder="Комментарий"
              onChange={(event) => {
                const nextValue = event.target.value;

                if (row.isNew) {
                  onDraftChange("comment", nextValue);
                } else {
                  onRowChange(row.id, "comment", nextValue);
                }
              }}
            />
          );
        },
      },
      {
        title: "Действия",
        width: 230,
        render: (_, row) => (
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={isSubmitting}
              onClick={() => {
                if (row.isNew) {
                  onCreate();
                } else {
                  onUpdate(row);
                }
              }}
            >
              Сохранить
            </Button>

            {!row.isNew && onDelete && (
              <Popconfirm
                title={deleteTitle}
                description={deleteDescription}
                okText="Удалить"
                cancelText="Отмена"
                okButtonProps={{ danger: true }}
                onConfirm={() => onDelete(row)}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={isSubmitting}
                />
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ],
    [
      draft,
      drafts,
      isSubmitting,
      allowNegative,
      canEditDate,
      hideZeroInNewRow,
      nameTitle,
      namePlaceholder,
      amountTitle,
      commentTitle,
      deleteTitle,
      deleteDescription,
      onCreate,
      onUpdate,
      onDelete,
      onDraftChange,
      onRowChange,
    ]
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tableData}
      pagination={false}
      scroll={{ x: 1100 }}
      locale={{ emptyText }}
    />
  );
}