import { Card, Space, Typography } from "antd";
import { formatMoney } from "@utils/formatMoney";

const { Text } = Typography;

export default function OperationSummaryCard({ summary, variant = "standard" }) {
  if (variant === "den_xan") {
    return (
      <Card size="small" style={{ marginTop: 16 }}>
        <Space size="large" wrap>
          <Text>Общая сумма: {formatMoney(summary.totalAmount)}</Text>
          <Text>Прибыль: {formatMoney(summary.totalProfit)}</Text>
          <Text>MTG: {formatMoney(summary.totalMtg)}</Text>
          <Text>DEN XAN GROUP: {formatMoney(summary.totalCompanyAmount)}</Text>
          <Text>Всего: {summary.operationsCount}</Text>
          <Text>Completed: {summary.completedCount}</Text>
          <Text>Cancelled: {summary.cancelledCount}</Text>
        </Space>
      </Card>
    );
  }

  return (
    <Card size="small" style={{ marginTop: 16 }}>
      <Space size="large" wrap>
        <Text>Общая сумма: {formatMoney(summary.totalAmount)}</Text>
        <Text>После %: {formatMoney(summary.totalAfterPercent)}</Text>
        <Text>Всего: {summary.operationsCount}</Text>
        <Text>Completed: {summary.completedCount}</Text>
        <Text>Cancelled: {summary.cancelledCount}</Text>
      </Space>
    </Card>
  );
}