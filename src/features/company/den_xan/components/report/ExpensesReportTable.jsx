import { Card, Table, Typography } from "antd";
import dayjs from "dayjs";

import { formatMoney } from "@/shared/utils/formatMoney";

const { Text } = Typography;

export default function ExpensesReportTable({ rows = [] }) {
  const columns = [
    {
      title: "Дата",
      dataIndex: "date",
      width: 120,
      render: (value) => dayjs(value).format("DD.MM.YYYY"),
    },
    {
      title: "Название",
      dataIndex: "name",
      width: 220,
    },
    {
      title: "Сумма",
      dataIndex: "amount",
      width: 180,
      render: formatMoney,
    },
    {
      title: "Комментарий",
      dataIndex: "comment",
      render: (value) =>
        value ? value : <Text type="secondary">Без комментария</Text>,
    },
  ];

  return (
    <Card title="Прочие расходы">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={rows}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
        locale={{
          emptyText: "За выбранный период расходов нет",
        }}
      />
    </Card>
  );
}