import {
  Button,
  Empty,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { formatMoney } from "@/shared/utils/formatMoney";

const { Text } = Typography;

export default function OutgoingTable({
  outgoings = [],
  isLoading = false,
  deletingId = null,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      title: "Фирма",
      dataIndex: "partner_name",
      key: "partner_name",
      width: 280,
      align: "center",
      ellipsis: true,
      render: (value, row) => (
        <Space size={6}>
          <Text strong style={{ color: "#101828" }}>
            {value || "—"}
          </Text>

          {row.is_vat && <Tag color="blue">НДС</Tag>}
        </Space>
      ),
    },
    {
      title: "Сумма",
      dataIndex: "amount",
      key: "amount",
      width: 190,
      align: "center",
      render: (value) => (
        <Text style={{ color: "#101828" }}>{formatMoney(value)}</Text>
      ),
    },
    {
      title: "Комиссия",
      dataIndex: "service_percent",
      key: "service_percent",
      width: 120,
      align: "center",
      render: (value) => (
        <Text style={{ color: "#101828" }}>{Number(value || 0)}%</Text>
      ),
    },
    {
      title: "Кэш",
      dataIndex: "amount_after_percent",
      key: "amount_after_percent",
      width: 190,
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
      width: 90,
      align: "center",
      render: (_, row) => (
        <Space size={6}>
          <Tooltip title="Редактировать">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(row)}
            />
          </Tooltip>

          <Popconfirm
            title="Удалить исход?"
            description="Баланс рабочего счёта будет восстановлен."
            okText="Удалить"
            cancelText="Отмена"
            okButtonProps={{
              danger: true,
              loading: deletingId === row.id,
            }}
            onConfirm={() => onDelete(row)}
          >
            <Tooltip title="Удалить">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      size="middle"
      loading={isLoading}
      columns={columns}
      dataSource={outgoings}
      pagination={false}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Исходов за этот день пока нет"
          />
        ),
      }}
    />
  );
}
