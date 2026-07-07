import { Card, Space, Typography } from "antd";
import { formatMoney } from "@/utils/formatMoney";

const { Text } = Typography;

export default function DenXanSummary({ summary }) {
  if (!summary) return null;

  return (
    <Card size="small" style={{ marginTop: 16 }}>
      <Space wrap size="large">
        <Text>Прибыль: <b>{formatMoney(summary.profit)}</b></Text>
        <Text>MTG: <b>{formatMoney(summary.mtg)}</b></Text>
        <Text>На счет DEN XAN: <b>{formatMoney(summary.to_den_xan_account)}</b></Text>
        <Text>Нужно отдать: <b>{formatMoney(summary.need_to_give)}</b></Text>
        <Text>Нужно получить: <b>{formatMoney(summary.need_to_receive)}</b></Text>
      </Space>
    </Card>
  );
}