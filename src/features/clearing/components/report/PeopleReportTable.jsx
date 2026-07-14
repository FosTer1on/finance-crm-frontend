import { Card, Empty, Table, Tag } from "antd";

import { formatMoney } from "@/utils/formatMoney";
import { formatUsd } from "../../utils/formatCurrency";

const getStatus = (row) => {
  if (row.status === "we_owe") {
    return <Tag color="orange">Мы должны отдать</Tag>;
  }

  if (row.status === "owes_us") {
    return <Tag color="green">Должен отдать нам</Tag>;
  }

  return <Tag>Расчёт закрыт</Tag>;
};

export default function PeopleReportTable({ rows = [] }) {
  const columns = [
    {
      title: "Человек",
      dataIndex: "person_name",
      width: 220,
    },
    {
      title: "Итог, сум",
      dataIndex: "balance_uzs",
      width: 220,
      render: formatMoney,
    },
    {
      title: "Итог, $",
      dataIndex: "balance_usd",
      width: 180,
      render: formatUsd,
    },
    {
      title: "Статус",
      width: 200,
      render: (_, row) => getStatus(row),
    },
    {
      title: "Как отправитель",
      dataIndex: "sent_operations_count",
      width: 170,
    },
    {
      title: "Как получатель",
      dataIndex: "received_operations_count",
      width: 170,
    },
  ];

  return (
    <Card title="Взаиморасчёты по людям" style={{ marginTop: 16 }}>
      {rows.length === 0 ? (
        <Empty description="За выбранный период данных нет" />
      ) : (
        <Table
          rowKey="person_id"
          columns={columns}
          dataSource={rows}
          pagination={false}
          scroll={{ x: 1150 }}
        />
      )}
    </Card>
  );
}
