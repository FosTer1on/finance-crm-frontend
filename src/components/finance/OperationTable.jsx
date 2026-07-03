import { Table } from "antd";

export default function OperationTable({
  columns,
  dataSource,
  loading = false,
  rowKey = "id",
  scrollX = 1400,
}) {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      pagination={false}
      scroll={{ x: scrollX }}
    />
  );
}