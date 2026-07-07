import { useMemo } from "react";
import {
  Button,
  InputNumber,
  Space,
  Table,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import { formatMoney } from "@/utils/formatMoney";
import {
  moneyFormatter,
  moneyParser,
} from "../utils/numberInput";

export default function DenXanTable({
  rows,
  drafts,
  isSubmitting,

  updateDraft,

  onAdd,
  onIncomingComment,
  onOutgoingComment,

  onSaveIncoming,
  onSaveOutgoing,
}) {
  const columns = useMemo(
    () => [
      {
        title: "",
        width: 60,
        render: (_, row) => (
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => onAdd(row)}
          />
        ),
      },

      {
        title: "Дистрибьютор",
        dataIndex: "distributor_name",
        width: 180,
      },

      {
        title: "Общая сумма",
        width: 210,

        render: (_, row) => (
          <Space>
            <InputNumber
              min={0}
              style={{ width: 150 }}
              value={drafts[row.id]?.total_amount}
              formatter={moneyFormatter}
              parser={moneyParser}
              onChange={(value) =>
                updateDraft(row.id, "total_amount", value)
              }
            />

            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onIncomingComment(row)}
            />
          </Space>
        ),
      },

      {
        title: "%",
        dataIndex: "service_percent",
        width: 70,
      },

      {
        title: "Прибыль",
        dataIndex: "profit_amount",
        width: 150,
        render: formatMoney,
      },

      {
        title: "MTG",
        width: 180,

        render: (_, row) => (
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={drafts[row.id]?.mtg_amount}
            formatter={moneyFormatter}
            parser={moneyParser}
            onChange={(value) =>
              updateDraft(row.id, "mtg_amount", value)
            }
          />
        ),
      },

      {
        title: "Поступило на счет",
        dataIndex: "amount_to_account",
        width: 180,
        render: formatMoney,
      },

      {
        title: "",
        width: 90,

        render: (_, row) => (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            onClick={() => onSaveIncoming(row)}
          />
        ),
      },

      {
        title: "Сумма исхода",
        width: 210,

        render: (_, row) => (
          <Space>
            <InputNumber
              min={0}
              style={{ width: 150 }}
              value={drafts[row.id]?.outgoing_amount}
              formatter={moneyFormatter}
              parser={moneyParser}
              onChange={(value) =>
                updateDraft(row.id, "outgoing_amount", value)
              }
            />

            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onOutgoingComment(row)}
            />
          </Space>
        ),
      },

      {
        title: "Фирма исхода",
        dataIndex: "outgoing_company_name",
        width: 170,
      },

      {
        title: "",
        width: 90,

        render: (_, row) => (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            onClick={() => onSaveOutgoing(row)}
          />
        ),
      },
    ],

    [drafts, isSubmitting]
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={rows}
      pagination={false}
      scroll={{ x: 1600 }}
    />
  );
}