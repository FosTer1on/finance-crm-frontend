import {
  Button,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Typography,
} from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";

import { formatMoney } from "@/shared/utils/formatMoney";
import {
  moneyFormatter,
  moneyParser,
} from "@/features/company/den_xan/utils/numberInput";

import ClearingPersonField from "../components/ClearingPersonField";
import { formatUsd } from "../utils/formatCurrency";

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

export const useClearingOperationColumns = ({
  isSubmitting,
  getRowDraft,
  getCalculated,
  changeValue,
  onCreate,
  onUpdate,
  onDelete,
  onCreatePerson,
  onEditPerson,
}) => [
  {
    title: "Имя",
    width: 140,
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
    title: "Сумма прихода",
    width: 140,
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
    width: 100,
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
    width: 100,
    render: (_, row) => {
      const rowDraft = getRowDraft(row);

      return (
        <InputNumber
          precision={2}
          style={{ width: "100%" }}
          value={getInputValue(rowDraft.incoming_usd_rate)}
          formatter={moneyFormatter}
          parser={moneyParser}
          onChange={(value) =>
            changeValue(
              row,
              "incoming_usd_rate",
              Number(value) > 0 ? value : null
            )
          }
        />
      );
    },
  },
  {
    title: "Сумма к выдаче",
    width: 120,
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
    width: 140,
    render: (_, row) => {
      const rowDraft = getRowDraft(row);

      return (
        <ClearingPersonField
          value={rowDraft.receiver_person_id}
          onChange={(value) => changeValue(row, "receiver_person_id", value)}
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
    title: "Комиссия получения, %",
    width: 100,
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
    width: 100,
    render: (_, row) => {
      const rowDraft = getRowDraft(row);

      return (
        <InputNumber
          precision={2}
          style={{ width: "100%" }}
          value={getInputValue(rowDraft.outgoing_usd_rate)}
          formatter={moneyFormatter}
          parser={moneyParser}
          onChange={(value) =>
            changeValue(
              row,
              "outgoing_usd_rate",
              Number(value) > 0 ? value : null
            )
          }
        />
      );
    },
  },
  {
    title: "Сумма получения",
    width: 140,
    render: (_, row) => {
      const calculated = getCalculated(row);

      return (
        <Space direction="vertical" size={0}>
          <Text strong>{formatMoney(calculated.amount_to_receive_uzs)}</Text>
          <Text type="secondary">
            {formatUsd(calculated.amount_to_receive_usd)}
          </Text>
        </Space>
      );
    },
  },
  {
    title: "Сохранить",
    width: 100,
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
            description="Операция исчезнет из взаиморасчётов."
            okText="Удалить"
            cancelText="Отмена"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(row)}
          >
            <Button danger icon={<DeleteOutlined />} disabled={isSubmitting} />
          </Popconfirm>
        )}
      </Space>
    ),
  },
  {
    title: "Комментарий",
    width: 200,
    render: (_, row) => {
      const rowDraft = getRowDraft(row);

      return (
        <Input
          value={rowDraft.comment}
          placeholder="Комментарий"
          onChange={(event) => changeValue(row, "comment", event.target.value)}
        />
      );
    },
  },
];
