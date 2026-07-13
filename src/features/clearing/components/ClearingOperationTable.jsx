import { useMemo } from "react";
import {
  Button,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";

import { formatMoney } from "@/utils/formatMoney";
import {
  moneyFormatter,
  moneyParser,
} from "@/features/company/den_xan/utils/numberInput";

import ClearingPersonField from "./ClearingPersonField";
import ClearingCompanyField from "./ClearingCompanyField";

import { formatUsd } from "../utils/formatCurrency";
import { calculateOperationPreview } from "../utils/calculateOperationPreview";

const { Text } = Typography;

const getInputValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    Number(value) === 0
  ) {
    return null;
  }

  return value;
};

export default function ClearingOperationTable({
  operations = [],
  draft,
  drafts,
  isSubmitting,

  onDraftChange,
  onRowChange,

  onCreate,
  onUpdate,
  onDelete,

  onCreatePerson,
  onEditPerson,
  onCreateCompany,
  onEditCompany,
}) {
  const rows = [
    {
      id: "__new__",
      isNew: true,
    },
    ...operations,
  ];

  const getRowDraft = (row) => (row.isNew ? draft : drafts[row.id] || {});

  const getCalculated = (row) => {
    if (row.isNew) {
      return calculateOperationPreview(draft);
    }

    const rowDraft = drafts[row.id];

    const hasChanged =
      rowDraft &&
      (String(rowDraft.incoming_amount) !== String(row.incoming_amount) ||
        String(rowDraft.incoming_percent) !== String(row.incoming_percent) ||
        String(rowDraft.incoming_usd_rate) !== String(row.incoming_usd_rate) ||
        String(rowDraft.outgoing_percent) !== String(row.outgoing_percent) ||
        String(rowDraft.outgoing_usd_rate) !== String(row.outgoing_usd_rate));

    if (hasChanged) {
      return calculateOperationPreview(rowDraft);
    }

    return {
      incoming_commission: row.incoming_commission,

      amount_to_give_uzs: row.amount_to_give_uzs,
      amount_to_give_usd: row.amount_to_give_usd,

      outgoing_commission: row.outgoing_commission,

      amount_to_receive_uzs: row.amount_to_receive_uzs,
      amount_to_receive_usd: row.amount_to_receive_usd,
    };
  };

  const changeValue = (row, field, value) => {
    if (row.isNew) {
      onDraftChange(field, value);
    } else {
      onRowChange(row.id, field, value);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Имя",
        width: 260,
        render: (_, row) => {
          const rowDraft = getRowDraft(row);

          return (
            <ClearingPersonField
              value={rowDraft.sender_person_id}
              onChange={(value) => changeValue(row, "sender_person_id", value)}
              onCreate={() =>
                onCreatePerson({
                  side: "sender",
                  row,
                })
              }
              onEdit={(personId) =>
                onEditPerson({
                  personId,
                  side: "sender",
                  row,
                })
              }
            />
          );
        },
      },

      {
        title: "Фирма прихода",
        width: 300,
        render: (_, row) => {
          const rowDraft = getRowDraft(row);

          return (
            <ClearingCompanyField
              value={rowDraft.sender_company_id}
              onChange={(value) => changeValue(row, "sender_company_id", value)}
              onCreate={() =>
                onCreateCompany({
                  side: "sender",
                  row,
                })
              }
              onEdit={(companyId) =>
                onEditCompany({
                  companyId,
                  side: "sender",
                  row,
                })
              }
            />
          );
        },
      },

      {
        title: "Сумма прихода",
        width: 180,
        render: (_, row) => {
          const rowDraft = getRowDraft(row);

          return (
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Сумма"
              value={getInputValue(rowDraft.incoming_amount)}
              formatter={moneyFormatter}
              parser={moneyParser}
              onChange={(value) => changeValue(row, "incoming_amount", value)}
            />
          );
        },
      },

      {
        title: "Комиссия прихода, %",
        width: 150,
        render: (_, row) => {
          const rowDraft = getRowDraft(row);

          return (
            <InputNumber
              min={0}
              max={100}
              precision={2}
              style={{ width: "100%" }}
              value={rowDraft.incoming_percent}
              onChange={(value) => changeValue(row, "incoming_percent", value)}
            />
          );
        },
      },

      {
        title: "Курс прихода",
        width: 170,
        render: (_, row) => {
          const rowDraft = getRowDraft(row);

          return (
            <InputNumber
              min={0.01}
              precision={2}
              style={{ width: "100%" }}
              placeholder="Например: 12 050"
              value={getInputValue(rowDraft.incoming_usd_rate)}
              formatter={moneyFormatter}
              parser={moneyParser}
              onChange={(value) => changeValue(row, "incoming_usd_rate", value)}
            />
          );
        },
      },

      {
        title: "Сумма к выдаче",
        width: 210,
        render: (_, row) => {
          const calculated = getCalculated(row);

          return (
            <Space direction="vertical" size={0}>
              <Text strong>{formatMoney(calculated.amount_to_give_uzs)}</Text>

              <Text type="secondary">
                {formatUsd(calculated.amount_to_give_usd)}
              </Text>
            </Space>
          );
        },
      },

      {
        title: "Кому",
        width: 260,
        render: (_, row) => {
          const rowDraft = getRowDraft(row);

          return (
            <ClearingPersonField
              value={rowDraft.receiver_person_id}
              onChange={(value) =>
                changeValue(row, "receiver_person_id", value)
              }
              onCreate={() =>
                onCreatePerson({
                  side: "receiver",
                  row,
                })
              }
              onEdit={(personId) =>
                onEditPerson({
                  personId,
                  side: "receiver",
                  row,
                })
              }
            />
          );
        },
      },

      {
        title: "Фирма получения",
        width: 300,
        render: (_, row) => {
          const rowDraft = getRowDraft(row);

          return (
            <ClearingCompanyField
              value={rowDraft.receiver_company_id}
              onChange={(value) =>
                changeValue(row, "receiver_company_id", value)
              }
              onCreate={() =>
                onCreateCompany({
                  side: "receiver",
                  row,
                })
              }
              onEdit={(companyId) =>
                onEditCompany({
                  companyId,
                  side: "receiver",
                  row,
                })
              }
            />
          );
        },
      },

      {
        title: "Комиссия получения, %",
        width: 170,
        render: (_, row) => {
          const rowDraft = getRowDraft(row);

          return (
            <InputNumber
              min={0}
              max={100}
              precision={2}
              style={{ width: "100%" }}
              value={rowDraft.outgoing_percent}
              onChange={(value) => changeValue(row, "outgoing_percent", value)}
            />
          );
        },
      },

      {
        title: "Курс получения",
        width: 170,
        render: (_, row) => {
          const rowDraft = getRowDraft(row);

          return (
            <InputNumber
              min={0.01}
              precision={2}
              style={{ width: "100%" }}
              placeholder="Например: 12 100"
              value={getInputValue(rowDraft.outgoing_usd_rate)}
              formatter={moneyFormatter}
              parser={moneyParser}
              onChange={(value) => changeValue(row, "outgoing_usd_rate", value)}
            />
          );
        },
      },

      {
        title: "Сумма получения",
        width: 210,
        render: (_, row) => {
          const calculated = getCalculated(row);

          return (
            <Space direction="vertical" size={0}>
              <Text strong>
                {formatMoney(calculated.amount_to_receive_uzs)}
              </Text>

              <Text type="secondary">
                {formatUsd(calculated.amount_to_receive_usd)}
              </Text>
            </Space>
          );
        },
      },

      {
        title: "Комментарий",
        width: 240,
        render: (_, row) => {
          const rowDraft = getRowDraft(row);

          return (
            <Input
              value={rowDraft.comment}
              placeholder="Комментарий"
              onChange={(event) =>
                changeValue(row, "comment", event.target.value)
              }
            />
          );
        },
      },

      {
        title: "Действия",
        width: 210,
        render: (_, row) => (
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={isSubmitting}
              onClick={() => (row.isNew ? onCreate() : onUpdate(row))}
            >
              Сохранить
            </Button>

            {!row.isNew && (
              <Popconfirm
                title="Удалить операцию?"
                description={"Операция исчезнет из взаиморасчётов."}
                okText="Удалить"
                cancelText="Отмена"
                okButtonProps={{
                  danger: true,
                }}
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
      operations,
      isSubmitting,
      onCreate,
      onUpdate,
      onDelete,
      onDraftChange,
      onRowChange,
      onCreatePerson,
      onEditPerson,
      onCreateCompany,
      onEditCompany,
    ]
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={rows}
      pagination={false}
      scroll={{
        x: 2800,
      }}
    />
  );
}
