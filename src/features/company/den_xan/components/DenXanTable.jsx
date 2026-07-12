import { useMemo } from "react";
import { Button, InputNumber, Select, Space, Table } from "antd";
import {
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { formatMoney } from "@/utils/formatMoney";
import { moneyFormatter, moneyParser } from "../utils/numberInput";

export default function DenXanTable({
  rows,
  drafts,
  partners = [],
  isSubmitting,

  updateDraft,

  onAdd,
  onIncomingComment,
  onOutgoingComment,

  onSaveIncoming,
  onSaveOutgoing,

  onPartnerInfo,
  onCreatePartner,
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
        title: "Сумма прихода",
        width: 210,

        render: (_, row) => (
          <Space>
            <InputNumber
              min={0}
              style={{ width: 150 }}
              value={
                Number(drafts[row.id]?.total_amount) === 0
                  ? null
                  : drafts[row.id]?.total_amount
              }
              formatter={moneyFormatter}
              parser={moneyParser}
              onChange={(value) => updateDraft(row.id, "total_amount", value)}
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
        width: 90,
        render: (_, row) => (
          <InputNumber
            min={0}
            max={100}
            style={{ width: 70 }}
            value={drafts[row.id]?.service_percent}
            onChange={(value) => updateDraft(row.id, "service_percent", value)}
          />
        ),
      },

      {
        title: "Комиссия 6%",
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
            value={
              Number(drafts[row.id]?.mtg_amount) === 0
                ? null
                : drafts[row.id]?.mtg_amount
            }
            formatter={moneyFormatter}
            parser={moneyParser}
            onChange={(value) => updateDraft(row.id, "mtg_amount", value)}
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
            // icon={<SaveOutlined />}
            loading={isSubmitting}
            onClick={() => onSaveIncoming(row)}
          >
            Сохранить
          </Button>
        ),
      },

      {
        title: "Сумма вывода на рекламу",
        width: 210,

        render: (_, row) => (
          <Space>
            <InputNumber
              min={0}
              style={{ width: 150 }}
              value={
                Number(drafts[row.id]?.outgoing_amount) === 0
                  ? null
                  : drafts[row.id]?.outgoing_amount
              }
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
        title: "%",
        width: 100,
        render: (_, row) => (
          <InputNumber
            min={0}
            max={100}
            style={{ width: 80 }}
            value={drafts[row.id]?.outgoing_percent}
            onChange={(value) => updateDraft(row.id, "outgoing_percent", value)}
          />
        ),
      },
      {
        title: "Кэш от рекламы",
        dataIndex: "outgoing_after_percent",
        width: 170,
        render: formatMoney,
      },

      {
        title: "Фирма рекламы",
        width: 300,
        render: (_, row) => (
          <Space>
            <Button
              size="small"
              icon={<ExclamationCircleOutlined />}
              onClick={() => onPartnerInfo(drafts[row.id]?.outgoing_partner_id)}
            />

            <Select
              style={{ width: 190 }}
              placeholder="Выберите фирму"
              value={drafts[row.id]?.outgoing_partner_id || undefined}
              options={partners.map((partner) => ({
                value: partner.id,
                label: partner.name,
              }))}
              onChange={(value) =>
                updateDraft(row.id, "outgoing_partner_id", value)
              }
            />

            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={onCreatePartner}
            />
          </Space>
        ),
      },

      {
        title: "",
        width: 90,

        render: (_, row) => (
          <Button
            type="primary"
            // icon={<SaveOutlined />}
            loading={isSubmitting}
            onClick={() => onSaveOutgoing(row)}
          >
            Сохранить
          </Button>
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
