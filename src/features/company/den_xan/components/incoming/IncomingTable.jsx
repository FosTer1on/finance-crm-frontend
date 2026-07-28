import { Button, InputNumber, Space, Table, Tooltip, Typography } from "antd";
import {
  CheckCircleOutlined,
  CommentOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { formatMoney } from "@/shared/utils/formatMoney";
import { moneyFormatter, moneyParser } from "../../utils/numberInput";

const { Text } = Typography;

export default function IncomingTable({
  rows,
  drafts,
  updateDraft,
  savingRowIds = [],
  savedRowIds = [],
  onAdd,
  onComment,
  onAutoSave,
}) {
  const buildNextDraft = (row, field, value) => ({
    ...drafts[row.id],
    [field]: value ?? "0",
  });

  const handleSaveField = (row, field, value) => {
    const nextDraft = buildNextDraft(row, field, value);

    updateDraft(row.id, field, value);
    onAutoSave(row, nextDraft);
  };

  const renderSaveStatus = (row) => {
    const isSaving = savingRowIds.includes(row.id);
    const isSaved = savedRowIds.includes(row.id);

    if (isSaving) {
      return (
        <Tooltip title="Сохраняется">
          <LoadingOutlined />
        </Tooltip>
      );
    }

    if (isSaved) {
      return (
        <Tooltip title="Сохранено">
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
        </Tooltip>
      );
    }

    return null;
  };

  const columns = [
    {
      title: "Дистрибьютор",
      dataIndex: "distributor_name",
      key: "distributor_name",
      align: "center",
      width: 165,
      ellipsis: true,
      render: (value) => (
        <Text strong style={{ color: "#101828" }}>
          {value}
        </Text>
      ),
    },
    {
      title: "Приход",
      key: "total_amount",
      align: "center",
      width: 165,
      render: (_, row) => {
        const value = drafts[row.id]?.total_amount;
        const isSaving = savingRowIds.includes(row.id);

        return (
          <InputNumber
            min={0}
            controls={false}
            disabled={isSaving}
            style={{ width: "100%" }}
            value={Number(value) === 0 ? null : value}
            formatter={moneyFormatter}
            parser={moneyParser}
            placeholder="0"
            onChange={(nextValue) =>
              updateDraft(row.id, "total_amount", nextValue)
            }
            onBlur={(event) =>
              handleSaveField(
                row,
                "total_amount",
                moneyParser(event.target.value)
              )
            }
            onPressEnter={(event) => event.currentTarget.blur()}
          />
        );
      },
    },
    {
      title: "%",
      key: "service_percent",
      align: "center",
      width: 40,
      render: (_, row) => {
        const value = drafts[row.id]?.service_percent;
        const isSaving = savingRowIds.includes(row.id);

        return (
          <InputNumber
            max={100}
            controls={false}
            disabled={isSaving}
            style={{ width: "100%" }}
            value={value}
            onChange={(nextValue) =>
              updateDraft(row.id, "service_percent", nextValue)
            }
            onBlur={() => handleSaveField(row, "service_percent", value)}
            onPressEnter={(event) => event.currentTarget.blur()}
          />
        );
      },
    },
    {
      title: "Комиссия",
      dataIndex: "profit_amount",
      key: "profit_amount",
      align: "center",
      width: 130,
      render: (value) => (
        <Text style={{ color: "#101828" }}>{formatMoney(value)}</Text>
      ),
    },
    {
      title: "MTG",
      key: "mtg_amount",
      align: "center",
      width: 150,
      render: (_, row) => {
        const value = drafts[row.id]?.mtg_amount;
        const isSaving = savingRowIds.includes(row.id);

        return (
          <InputNumber
            min={0}
            controls={false}
            disabled={isSaving}
            style={{ width: "100%" }}
            value={Number(value) === 0 ? null : value}
            formatter={moneyFormatter}
            parser={moneyParser}
            placeholder="0"
            onChange={(nextValue) =>
              updateDraft(row.id, "mtg_amount", nextValue)
            }
            onBlur={(event) =>
              handleSaveField(
                row,
                "mtg_amount",
                moneyParser(event.target.value)
              )
            }
            onPressEnter={(event) => event.currentTarget.blur()}
          />
        );
      },
    },
    {
      title: "На счёт",
      dataIndex: "amount_to_account",
      key: "amount_to_account",
      width: 140,
      align: "center",
      render: (value) => (
        <Text strong style={{ color: "#101828" }}>
          {formatMoney(value)}
        </Text>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 105,
      align: "left",
      render: (_, row) => (
        <Space size={6}>
          <Tooltip title="Добавить сумму">
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => onAdd(row)}
            />
          </Tooltip>

          <Tooltip title="Комментарий">
            <Button
              size="small"
              icon={<CommentOutlined />}
              onClick={() => onComment(row)}
            />
          </Tooltip>

          <span style={{ width: 16 }}>{renderSaveStatus(row)}</span>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      size="middle"
      columns={columns}
      dataSource={rows}
      pagination={false}
      tableLayout="fixed"
    />
  );
}
