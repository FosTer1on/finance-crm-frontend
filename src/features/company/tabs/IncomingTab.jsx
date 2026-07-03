import { Button, Card, Select, Space, Table, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { formatMoney } from "@utils/formatMoney";
import { useIncomingStore } from "@store/incoming/incomingStore";
import { useEffect } from "react";

const { Text } = Typography;

const statusOptions = [
  { value: "completed", label: "Выполнено" },
  { value: "cancelled", label: "Отменено" },
];

export default function IncomingTab({ company, onAfterStatusChange }) {
  const {
    transactions,
    summary,
    isLoading,
    isSubmitting,
    loadIncoming,
    clearIncoming,
    changeStatus,
  } = useIncomingStore();

  useEffect(() => {
    if (!company?.id) return;

    loadIncoming({ company: company.id });

    return () => {
      clearIncoming();
    };
  }, [company?.id, loadIncoming, clearIncoming]);

  const handleStatusChange = async (record, status) => {
    if (record.status === status) return;

    await changeStatus(record.id, status);

    if (onAfterStatusChange) {
      onAfterStatusChange();
    }
  };

  const statusColumn = {
    title: "Статус",
    dataIndex: "status",
    render: (status, record) => (
      <Select
        size="small"
        value={status}
        options={statusOptions}
        style={{ width: 120 }}
        loading={isSubmitting}
        onChange={(value) => handleStatusChange(record, value)}
      />
    ),
  };

  const standardColumns = [
    { title: "№", render: (_, __, index) => index + 1 },
    { title: "Фирма", dataIndex: "counterparty_name" },
    { title: "ИНН", dataIndex: "counterparty_inn" },
    { title: "Контакты", dataIndex: "counterparty_contacts" },
    { title: "Человек", dataIndex: "person_name" },
    { title: "Сумма", dataIndex: "amount", render: formatMoney },
    { title: "%", dataIndex: "service_percent" },
    {
      title: "После %",
      dataIndex: "amount_after_percent",
      render: formatMoney,
    },
    { title: "Дата", dataIndex: "transaction_date" },
    statusColumn,
    { title: "Комментарий", dataIndex: "comment" },
  ];

  const denXanColumns = [
    { title: "№", render: (_, __, index) => index + 1 },
    { title: "Дистрибьютор", dataIndex: "distributor_name" },
    { title: "Общая сумма", dataIndex: "amount", render: formatMoney },
    { title: "%", dataIndex: "service_percent" },
    { title: "Прибыль", dataIndex: "profit_amount", render: formatMoney },
    { title: "MTG", dataIndex: "mtg_amount", render: formatMoney },
    {
      title: "DEN XAN GROUP",
      dataIndex: "company_amount",
      render: formatMoney,
    },
    { title: "Дата", dataIndex: "transaction_date" },
    statusColumn,
    { title: "Комментарий", dataIndex: "comment" },
  ];

  const columns =
    company?.schema_type === "den_xan" ? denXanColumns : standardColumns;

  return (
    <Card
      title="Приходы"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          Добавить приход
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        loading={isLoading || isSubmitting}
        pagination={false}
        scroll={{ x: 1200 }}
      />

      <Card size="small" style={{ marginTop: 16 }}>
        <Space size="large" wrap>
          <Text>Общая сумма: {formatMoney(summary.totalAmount)}</Text>
          <Text>После %: {formatMoney(summary.totalAfterPercent)}</Text>
          <Text>Всего: {summary.operationsCount}</Text>
          <Text>Completed: {summary.completedCount}</Text>
          <Text>Cancelled: {summary.cancelledCount}</Text>
        </Space>
      </Card>
    </Card>
  );
}
