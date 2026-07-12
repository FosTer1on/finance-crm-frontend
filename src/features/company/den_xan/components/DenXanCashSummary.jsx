import { Card, Col, Row, Statistic, Typography } from "antd";

import { formatUsd } from "../utils/formatCurrency";

const { Text } = Typography;

export default function DenXanCashSummary({ account, summary }) {
  if (!account && !summary) {
    return null;
  }

  return (
    <Card size="small" style={{ marginTop: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Statistic
            title="Текущий кэш-баланс"
            value={summary?.balance ?? account?.balance ?? 0}
            formatter={(value) => formatUsd(value)}
          />

          <Text type="secondary">
            Баланс хранится в долларах и изменяется только через операции.
            Начальное значение задаётся через админку.
          </Text>
        </Col>

        <Col xs={24} sm={12}>
          <Statistic
            title="Операций за выбранный период"
            value={summary?.operations_count || 0}
          />
        </Col>
      </Row>
    </Card>
  );
}
