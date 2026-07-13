import { Card, Empty, Table, Tag } from "antd";

import { formatMoney } from "@/utils/formatMoney";
import { formatUsd } from "../utils/formatCurrency";

const getStatusTag = (row) => {
  if (row.status === "we_owe") {
    return <Tag color="orange">Мы должны отдать</Tag>;
  }

  if (row.status === "owes_us") {
    return <Tag color="green">Должен отдать нам</Tag>;
  }

  return <Tag>Расчёт закрыт</Tag>;
};

export default function ClearingPeopleBalances({ rows = [] }) {
  const columns = [
    {
      title: "Человек",
      dataIndex: "person_name",
      width: 220,
    },
    {
      title: "Результат, сум",
      dataIndex: "balance_uzs",
      width: 220,
      render: (value) => formatMoney(value),
    },
    {
      title: "Результат, $",
      dataIndex: "balance_usd",
      width: 180,
      render: (value) => formatUsd(value),
    },
    {
      title: "Статус",
      width: 200,
      render: (_, row) => getStatusTag(row),
    },
    {
      title: "Операций как отправитель",
      dataIndex: "sent_operations_count",
      width: 190,
    },
    {
      title: "Операций как получатель",
      dataIndex: "received_operations_count",
      width: 190,
    },
  ];

  return (
    <Card title="Взаиморасчёты по людям" style={{ marginTop: 16 }}>
      {rows.length === 0 ? (
        <Empty description="Нет данных за выбранный день" />
      ) : (
        <Table
          rowKey="person_id"
          columns={columns}
          dataSource={rows}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      )}
    </Card>
  );
}
