import { Card, Table, Tag } from "antd";
import dayjs from "dayjs";

import { formatMoney } from "@/utils/formatMoney";

const moneyColumn = (title, dataIndex, width = 150) => ({
  title,
  dataIndex,
  width,
  render: formatMoney,
});

export default function OperationsReportTable({ rows = [] }) {
  const columns = [
    {
      title: "Дата",
      dataIndex: "date",
      width: 110,
      fixed: "left",
      render: (value) => dayjs(value).format("DD.MM.YYYY"),
    },
    {
      title: "Дистрибьютор",
      dataIndex: "distributor",
      width: 180,
      fixed: "left",
    },
    moneyColumn("Приход", "incoming"),
    {
      title: "% прихода",
      dataIndex: "incoming_percent",
      width: 110,
      render: (value) => `${Number(value || 0)}%`,
    },
    moneyColumn("Прибыль", "profit"),
    moneyColumn("MTG", "mtg"),
    moneyColumn("Поступило на счёт", "to_account", 180),
    moneyColumn("Отдали", "given"),
    moneyColumn("Исход", "outgoing"),
    {
      title: "% исхода",
      dataIndex: "outgoing_percent",
      width: 110,
      render: (value) => `${Number(value || 0)}%`,
    },
    moneyColumn("Нужно получить", "need_to_receive", 180),
    {
      title: "Фирма исхода",
      dataIndex: "outgoing_partner",
      width: 180,
      render: (value) =>
        value ? <Tag color="blue">{value}</Tag> : "Не указана",
    },
  ];

  return (
    <Card title="Все операции">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={rows}
        pagination={{
          pageSize: 20,
          showSizeChanger: false,
        }}
        scroll={{ x: 1700 }}
        locale={{
          emptyText: "За выбранный период операций нет",
        }}
      />
    </Card>
  );
}