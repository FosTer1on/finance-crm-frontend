import { Card, Space, Typography } from "antd";
import { formatMoney } from "@/utils/formatMoney";

const { Text } = Typography;

export default function DenXanExpenseSummary({ summary }) {
  if (!summary) return null;

  return (
    <Card size="small" style={{ marginTop: 16 }}>
      <Space wrap size="large">
        <Text>
          Общая сумма расходов: <b>{formatMoney(summary.total_amount)}</b>
        </Text>
        <Text>
          Кол-во оплат: <b>{summary.payments_count || 0}</b>
        </Text>
      </Space>
    </Card>
  );
}