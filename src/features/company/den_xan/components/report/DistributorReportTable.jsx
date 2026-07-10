import { Card, Table } from "antd";
import { formatMoney } from "@/utils/formatMoney";

const moneyColumn = (title, dataIndex, width = 160) => ({
  title,
  dataIndex,
  width,
  render: formatMoney,
});

export default function DistributorReportTable({ rows = [] }) {
  const columns = [
    {
      title: "Дистрибьютор",
      dataIndex: "distributor",
      width: 180,
      fixed: "left",
    },
    moneyColumn("Приход", "incoming"),
    moneyColumn("Прибыль", "profit"),
    moneyColumn("MTG", "mtg"),
    moneyColumn("Поступило на счёт", "to_account", 180),
    moneyColumn("Отдали", "given"),
    moneyColumn("Исход", "outgoing"),
    moneyColumn("Нужно получить", "need_to_receive", 180),
    {
      title: "Операций",
      dataIndex: "operations_count",
      width: 100,
    },
  ];

  return (
    <Card title="По дистрибьюторам">
      <Table
        rowKey="distributor_id"
        columns={columns}
        dataSource={rows}
        pagination={false}
        scroll={{ x: 1350 }}
        locale={{
          emptyText: "За выбранный период операций нет",
        }}
      />
    </Card>
  );
}