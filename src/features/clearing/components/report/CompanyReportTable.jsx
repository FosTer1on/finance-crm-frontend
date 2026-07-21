import { Card, Empty, Space, Table, Typography } from "antd";

import { formatMoney } from "@/shared/utils/formatMoney";
import { formatUsd } from "../../utils/formatCurrency";

const { Text } = Typography;

const renderMoneyWithUsd = (uzs, usd) => (
  <Space direction="vertical" size={0}>
    <Text strong>{formatMoney(uzs)}</Text>
    <Text type="secondary">{formatUsd(usd)}</Text>
  </Space>
);

export default function CompanyReportTable({ rows = [] }) {
  const columns = [
    {
      title: "Фирма",
      dataIndex: "company_name",
      width: 240,
    },
    {
      title: "Общий приход",
      dataIndex: "incoming_total",
      width: 210,
      render: formatMoney,
    },
    {
      title: "К выдаче",
      width: 220,
      render: (_, row) =>
        renderMoneyWithUsd(
          row.amount_to_give_total,
          row.amount_to_give_usd_total
        ),
    },
    {
      title: "К получению",
      width: 220,
      render: (_, row) =>
        renderMoneyWithUsd(
          row.amount_to_receive_total,
          row.amount_to_receive_usd_total
        ),
    },
    {
      title: "Операций отправки",
      dataIndex: "sent_operations_count",
      width: 170,
    },
    {
      title: "Операций получения",
      dataIndex: "received_operations_count",
      width: 180,
    },
    {
      title: "Всего операций",
      dataIndex: "operations_count",
      width: 160,
    },
  ];

  return (
    <Card title="Итоги по фирмам" style={{ marginTop: 16 }}>
      {rows.length === 0 ? (
        <Empty description="За выбранный период фирм нет" />
      ) : (
        <Table
          rowKey="company_id"
          columns={columns}
          dataSource={rows}
          pagination={false}
          scroll={{ x: 1400 }}
        />
      )}
    </Card>
  );
}
