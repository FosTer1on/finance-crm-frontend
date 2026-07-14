import { Card, Empty, Space, Table, Typography } from "antd";
import dayjs from "dayjs";

import { formatMoney } from "@/utils/formatMoney";
import { formatUsd } from "../../utils/formatCurrency";

const { Text } = Typography;

const renderResult = (uzs, usd) => (
  <Space direction="vertical" size={0}>
    <Text strong>{formatMoney(uzs)}</Text>
    <Text type="secondary">{formatUsd(usd)}</Text>
  </Space>
);

export default function OperationsReportTable({ rows = [] }) {
  const columns = [
    {
      title: "Дата",
      dataIndex: "date",
      width: 130,
      render: (value) => dayjs(value).format("DD.MM.YYYY"),
    },
    {
      title: "Имя",
      dataIndex: "sender_person",
      width: 180,
    },
    {
      title: "Фирма прихода",
      dataIndex: "sender_company",
      width: 220,
    },
    {
      title: "Сумма прихода",
      dataIndex: "incoming_amount",
      width: 190,
      render: formatMoney,
    },
    {
      title: "% прихода",
      dataIndex: "incoming_percent",
      width: 120,
    },
    {
      title: "Курс прихода",
      dataIndex: "incoming_usd_rate",
      width: 150,
      render: formatMoney,
    },
    {
      title: "К выдаче",
      width: 210,
      render: (_, row) =>
        renderResult(row.amount_to_give_uzs, row.amount_to_give_usd),
    },
    {
      title: "Кому",
      dataIndex: "receiver_person",
      width: 180,
    },
    {
      title: "Фирма получения",
      dataIndex: "receiver_company",
      width: 220,
    },
    {
      title: "% получения",
      dataIndex: "outgoing_percent",
      width: 135,
    },
    {
      title: "Курс получения",
      dataIndex: "outgoing_usd_rate",
      width: 160,
      render: formatMoney,
    },
    {
      title: "К получению",
      width: 210,
      render: (_, row) =>
        renderResult(row.amount_to_receive_uzs, row.amount_to_receive_usd),
    },
    {
      title: "Прибыль",
      width: 210,
      render: (_, row) => renderResult(row.profit_uzs, row.profit_usd),
    },
    {
      title: "Комментарий",
      dataIndex: "comment",
      width: 240,
      render: (value) => value || "—",
    },
  ];

  return (
    <Card title="Все операции" style={{ marginTop: 16 }}>
      {rows.length === 0 ? (
        <Empty description="Операций за период нет" />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={rows}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: [20, 50, 100],
          }}
          scroll={{ x: 2700 }}
        />
      )}
    </Card>
  );
}
